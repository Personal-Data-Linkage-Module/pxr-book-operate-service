/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 *
 *
 *
 * $Date$
 * $Revision$
 * $Author$
 *
 * TEMPLATE VERSION :  76463
 */

/* eslint-disable */
import { Service } from 'typedi';
import DocumentServiceDto from './dto/DocumentServiceDto';
import MyConditionBook from '../repositories/postgres/MyConditionBook';
import Document from '../repositories/postgres/Document';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import Event from '../repositories/postgres/Event';
import { connectDatabase } from '../common/Connection';
import EntityOperation from '../repositories/EntityOperation';
import PostDocumentByUserIdResDto from '../resources/dto/PostDocumentByUserIdResDto';
import PutDocumentByUserIdResDto from '../resources/dto/PutDocumentByUserIdResDto';
import DeleteDocumentByUserIdResDto from '../resources/dto/DeleteDocumentByUserIdResDto';
import AppError from '../common/AppError';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../common/ResponseCode';
import { v4 as uuid } from 'uuid';
import DocumentEventSetRelation from '../repositories/postgres/DocumentEventSetRelation';
import EventSetEventRelation from '../repositories/postgres/EventSetEventRelation';
import Cmatrix2n from '../repositories/postgres/Cmatrix2n';
import Cmatrix2nRelation from '../repositories/postgres/Cmatrix2nRelation';
import CTokenService from './CTokenService';
import CTokenDto from './dto/CTokenDto';
import Config from '../common/Config';
import OperatorReqDto from '../resources/dto/OperatorReqDto';
import { EntityManager } from 'typeorm';
/* eslint-enable */
const config = Config.ReadConfig('./config/config.json');

@Service()
export default class DocumentService {
    /**
     * ドキュメント蓄積
     * @param documentDto
     *
     * RefactorDescription:
     *  #3803 : checkLicence
     *  #3803 : getTargetEventsForAdd
     *  #3803 : saveLocalCtoken
     */
    public async addDocument (documentDto: DocumentServiceDto): Promise<any> {
        // 各情報を取得
        const operator = documentDto.getOperator();
        const message = documentDto.getMessage();

        // リクエストテンプレートを取得
        const template = documentDto.getRequestObject();

        // My-Condition-Bookテーブルのレコードを取得
        const myConditionBookInfo: MyConditionBook = await EntityOperation.getContBookRecordFromUserId(documentDto.getUserId());
        // 対象データが存在しない場合
        if (!myConditionBookInfo) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // Block外蓄積機能を確認
        const outerBlockStore = config['outerBlockStore'];

        // ドキュメント識別子をuuidで採番
        const documentIdentifier: string = uuid();

        // 生成したドキュメント識別子を設定
        template['id']['value'] = documentIdentifier;

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // 登録データを生成
            const documentActorCode: number = template['app'] ? template['app']['code']['value']['_value'] : template['wf']['code']['value']['_value'];
            const documentActorVersion: number = template['app'] ? template['app']['code']['value']['_ver'] : template['wf']['code']['value']['_ver'];
            // APP
            const appCatalogCode: number = template['app'] ? template['app']['app']['value']['_value'] : null;
            const appCatalogVersion: number = template['app'] ? template['app']['app']['value']['_ver'] : null;
            // WF
            const wfCatalogCode: number = null;
            const wfCatalogVersion: number = null;
            const wfRoleCode: number = null;
            const wfRoleVersion: number = null;
            const wfStaffIdentifier: string = null;
            // Block外蓄積機能がOFFの場合
            const documentTemplate = !outerBlockStore ? JSON.stringify(template) : null;

            const entity: Document = new Document({
                my_condition_book_id: myConditionBookInfo.id,
                source_id: template['sourceId'],
                doc_identifier: documentIdentifier,
                doc_catalog_code: template['code']['value']['_value'],
                doc_catalog_version: template['code']['value']['_ver'],
                doc_create_at: template['createdAt']['value'],
                doc_actor_code: documentActorCode,
                doc_actor_version: documentActorVersion,
                wf_catalog_code: wfCatalogCode,
                wf_catalog_version: wfCatalogVersion,
                wf_role_code: wfRoleCode,
                wf_role_version: wfRoleVersion,
                wf_staff_identifier: wfStaffIdentifier,
                app_catalog_code: appCatalogCode,
                app_catalog_version: appCatalogVersion,
                template: documentTemplate,
                attributes: null,
                created_by: operator.getLoginId(),
                updated_by: operator.getLoginId()
            });

            // ドキュメントテーブルにレコードを登録
            const insertDocRes = await EntityOperation.insertDocumentRecord(trans, entity);
            const document: Document = insertDocRes.raw[0];

            // 対象イベント識別子を取得
            const targetEvents: Set<string> = await this.getTargetEventsForAdd(template, document, operator, trans, documentDto, message);

            // CMatrix2(n)テーブルにレコードを登録
            const cmatrix2n: Cmatrix2n = new Cmatrix2n({
                _1_1: documentIdentifier,
                _1_2_1: Number(template['code']['value']['_value']),
                _1_2_2: Number(template['code']['value']['_ver']),
                _2_1: template['createdAt']['value'],
                _3_1_1: Number(documentActorCode),
                _3_1_2: Number(documentActorVersion),
                _3_2_1: 0,
                _3_2_2: 0,
                _3_3_1: 0,
                _3_3_2: 0,
                _3_4: wfStaffIdentifier,
                _3_5_1: appCatalogCode ? Number(appCatalogCode) : 0,
                _3_5_2: appCatalogVersion ? Number(appCatalogVersion) : 0,
                created_by: operator.getLoginId(),
                updated_by: operator.getLoginId()
            });
            const insertRes = await EntityOperation.insertCMatrix2nRecord(trans, cmatrix2n);
            const cmatrix2nId = insertRes.raw[0].id;
            const cmatrix2nList: Cmatrix2n[] = [cmatrix2n];

            for (const eventId of targetEvents) {
                // 上記で取得したドキュメントに追加する対象のイベントのイベント識別子をキーに CMatrixイベント を取得する
                const cmatrixEventList: CmatrixEvent[] = await EntityOperation.getCMatrixEventRecord(documentDto.getUserId(), eventId);
                if (!cmatrixEventList || cmatrixEventList.length !== 1) {
                    // 対象データが存在しない場合、エラーを返す
                    throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
                }

                // CMatrix2(n)リレーションテーブルにレコードを登録
                const cmatrix2nRelation: Cmatrix2nRelation = new Cmatrix2nRelation({
                    n: document.id,
                    cmatrix_event_id: cmatrixEventList[0].id,
                    cmatrix_2n_id: cmatrix2nId,
                    created_by: operator.getLoginId(),
                    updated_by: operator.getLoginId()
                });
                await EntityOperation.insertCMatrix2nRelationReceord(trans, cmatrix2nRelation);

                // Local-CTokenを更新
                await this.saveLocalCtoken('add', cmatrixEventList[0].id, documentDto, cmatrix2nList, cmatrixEventList);
            }
        }).catch(err => {
            throw err;
        });

        // レスポンスを生成
        const response: PostDocumentByUserIdResDto = new PostDocumentByUserIdResDto();
        response.setFromJson(template);
        response.responseObject['id']['value'] = documentIdentifier;

        // レスポンスを返す
        return response;
    }

    /**
     * 蓄積用対象イベント識別子取得
     * @param template
     * @param document
     * @param operator
     * @param trans
     * @param documentDto
     * @param message
     * @returns
     */
    private async getTargetEventsForAdd (template: {}, document: Document, operator: OperatorReqDto, trans: EntityManager, documentDto: DocumentServiceDto, message: any) {
        const targetEvents: Set<string> = new Set();
        for (const chapter of template['chapter']) {
            const documentEventSetRelation: DocumentEventSetRelation = new DocumentEventSetRelation({
                document_id: document.id,
                title: chapter['title'],
                attribute: null,
                created_by: operator.getLoginId(),
                updated_by: operator.getLoginId()
            });
            const upsertRes = await EntityOperation.insertDocumentEventSetRelationRecord(trans, documentEventSetRelation);
            const documentSet: DocumentEventSetRelation = upsertRes.raw[0];

            // イベントセットイベントリレーションレコードを登録
            for (const sourceId of chapter['sourceId']) {
                // リクエスト.chapter.sourceId から、ドキュメントに追加する対象のイベントを取得する
                const events: Event[] = await EntityOperation.getEventRecord(documentDto.getUserId(), null, sourceId);
                if (events.length === 0) {
                    throw new AppError(message.NOT_EXIST_EVENT, ResponseCode.BAD_REQUEST);
                }
                for (const event of events) {
                    if (!targetEvents.has(event.eventIdentifier)) {
                        const eventSetEvent: EventSetEventRelation = new EventSetEventRelation({
                            event_set_id: documentSet.id,
                            event_id: event.getId(),
                            source_id_at_created: sourceId,
                            created_by: operator.getLoginId(),
                            updated_by: operator.getLoginId()
                        });
                        await EntityOperation.insertEventSetEventRelation(trans, eventSetEvent);
                        targetEvents.add(event.eventIdentifier);
                    }
                }
            }
            for (const eventId of chapter['event']) {
                // リクエスト.chapter.event から、ドキュメントに追加する対象のイベントを取得する
                const events: Event[] = await EntityOperation.getEventRecord(documentDto.getUserId(), eventId, null);
                if (events.length === 0) {
                    throw new AppError(message.NOT_EXIST_EVENT, ResponseCode.BAD_REQUEST);
                }
                for (const event of events) {
                    if (!targetEvents.has(event.eventIdentifier)) {
                        const eventSetEvent: EventSetEventRelation = new EventSetEventRelation({
                            event_set_id: documentSet.id,
                            event_id: event.getId(),
                            source_id_at_created: null,
                            created_by: operator.getLoginId(),
                            updated_by: operator.getLoginId()
                        });
                        await EntityOperation.insertEventSetEventRelation(trans, eventSetEvent);
                        targetEvents.add(event.eventIdentifier);
                    }
                }
            }
        }
        return targetEvents;
    }

    /**
     * ドキュメント更新
     * @param documentDto
     *
     * RefactorDescription:
     *  #3803 : checkLicence
     *  #3803 : checkRequestInfo
     *  #3803 : getTargetEventsForUpdate
     *  #3803 : saveLocalCtoken
     */
    public async updateDocument (documentDto: DocumentServiceDto): Promise<any> {
        // 各情報を取得
        const operator = documentDto.getOperator();
        const message = documentDto.getMessage();

        // ドキュメントテーブルのレコードを取得
        const documentList: Document[] = await EntityOperation.getDocumentRecord(documentDto.getUserId(), documentDto.getDocumentIdentifer(), documentDto.getSourceId());
        // 対象データが1件以外の場合
        if (!documentList || documentList.length !== 1) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // ドキュメント情報の先頭を固定で取得
        const documentInfo: Document = documentList[0];

        // リクエストテンプレートを取得
        const template = documentDto.getRequestObject();

        // ドキュメント情報とリクエスト情報の不整合を確認
        this.checkRequestInfo(template, documentInfo, message);

        // Block外蓄積機能を確認
        const outerBlockStore = config['outerBlockStore'];

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // 登録データを生成
            const wfRoleCode: number = null;
            const wfRoleVersion: number = null;
            const wfStaffIdentifier: string = null;
            // Block外蓄積機能がOFFの場合
            const documentTemplate = !outerBlockStore ? JSON.stringify(template) : null;

            const entity: Document = Object.assign(documentInfo);
            entity.sourceId = template['sourceId'];
            entity.docCreateAt = template['createdAt']['value'];
            entity.wfRoleCode = wfRoleCode;
            entity.wfRoleVersion = wfRoleVersion;
            entity.wfStaffIdentifier = wfStaffIdentifier;
            entity.template = documentTemplate;
            entity.updatedBy = operator.getLoginId();
            // ドキュメントテーブルのレコードを更新
            await EntityOperation.updateDocumentRecord(trans, documentInfo.getId(), entity);

            // 対象イベント識別子を取得
            const targetEvents: Set<string> = await this.getTargetEventsForUpdate(template, documentInfo, operator, trans, documentDto);

            // CMatrix2(n)テーブルにレコードを更新
            const cmatrix2nList: Cmatrix2n[] = await EntityOperation.getCMatrix2nsByDocumentIdentifier([documentInfo.getdocIdentifier()]);
            if (!cmatrix2nList || cmatrix2nList.length !== 1) {
                // 対象データが存在しない場合、エラーを返す
                throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
            }

            for (const cmatrix2n of cmatrix2nList) {
                cmatrix2n.docCreateAt = template['createdAt']['value'];
                cmatrix2n.docWfRoleCode = 0;
                cmatrix2n.docWfRoleVersion = 0;
                cmatrix2n.docWfStaffIdentifier = wfStaffIdentifier;
                await EntityOperation.updateCMatrix2nRecord(trans, cmatrix2n);
            }

            for (const eventId of targetEvents) {
                // 上記で取得したドキュメントに追加する対象のイベントのイベント識別子をキーに CMatrixイベント を取得する
                const cmatrixEventList: CmatrixEvent[] = await EntityOperation.getCMatrixEventRecord(documentDto.getUserId(), eventId);
                if (!cmatrixEventList || cmatrixEventList.length !== 1) {
                    // 対象データが存在しない場合、エラーを返す
                    throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
                }

                const cmatrix2nRelationList: Cmatrix2nRelation[] = await EntityOperation.getCMatrix2nRelationRecord(documentInfo.getId(), cmatrixEventList[0].getId(), cmatrix2nList[0].id);
                // CMatrix2(n)リレーションテーブルにレコードを登録/更新
                if (cmatrix2nRelationList.length > 0) {
                    for (const cmatrix2nRelation of cmatrix2nRelationList) {
                        cmatrix2nRelation.nDocumentNo = documentInfo.getId();
                        cmatrix2nRelation.cmatrixEventId = cmatrixEventList[0].getId();
                        cmatrix2nRelation.cmatrix2nId = cmatrix2nList[0].id;
                        cmatrix2nRelation.updatedBy = operator.getLoginId();
                        await EntityOperation.updateCMatrix2nRelationReceord(trans, cmatrix2nRelation);
                    }
                } else {
                    const cmatrix2nRelation: Cmatrix2nRelation = new Cmatrix2nRelation({
                        n: documentInfo.getId(),
                        cmatrix_event_id: cmatrixEventList[0].getId(),
                        cmatrix_2n_id: cmatrix2nList[0].id,
                        created_by: operator.getLoginId(),
                        updated_by: operator.getLoginId()
                    });
                    await EntityOperation.insertCMatrix2nRelationReceord(trans, cmatrix2nRelation);
                }

                // Local-CTokenを更新
                await this.saveLocalCtoken('update', cmatrixEventList[0].id, documentDto, cmatrix2nList, cmatrixEventList);
            }
        }).catch(err => {
            throw err;
        });
        // レスポンスを生成
        const response: PutDocumentByUserIdResDto = new PutDocumentByUserIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * 更新用対象イベント識別子取得
     * @param template
     * @param documentInfo
     * @param operator
     * @param trans
     * @param documentDto
     * @returns
     */
    private async getTargetEventsForUpdate (template: {}, documentInfo: Document, operator: OperatorReqDto, trans: EntityManager, documentDto: DocumentServiceDto) {
        const targetEvents: Set<string> = new Set();
        let eventSetId;
        for (const chapter of template['chapter']) {
            // ドキュメントイベントセットリレーションレコードを登録/更新
            const docEventSetList: DocumentEventSetRelation[] = await EntityOperation.getDocumentEventSetRelationRecord(documentInfo.getId(), chapter['title']);
            if (docEventSetList.length > 0) {
                for (const docEventSet of docEventSetList) {
                    // 更新
                    docEventSet.documentId = documentInfo.getId();
                    docEventSet.title = chapter['title'];
                    docEventSet.updatedBy = operator.getLoginId();
                    await EntityOperation.updateDocumentEventSetRelationRecord(trans, docEventSet);
                    eventSetId = docEventSet.id;
                }
            } else {
                // 登録
                const docEventSet: DocumentEventSetRelation = new DocumentEventSetRelation({
                    document_id: documentInfo.getId(),
                    title: chapter['title'],
                    attributes: null,
                    created_by: operator.getLoginId(),
                    updated_by: operator.getLoginId()
                });
                const insertRes = await EntityOperation.insertDocumentEventSetRelationRecord(trans, docEventSet);
                eventSetId = insertRes.raw[0].id;
            }

            // イベントセットイベントリレーションレコードを登録/更新
            for (const sourceId of chapter['sourceId']) {
                // リクエスト.chapter.sourceId から、ドキュメントに追加する対象のイベントを取得する
                const events: Event[] = await EntityOperation.getEventRecord(documentDto.getUserId(), null, sourceId);
                for (const event of events) {
                    if (!targetEvents.has(event.eventIdentifier)) {
                        const eventSetEventList: EventSetEventRelation[] = await EntityOperation.getEventSetEventRelationRecord(eventSetId, event.id);
                        if (eventSetEventList.length > 0) {
                            for (const eventSetEvent of eventSetEventList) {
                                // 更新
                                eventSetEvent.eventSetId = eventSetId;
                                eventSetEvent.eventId = event.getId();
                                eventSetEvent.sourceIdAtCreated = sourceId;
                                eventSetEvent.updatedBy = operator.getLoginId();
                                await EntityOperation.updateEventSetEventRelation(trans, eventSetEvent);
                            }
                        } else {
                            // 登録
                            const eventSetEvent: EventSetEventRelation = new EventSetEventRelation({
                                event_set_id: eventSetId,
                                event_id: event.getId(),
                                source_id_at_created: sourceId,
                                created_by: operator.getLoginId(),
                                updated_by: operator.getLoginId()
                            });
                            await EntityOperation.insertEventSetEventRelation(trans, eventSetEvent);
                        }
                        targetEvents.add(event.eventIdentifier);
                    }
                }
            }
            for (const eventId of chapter['event']) {
                // リクエスト.chapter.event から、ドキュメントに追加する対象のイベントを取得する
                const events: Event[] = await EntityOperation.getEventRecord(documentDto.getUserId(), eventId, null);
                for (const event of events) {
                    if (!targetEvents.has(event.eventIdentifier)) {
                        const eventSetEventList: EventSetEventRelation[] = await EntityOperation.getEventSetEventRelationRecord(eventSetId, event.id);
                        if (eventSetEventList.length > 0) {
                            for (const eventSetEvent of eventSetEventList) {
                                // 更新
                                eventSetEvent.eventSetId = eventSetId;
                                eventSetEvent.eventId = event.getId();
                                eventSetEvent.sourceIdAtCreated = null;
                                eventSetEvent.updatedBy = operator.getLoginId();
                                await EntityOperation.updateEventSetEventRelation(trans, eventSetEvent);
                            }
                        } else {
                            // 登録
                            const eventSetEvent: EventSetEventRelation = new EventSetEventRelation({
                                event_set_id: eventSetId,
                                event_id: event.getId(),
                                source_id_at_created: null,
                                created_by: operator.getLoginId(),
                                updated_by: operator.getLoginId()
                            });
                            await EntityOperation.insertEventSetEventRelation(trans, eventSetEvent);
                        }
                        targetEvents.add(event.eventIdentifier);
                    }
                }
            }
        }
        return targetEvents;
    }

    /**
     * ドキュメント情報とリクエスト情報の不整合を確認
     * @param template
     * @param documentInfo
     * @param message
     */
    private checkRequestInfo (template: {}, documentInfo: Document, message: any) {
        if (documentInfo.getdocIdentifier() !== template['id']['value']) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'id'), ResponseCode.BAD_REQUEST);
        }
        if (documentInfo.getdocCatalogCode() !== Number(template['code']['value']['_value']) ||
            documentInfo.getdocCatalogVersion() !== Number(template['code']['value']['_ver'])) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'code'), ResponseCode.BAD_REQUEST);
        }
        if (template['app']) {
            if (documentInfo.getdocActorCode() !== Number(template['app']['code']['value']['_value']) ||
                documentInfo.getdocActorVersion() !== Number(template['app']['code']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.code'), ResponseCode.BAD_REQUEST);
            }
            if (documentInfo.getAppCatalogCode() !== Number(template['app']['app']['value']['_value']) ||
                documentInfo.getAppCatalogVersion() !== Number(template['app']['app']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.app'), ResponseCode.BAD_REQUEST);
            }
        } else {
            if (documentInfo.getdocActorCode() !== Number(template['wf']['code']['value']['_value']) ||
                documentInfo.getdocActorVersion() !== Number(template['wf']['code']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
            }
            if (documentInfo.getWfCatalogCode() !== Number(template['wf']['wf']['value']['_value']) ||
                documentInfo.getWfCatalogVersion() !== Number(template['wf']['wf']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
            }
        }
    }

    /**
     * ドキュメント削除
     * @param documentDto
     *
     * RefactorDescription:
     *  #3803 : getEventSetIdsAndCmatrixEventList
     *  #3803 : saveLocalCtoken
     */
    public async deleteDocument (documentDto: DocumentServiceDto): Promise<any> {
        const message = documentDto.getMessage();
        const operator = documentDto.getOperator();
        const template = documentDto.getRequestObject();

        // ドキュメントテーブルのレコードを取得
        const documents: Document[] = await EntityOperation.getDocumentRecord(documentDto.getUserId(), documentDto.getDocumentIdentifer(), documentDto.getSourceId());
        // 対象データが存在しない場合
        if (!documents || documents.length <= 0) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            const targetDocumentIds: number[] = [];
            const targetDocumentIdentifies: string[] = [];
            documents.forEach((ele: Document) => {
                targetDocumentIds.push(ele.getId());
                targetDocumentIdentifies.push(ele.getdocIdentifier());
            });

            // イベントセットID、CMatrixEventListを取得
            const { eventSetIds, cmatrixEventList }: { eventSetIds: number[]; cmatrixEventList: CmatrixEvent[]; } = await this.getEventSetIdsAndCmatrixEventList(targetDocumentIds, documentDto);

            // ドキュメント削除
            await EntityOperation.deleteDocuments(trans, targetDocumentIds, operator.getLoginId());
            // ドキュメントイベントセットリレーション削除
            await EntityOperation.deleteDocumentEventSetRelations(trans, targetDocumentIds, operator.getLoginId());
            if (eventSetIds && eventSetIds.length > 0) {
                // イベントセットイベントリレーション削除
                await EntityOperation.deleteEventSetEventRelations(trans, eventSetIds, operator.getLoginId());
            }
            const cmatrix2nList: Cmatrix2n[] = await EntityOperation.getCMatrix2nsByDocumentIdentifier(targetDocumentIdentifies);
            const cmatrix2nIds: number[] = [];
            cmatrix2nList.forEach((ele: Cmatrix2n) => {
                cmatrix2nIds.push(ele.id);
            });
            // CMatrix2(n)列テーブルのレコードを削除
            if (cmatrix2nIds.length > 0) {
                await EntityOperation.deleteCMatrix2ns(trans, cmatrix2nIds, operator.getLoginId());
            }

            // CMatrix2(n)列リレーションレコードを取得
            const cmatrix2nRelations: Cmatrix2nRelation[] = await EntityOperation.getCMatrix2nRelationRecordByDocIds(targetDocumentIds);
            if (cmatrix2nRelations && cmatrix2nRelations.length > 0) {
                const targetCmatrix2nRelations: number[] = [];
                cmatrix2nRelations.forEach((ele: Cmatrix2nRelation) => {
                    targetCmatrix2nRelations.push(ele.id);
                });
                // CMatrix2(n)列リレーションのレコードの削除
                await EntityOperation.deleteCMatrix2nRelations(trans, targetCmatrix2nRelations, operator.getLoginId());
            }
            if (cmatrixEventList && cmatrixEventList.length > 0) {
                for (const cmatrixEvent of cmatrixEventList) {
                    // CMatrixモノテーブルのレコードを取得
                    await this.saveLocalCtoken('delete', cmatrixEvent.getId(), documentDto, cmatrix2nList, cmatrixEventList);
                }
            }
        }).catch(err => {
            throw err;
        });

        template['document'] = documents;
        // レスポンスを生成
        const response: DeleteDocumentByUserIdResDto = new DeleteDocumentByUserIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * イベントセットID、CMatrixEventListを取得
     * @param targetDocumentIds
     * @param documentDto
     * @returns
     */
    private async getEventSetIdsAndCmatrixEventList (targetDocumentIds: number[], documentDto: DocumentServiceDto) {
        const documentEventSetList: DocumentEventSetRelation[] = await EntityOperation.getDocumentEventSetRelations(targetDocumentIds);
        const eventSetEventList: EventSetEventRelation[] = [];
        const eventSetIds: number[] = [];
        for (const documentEventSet of documentEventSetList) {
            // イベントセットイベントリレーションを取得
            const eventSets: EventSetEventRelation[] = await EntityOperation.getEventSetEventRelationRecord(documentEventSet.getId(), null);
            eventSetEventList.push(...eventSets);
            eventSetIds.push(documentEventSet.getId());
        }
        let cmatrixEventList: CmatrixEvent[];
        for (const eventSetEvent of eventSetEventList) {
            // イベント CMatrixイベント を取得する
            const event: Event = await EntityOperation.getEventRecordById(eventSetEvent.getEventId());
            cmatrixEventList = await EntityOperation.getCMatrixEventRecord(documentDto.getUserId(), event.getEventIdentifier(), true);
        }
        return { eventSetIds, cmatrixEventList };
    }

    /**
     * Local-CToken登録/更新
     * @param method
     * @param CMatrixEventId
     * @param documentDto
     * @param cmatrix2nList
     * @param cmatrixEventList
     */
    private async saveLocalCtoken (method: string, CMatrixEventId: number, documentDto: DocumentServiceDto, cmatrix2nList: Cmatrix2n[], cmatrixEventList: CmatrixEvent[]) {
        const message = documentDto.getMessage();
        const operator = documentDto.getOperator();

        const cmatrixThingList: CmatrixThing[] = await EntityOperation.getCMatrixThingRecordByCMatrixEventId(CMatrixEventId);
        if (cmatrixThingList && cmatrixThingList.length > 0) {
            // Local-CTokenを登録/更新
            const ctokenDto: CTokenDto = new CTokenDto();
            ctokenDto.setOperator(operator);
            ctokenDto.setMessage(message);
            ctokenDto.setUrl(documentDto.getCTokenUrl());
            ctokenDto.setUserId(documentDto.getUserId());
            ctokenDto.setCmatrix2nList(cmatrix2nList);
            ctokenDto.setCmatrixEventList(cmatrixEventList);
            ctokenDto.setCmatrixThingList(cmatrixThingList);
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.saveLocalCToken(method, ctokenDto);
        }
    }
}
