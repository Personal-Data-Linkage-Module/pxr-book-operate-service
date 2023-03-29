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
import StoreServiceDto from './dto/StoreSreviceDto';
import Config from '../common/Config';
import AppError from '../common/AppError';
import EntityOperation from '../repositories/EntityOperation';
import Document from '../repositories/postgres/Document';
import DocumentEventSetRelation from '../repositories/postgres/DocumentEventSetRelation';
import Event from '../repositories/postgres/Event';
import Thing from '../repositories/postgres/Thing';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import Cmatrix2n from '../repositories/postgres/Cmatrix2n';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
import Cmatrix2nRelation from '../repositories/postgres/Cmatrix2nRelation';
import Operator from '../resources/dto/OperatorReqDto';
import { connectDatabase } from '../common/Connection';
import { ResponseCode } from '../common/ResponseCode';
import CTokenDto from './dto/CTokenDto';
import CTokenService from './CTokenService';
import { EntityManager } from 'typeorm';
import { sendMessage } from '../common/Sms_Stub';
/* eslint-enable */
const Configure = Config.ReadConfig('./config/config.json');
const Message = Config.ReadConfig('./config/message.json');

@Service()
export default class StoreService {
    /**
     * 蓄積イベント受信
     * @param dto
     *
     * RefactorDescription:
     *  #3803 : createReqBody
     */
    public async receiveStoreEvent (dto: StoreServiceDto) {
        // SNS メッセージ送信用リクエストボディ生成
        const { message, messageAttributes } = this.createReqBody(dto);
        // SNSでメッセージを送信する
        await sendMessage(JSON.stringify(message), messageAttributes);
        return { result: 'success' };
    }

    /**
     * SNS メッセージ送信用リクエストボディ生成
     * @param dto
     * @returns
     */
    private createReqBody (dto: StoreServiceDto) {
        const reqBody = dto.getRequestBody();
        const message: any = {
            userId: reqBody.userId,
            sourceActor: reqBody.sourceActor
        };
        if (reqBody.sourceApp) {
            message.sourceApp = {
                _value: Number(reqBody.sourceApp._value),
                _ver: Number(reqBody.sourceApp._ver)
            };
        } else {
            throw new AppError(Message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }

        message.identifier = reqBody.identifier;
        message.operate = reqBody.operate;
        if (reqBody.document) {
            message.document = {
                _value: Number(reqBody.document._value),
                _ver: Number(reqBody.document._ver)
            };
            message.operate += '-document';
        }
        if (reqBody.event) {
            message.event = {
                _value: Number(reqBody.event._value),
                _ver: Number(reqBody.event._ver)
            };
            message.operate += '-event';
        }
        if (reqBody.thing) {
            message.thing = {
                _value: Number(reqBody.thing._value),
                _ver: Number(reqBody.thing._ver)
            };
            message.operate += '-thing';
        }
        const messageAttributes: any = {
            type: {
                DataType: 'String',
                StringValue: 'store-event'
            },
            actor: {
                DataType: 'Number',
                StringValue: '' + reqBody.destinationActor._value
            }
        };
        if (reqBody.destinationApp) {
            messageAttributes.app = {
                DataType: 'Number',
                StringValue: '' + reqBody.destinationApp._value
            };
        } else {
            throw new AppError(Message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }
        return { message, messageAttributes, reqBody };
    }

    /**
     * 利用者蓄積データ削除（バッチ）
     * @param userId
     *
     * RefactorDescription:
     *  #3803 : deleteCmatrix
     */
    public async deleteUserStoreData (userId: string, physicalDelete: boolean, operator: Operator): Promise<any> {
        // ドキュメントテーブルのレコードを取得
        const documents: Document[] = await EntityOperation.getDocumentRecord(userId, null, null);
        // 対象データが存在しない場合
        if (!documents || documents.length <= 0) {
            // エラーを返す
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }
        const targetDocumentIds: number[] = [];
        const targetDocumentIdentifies: string[] = [];
        documents.forEach((ele: Document) => {
            targetDocumentIds.push(ele.getId());
            targetDocumentIdentifies.push(ele.getdocIdentifier());
        });
        // ドキュメントイベントセットリレーションのレコード取得
        const documentEventSetRelations = await EntityOperation.getDocumentEventSetRelations(targetDocumentIds);
        const targetEventSetIds: number[] = [];
        documentEventSetRelations.forEach((ele: DocumentEventSetRelation) => {
            targetEventSetIds.push(ele.getId());
        });

        // イベントテーブルのレコードを取得
        const events: Event[] = await EntityOperation.getEventRecord(userId, null, null);
        // 対象データが存在しない場合
        if (!events || events.length <= 0) {
            // エラーを返す
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }
        // モノテーブルのレコードを取得
        const things: Thing[] = await EntityOperation.getThingRecord(userId, null, null, null);
        if (!things || things.length <= 0) {
            // エラーを返す
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        const targetEventIds: number[] = [];
        const targetEventIdentifies: string[] = [];
        events.forEach((ele: Event) => {
            targetEventIds.push(ele.getId());
            targetEventIdentifies.push(ele.getEventIdentifier());
        });
        const targetThingIds: number[] = [];
        things.forEach((ele: Thing) => {
            targetThingIds.push(ele.getId());
        });

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            if (physicalDelete) {
                // バイナリファイルテーブルのレコードを削除
                await EntityOperation.physicalDeleteBinaryFiles(trans, targetThingIds);
                // モノテーブルのレコードを削除
                await EntityOperation.physicalDeleteThingsForEventIds(trans, targetEventIds);
                // イベントテーブルのレコードを削除
                await EntityOperation.physicalDeleteEvents(trans, targetEventIds);
                // イベントセットイベントリレーションのレコードを削除
                await EntityOperation.physicalDeleteEventSetEventRelations(trans, targetEventSetIds);
                // ドキュメントイベントセットリレーションのレコードを削除
                await EntityOperation.physicalDeleteDocumentEventSetRelations(trans, targetDocumentIds);
                // ドキュメントテーブルのレコードを削除
                await EntityOperation.physicalDeleteDocuments(trans, targetDocumentIds);
            } else {
                // バイナリファイルテーブルのレコードを削除
                await EntityOperation.deleteBinaryFiles(trans, targetThingIds, operator.getLoginId());
                // モノテーブルのレコードを削除
                await EntityOperation.deleteThingsForEventIds(trans, targetEventIds, operator.getLoginId());
                // イベントテーブルのレコードを削除
                await EntityOperation.deleteEvents(trans, targetEventIds, operator.getLoginId());
                // イベントセットイベントリレーションのレコードを削除
                await EntityOperation.deleteEventSetEventRelations(trans, targetEventSetIds, operator.getLoginId());
                // ドキュメントイベントセットリレーションのレコードを削除
                await EntityOperation.deleteDocumentEventSetRelations(trans, targetDocumentIds, operator.getLoginId());
                // ドキュメントテーブルのレコードを削除
                await EntityOperation.deleteDocuments(trans, targetDocumentIds, operator.getLoginId());
            }
            // Cmatrix関連のレコードを削除
            await this.deleteCmatrix(userId, targetEventIdentifies, targetDocumentIdentifies, trans, operator);
        }).catch(err => {
            throw err;
        });
        // レスポンスを生成
        const response = {
            result: 'success'
        };
        // レスポンスを返す
        return response;
    }

    /**
     * Cmatrix関連のレコードを削除
     * @param userId
     * @param targetEventIdentifies
     * @param targetDocumentIdentifies
     * @param trans
     * @param operator
     */
    private async deleteCmatrix (userId: string, targetEventIdentifies: string[], targetDocumentIdentifies: string[], trans: EntityManager, operator: Operator) {
        // CMatrixイベントのレコードを取得
        const cmatrixEvents: CmatrixEvent[] = await EntityOperation.getCMatrixEventsByEventIdentifier(userId, targetEventIdentifies);
        if (!cmatrixEvents || cmatrixEvents.length <= 0) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }
        // CMatrix2nのレコードを取得
        const cmatrix2ns: Cmatrix2n[] = await EntityOperation.getCMatrix2nsByDocumentIdentifier(targetDocumentIdentifies);
        if (!cmatrix2ns || cmatrix2ns.length <= 0) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // まとめて処理するための変数
        const targetDocumentIdentifies2: string[] = [];
        const targetCmatrix2nRelations: number[] = [];
        const targetCmatrix2ns: number[] = [];
        const targetCmatrixThingIds: number[] = [];
        const ctokenDtos: CTokenDto[] = [];
        for (const cmatrixEvent of cmatrixEvents) {
            // CMatrixモノテーブルのレコードを取得
            const cmatrixThings: CmatrixThing[] = await EntityOperation.getCMatrixThingsByEventIdentifier(userId, cmatrixEvent.getEventIdentifier());
            // CMatrix2(n)列リレーションレコードを取得
            const cmatrix2nRelations: Cmatrix2nRelation[] = await EntityOperation.getCMatrix2nRelationRecordByCMatrixEventId(cmatrixEvent.getId());
            if (cmatrix2nRelations && cmatrix2nRelations.length > 0) {
                cmatrix2nRelations.forEach((ele: Cmatrix2nRelation) => {
                    targetCmatrix2nRelations.push(ele.id);
                    targetCmatrix2ns.push(ele.cmatrix2nId);
                });
                // CMatrix2(n)列テーブルのレコードを取得
                const cmatrix2ns2: Cmatrix2n[] = await EntityOperation.getCMatrix2nsByCMatrix2nIds(targetCmatrix2ns);
                if (cmatrix2ns2 && cmatrix2ns2.length > 0) {
                    cmatrix2ns2.forEach((ele: Cmatrix2n) => {
                        targetDocumentIdentifies2.push(ele.docIdentifier);
                    });
                }
            }
            if (cmatrixThings && cmatrixThings.length > 0) {
                cmatrixThings.forEach((ele: CmatrixThing) => {
                    targetCmatrixThingIds.push(ele.getId());
                });
                // Thingが存在する場合、Local-CTokenを削除
                const ctokenDto: CTokenDto = new CTokenDto();
                ctokenDto.setOperator(operator);
                ctokenDto.setMessage(Message);
                ctokenDto.setUrl(Configure['ctokenUrl']);
                ctokenDto.setUserId(userId);
                ctokenDto.setDocIdentifierList(targetDocumentIdentifies2);
                ctokenDto.setCmatrixEventList([cmatrixEvent]);
                ctokenDto.setCmatrixThingList(cmatrixThings);
                ctokenDtos.push(ctokenDto);
            }
        }

        if (targetCmatrix2ns.length > 0) {
            // CMatrix2(n)列テーブルのレコードを削除
            await EntityOperation.deleteCMatrix2ns(trans, targetCmatrix2ns, operator.getLoginId());
        }
        if (targetCmatrix2nRelations.length > 0) {
            // CMatrix2(n)列リレーションのレコードの削除
            await EntityOperation.deleteCMatrix2nRelations(trans, targetCmatrix2nRelations, operator.getLoginId());
        }
        if (targetCmatrixThingIds.length > 0) {
            // CMatrix変動列テーブルのレコードを削除
            await EntityOperation.deleteCmatrixFloatingColumns(trans, targetCmatrixThingIds, operator.getLoginId());
            // CMatrixモノテーブルのレコードを削除
            await EntityOperation.deleteCMatrixThings(trans, targetCmatrixThingIds, operator.getLoginId());
        }
        if (ctokenDtos.length > 0) {
            // Local-CTokenをまとめて削除
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.deleteLocalCTokenList(ctokenDtos);
        }
    }
}
