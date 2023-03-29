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
import { InsertResult, EntityManager } from 'typeorm';
import { Service } from 'typedi';
import ThingServiceDto from './dto/ThingServiceDto';
import Event from '../repositories/postgres/Event';
import Thing from '../repositories/postgres/Thing';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import CmatrixFloatingColumn from '../repositories/postgres/CmatrixFloatingColumn';
import * as crypto from 'crypto';
import { connectDatabase } from '../common/Connection';
import EntityOperation from '../repositories/EntityOperation';
import PostThingByUserIdByEventIdResDto from '../resources/dto/PostThingByUserIdByEventIdResDto';
import PutThingByUserIdByEventIdResDto from '../resources/dto/PutThingByUserIdByEventIdResDto';
import DeleteThingByUserIdByEventIdResDto from '../resources/dto/DeleteThingByUserIdByEventIdResDto';
import PostThingBulkByUserIdByEventIdResDto from '../resources/dto/PostThingBulkByUserIdByEventIdResDto';
import AppError from '../common/AppError';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../common/ResponseCode';
import { v4 as uuid } from 'uuid';
import { transformFromDateTimeToString } from '../common/Transform';
import Config from '../common/Config';
import CTokenService from './CTokenService';
import CTokenDto from './dto/CTokenDto';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
import OperatorReqDto from '../resources/dto/OperatorReqDto';
/* eslint-enable */
const config = Config.ReadConfig('./config/config.json');

@Service()
export default class ThingService {
    /**
     * モノ追加
     * @param thingDto
     */
    public async addThing (thingDto: ThingServiceDto): Promise<any> {
        // 各情報を取得
        const message = thingDto.getMessage();
        const operator = thingDto.getOperator();

        // イベントテーブルのレコードを取得
        const eventList: Event[] = await EntityOperation.getEventRecord(thingDto.getUserId(), thingDto.getEventIdentifer(), thingDto.getSourceId());
        // 対象データが1件以外の場合
        if (!eventList || eventList.length !== 1) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // イベント情報の先頭を固定で取得
        const eventInfo: Event = eventList[0];

        // リクエストテンプレートを取得
        let template = thingDto.getRequestObject();

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async em => {
            // モノ追加
            const result = await this.thingAdd(em, thingDto, eventInfo, template);
            template = result['template'];
            const cmatrixEventList: CmatrixEvent[] = [];
            cmatrixEventList.push(result['cmatrixEvent']);
            const cmatrixThingList: CmatrixThing[] = [];
            cmatrixThingList.push(result['cmatrixThing']);

            // CTokenサービスにLocal-CTokenを登録
            const ctokenDto: CTokenDto = new CTokenDto();
            ctokenDto.setOperator(operator);
            ctokenDto.setMessage(message);
            ctokenDto.setUrl(thingDto.getCTokenUrl());
            ctokenDto.setUserId(thingDto.getUserId());
            ctokenDto.setCmatrixEventList(cmatrixEventList);
            ctokenDto.setCmatrixThingList(cmatrixThingList);
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.saveLocalCToken('add', ctokenDto);
        }).catch(err => {
            throw err;
        });
        // レスポンスを生成
        const response: PostThingByUserIdByEventIdResDto = new PostThingByUserIdByEventIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * モノ更新
     * @param thingDto
     *
     * RefactorDescription:
     *  #3803 : checkLicenceForUpdate
     *  #3803 : checkRequestInfo
     *  #3803 : getIndexAndValue
     *  #3803 : updateCmatrixThing
     */
    public async updateThing (thingDto: ThingServiceDto): Promise<any> {
        const message = thingDto.getMessage();

        // モノテーブルのレコードを取得
        const thingList: Thing[] = await EntityOperation.getThingRecord(thingDto.getUserId(), thingDto.getEventIdentifer(), thingDto.getThingIdentifer(), thingDto.getSourceId());
        // 対象データが1件以外の場合
        if (!thingList || thingList.length !== 1) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // モノ情報の先頭を固定で取得
        const thingInfo: Thing = thingList[0];

        // リクエストテンプレートを取得
        const template = thingDto.getRequestObject();

        // モノ情報とリクエスト情報の不整合を確認
        this.checkRequestInfo(thingInfo, template, message);

        // オペレータ情報を取得
        const operator = thingDto.getOperator();

        // リクエストからindexが4で始まるかつCMatrixテーブルに出てこないindex, valueを取得
        const property4: {}[] = this.getIndexAndValue(template, true);

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // Block外蓄積機能を確認
            const outerBlockStore = config['outerBlockStore'];
            const thingTemplate = !outerBlockStore ? JSON.stringify(template) : null;

            // モノテーブル更新データを生成
            const thingEntity: Thing = new Thing({
                id: thingInfo.getId(),
                wf_role_code: null,
                wf_role_version: null,
                wf_staff_identifier: null,
                template: thingTemplate,
                updated_by: operator.getLoginId()
            });
            // モノテーブルのレコードを更新
            await EntityOperation.updateThingRecord(trans, thingInfo.getId(), thingEntity);

            // CMatrixモノテーブルのレコードを更新
            await this.updateCmatrixThing(thingDto, message, thingInfo, template, property4, trans, operator, outerBlockStore);
        }).catch(err => {
            throw err;
        });

        // 取得したモノレコードを設定
        template['thing'] = [thingInfo.getAsJson()];

        // レスポンスを生成
        const response: PutThingByUserIdByEventIdResDto = new PutThingByUserIdByEventIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * CMatrixモノテーブルのレコードを更新
     * @param thingDto
     * @param message
     * @param thingInfo
     * @param template
     * @param property4
     * @param trans
     * @param operator
     * @param outerBlockStore
     */
    private async updateCmatrixThing (thingDto: ThingServiceDto, message: any, thingInfo: Thing, template: {}, property4: {}[], trans: EntityManager, operator: OperatorReqDto, outerBlockStore: any) {
        const cmatrixEventList: CmatrixEvent[] = await EntityOperation.getCMatrixEventRecord(thingDto.getUserId(), thingDto.getEventIdentifer());
        if (!cmatrixEventList || cmatrixEventList.length <= 0) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // CMatrixイベント情報をループ
        for (const cmatrixEvent of cmatrixEventList) {
            // CMatrixモノテーブルのレコードを取得
            const thingIdentifer: string = thingDto.getThingIdentifer() ? thingDto.getThingIdentifer() : thingInfo.getThingIdentifier();
            const cmatrixThingList: CmatrixThing[] = await EntityOperation.getCMatrixThingRecordByThingIdentifer(cmatrixEvent.getId(), thingIdentifer);

            // CMatrixモノ情報をループ
            for (const cmatrixThing of cmatrixThingList) {
                // CMatrixモノレコードを更新
                cmatrixThing.setThingWfRoleCode(null);
                cmatrixThing.setThingWfRoleVersion(null);
                cmatrixThing.setThingWfStaffIdentifier(null);

                // CMatrixテーブルに登録する行イメージを生成
                const rowImage: string = this.createRowImage(cmatrixEvent, cmatrixThing, property4);

                // 生成した行イメージをsha256ハッシュ化
                const nowTime: Date = new Date();
                const nowDateTime: Date = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds());
                const rowHash: string = crypto.createHash('sha256')
                    .update(rowImage)
                    .digest('hex');
                cmatrixThing.setRowHash(rowHash);
                cmatrixThing.setRowHashCreateAt(nowDateTime);

                // CMatrixモノテーブルのレコードを更新
                await EntityOperation.updateCMatrixThingRecord(trans, cmatrixThing);

                // CMatrix変動列テーブルのレコードを削除
                await EntityOperation.deleteCmatrixFloatingColumnRecord(trans, cmatrixThing.getId(), '4_', operator.getLoginId());

                // Block外蓄積機能がOFFの場合
                if (!outerBlockStore) {
                    for (const prop4 of property4) {
                        // CmatrixFloatingColumnテーブル追加データを生成
                        const cmatrixFloatingColumnEntity: CmatrixFloatingColumn = new CmatrixFloatingColumn({
                            cmatrix_thing_id: cmatrixThing.getId(),
                            index_key: prop4['index'],
                            value: prop4['value'],
                            created_by: operator.getLoginId(),
                            updated_by: operator.getLoginId()
                        });

                        // CMatrix変動列テーブルのレコードを追加
                        await EntityOperation.insertCmatrixFloatingColumnRecord(trans, cmatrixFloatingColumnEntity);
                    }
                }
            }

            // Local-CTokenを更新
            const ctokenDto: CTokenDto = new CTokenDto();
            ctokenDto.setOperator(operator);
            ctokenDto.setMessage(message);
            ctokenDto.setUrl(thingDto.getCTokenUrl());
            ctokenDto.setUserId(thingDto.getUserId());
            ctokenDto.setCmatrixEventList(cmatrixEventList);
            ctokenDto.setCmatrixThingList(cmatrixThingList);
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.saveLocalCToken('update', ctokenDto);
        }
    }

    /**
     * 対象のindex, valueを取得
     * @param template
     * @param isStart4check
     * @returns
     */
    private getIndexAndValue (template: {}, isStart4check: boolean) {
        const property: {}[] = [];
        const checkList: string[] = [
            '1_1',
            '1_2',
            '1_3',
            '3_1_1',
            '3_1_2',
            '3_1_2_1',
            '3_1_2_2',
            '3_2_1',
            '3_2_2',
            '3_3_1',
            '3_5_1_1',
            '3_5_1_2',
            '3_5_2_1',
            '3_5_2_2',
            '3_5_3_1',
            '3_5_3_2',
            '3_5_4',
            '3_5_5_1',
            '3_5_5_2',
            '3_6_1',
            '4_1_1',
            '4_1_2',
            '4_1_2_1',
            '4_1_2_2',
            '4_4_1_1',
            '4_4_1_2',
            '4_4_2_1',
            '4_4_2_2',
            '4_4_3_1',
            '4_4_3_2',
            '4_4_4',
            '4_4_5_1',
            '4_4_5_2'
        ];
        for (const key in template) {
            // index, valueが存在する場合
            if (template[key] &&
                template[key]['index'] &&
                template[key]['value'] !== undefined) {
                const indexKey: string = template[key]['index'];
                const value: string = template[key]['value'];
                if (isStart4check) {
                    // indexが4で始まるかつCMatrixテーブルに出てこないindex, valueを取得
                    if (!checkList.includes(indexKey) && indexKey.indexOf('4_') === 0) {
                        property.push({
                            index: indexKey,
                            value: value
                        });
                    }
                } else {
                    // CMatrixテーブルに出てこないindex, valueを取得
                    if (!checkList.includes(indexKey)) {
                        property.push({
                            index: indexKey,
                            value: value
                        });
                    }
                }
            }
        }
        return property;
    }

    private checkRequestInfo (thingInfo: Thing, template: {}, message: any) {
        if (thingInfo.getThingIdentifier() !== template['id']['value']) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'id'), ResponseCode.BAD_REQUEST);
        }
        if (thingInfo.getThingCatalogCode() !== Number(template['code']['value']['_value']) ||
            thingInfo.getThingCatalogVersion() !== Number(template['code']['value']['_ver'])) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'code'), ResponseCode.BAD_REQUEST);
        }
        if (template['app']) {
            if (thingInfo.getThingActorCode() !== Number(template['app']['code']['value']['_value']) ||
                thingInfo.getThingActorVersion() !== Number(template['app']['code']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.code'), ResponseCode.BAD_REQUEST);
            }
            if (thingInfo.getAppCatalogCode() !== Number(template['app']['app']['value']['_value']) ||
                thingInfo.getAppCatalogVersion() !== Number(template['app']['app']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.app'), ResponseCode.BAD_REQUEST);
            }
        } else {
            if (thingInfo.getThingActorCode() !== Number(template['wf']['code']['value']['_value']) ||
                thingInfo.getThingActorVersion() !== Number(template['wf']['code']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
            }
            if (thingInfo.getWfCatalogCode() !== Number(template['wf']['wf']['value']['_value']) ||
                thingInfo.getWfCatalogVersion() !== Number(template['wf']['wf']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
            }
        }
    }

    /**
     * モノ削除
     * @param connection
     * @param thingDto
     */
    public async deleteThing (thingDto: ThingServiceDto): Promise<any> {
        const message = thingDto.getMessage();
        const template = thingDto.getRequestObject();
        const operator = thingDto.getOperator();

        // モノテーブルのレコードを取得
        const things: Thing[] = await EntityOperation.getThingRecord(thingDto.getUserId(), thingDto.getEventIdentifer(), thingDto.getThingIdentifer(), thingDto.getSourceId());
        // 対象データが存在しない場合
        if (!things || things.length <= 0) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // モノテーブルのレコードを削除
            const targetThingIds: number[] = [];
            const targetThingIdentifies: string[] = [];
            things.forEach((ele: Thing) => {
                targetThingIds.push(ele.getId());
                targetThingIdentifies.push(ele.getThingIdentifier());
            });
            await EntityOperation.deleteThings(trans, targetThingIds, operator.getLoginId());

            // CMatrixモノテーブルのレコードを取得
            const cmatrixThings: CmatrixThing[] = await EntityOperation.getCMatrixThingsByThingIdentifier(thingDto.getUserId(), thingDto.getEventIdentifer(), targetThingIdentifies);
            if (!cmatrixThings || cmatrixThings.length <= 0) {
                // 対象データが存在しない場合、エラーを返す
                throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
            }
            const targetCmatrixThingIds: number[] = [];
            cmatrixThings.forEach((ele: CmatrixThing) => {
                targetCmatrixThingIds.push(ele.getId());
            });
            // CMatrix変動列テーブルのレコードを削除
            await EntityOperation.deleteCmatrixFloatingColumns(trans, targetCmatrixThingIds, operator.getLoginId());
            // CMatrixモノテーブルのレコードを削除
            await EntityOperation.deleteCMatrixThings(trans, targetCmatrixThingIds, operator.getLoginId());

            // Local-CTokenを削除
            const cmatrixEvent: CmatrixEvent = new CmatrixEvent();
            cmatrixEvent.eventIdentifier = thingDto.getEventIdentifer();
            const ctokenDto: CTokenDto = new CTokenDto();
            ctokenDto.setOperator(operator);
            ctokenDto.setMessage(message);
            ctokenDto.setUrl(thingDto.getCTokenUrl());
            ctokenDto.setUserId(thingDto.getUserId());
            ctokenDto.setCmatrixEventList([cmatrixEvent]);
            ctokenDto.setCmatrixThingList(cmatrixThings);
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.deleteLocalCToken(ctokenDto);
        }).catch(err => {
            throw err;
        });

        // 取得したモノレコードを設定
        template['thing'] = things;

        // レスポンスを生成
        const response: DeleteThingByUserIdByEventIdResDto = new DeleteThingByUserIdByEventIdResDto();
        response.setFromJson(template);
        for (const resThing of response.responseObject['thing']) {
            resThing.template = JSON.parse(resThing.template);
            const createDate = resThing.createdAt;
            const createDateJst = new Date(Date.UTC(createDate.getFullYear(), createDate.getMonth(), createDate.getDate(), createDate.getHours(), createDate.getMinutes(), createDate.getSeconds()));
            resThing.createdAt = transformFromDateTimeToString(config['timezone'], createDateJst);
            const updateDate = resThing.updatedAt;
            const updateDateJst = new Date(Date.UTC(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate(), updateDate.getHours(), updateDate.getMinutes(), updateDate.getSeconds()));
            resThing.updatedAt = transformFromDateTimeToString(config['timezone'], updateDateJst);
        }

        // レスポンスを返す
        return response;
    }

    /**
     * Cmatrix RowImage生成
     * @param cmatrixEvent
     * @param cmatrixThing
     * @param floatings
     */
    private createRowImage (cmatrixEvent: CmatrixEvent, cmatrixThing: CmatrixThing, floatings: {}[]): string {
        const template: {} = {};
        template['1_1'] = cmatrixEvent.getPersonIdentifier();
        template['1_2'] = cmatrixEvent.getBirthAt() ? cmatrixEvent.getBirthAt() : undefined;
        template['1_3'] = cmatrixEvent.getSex() > 0 ? cmatrixEvent.getSex() : undefined;
        template['3_1_1'] = cmatrixEvent.getEventIdentifier();
        template['3_1_2_1'] = cmatrixEvent.getEventCatalogCode();
        template['3_1_2_2'] = cmatrixEvent.getEventCatalogVersion();
        template['3_2_1'] = cmatrixEvent.getEventStartAt();
        template['3_2_2'] = cmatrixEvent.getEventEndAt();
        template['3_3_1'] = cmatrixEvent.getEventOutbreakPosition() ? cmatrixEvent.getEventOutbreakPosition() : undefined;
        template['3_5_1_1'] = cmatrixEvent.getEventActorCode();
        template['3_5_1_2'] = cmatrixEvent.getEventActorVersion();
        template['3_5_2_1'] = undefined;
        template['3_5_2_2'] = undefined;
        template['3_5_3_1'] = undefined;
        template['3_5_3_2'] = undefined;
        template['3_5_4'] = undefined;
        template['3_5_5_1'] = cmatrixEvent.getEventAppCatalogCode() > 0 ? cmatrixEvent.getEventAppCatalogCode() : undefined;
        template['3_5_5_2'] = cmatrixEvent.getEventAppCatalogVersion() > 0 ? cmatrixEvent.getEventAppCatalogVersion() : undefined;
        template['4_1_1'] = cmatrixThing.getThingIdentifier();
        template['4_1_2_1'] = cmatrixThing.getThingCatalogCode();
        template['4_1_2_2'] = cmatrixThing.getThingCatalogVersion();
        template['4_4_1_1'] = cmatrixThing.getThingActorCode();
        template['4_4_1_2'] = cmatrixThing.getThingActorVersion();
        template['4_4_2_1'] = undefined;
        template['4_4_2_2'] = undefined;
        template['4_4_3_1'] = undefined;
        template['4_4_3_2'] = undefined;
        template['4_4_4'] = undefined;
        template['4_4_5_1'] = cmatrixThing.getThingAppCatalogCode() > 0 ? cmatrixThing.getThingAppCatalogCode() : undefined;
        template['4_4_5_2'] = cmatrixThing.getThingAppCatalogVersion() > 0 ? cmatrixThing.getThingAppCatalogVersion() : undefined;
        for (const floating of floatings) {
            template[floating['index']] = floating['value'];
        }
        const sortedTemplate = {};
        Object.keys(template).sort().forEach(key => {
            sortedTemplate[key] = template[key];
        });
        return JSON.stringify(template);
    }

    /**
     * モノ一括追加
     * @param thingDto
     */
    public async addBulkThing (thingDto: ThingServiceDto): Promise<any> {
        // 各情報を取得
        const message = thingDto.getMessage();
        const operator = thingDto.getOperator();

        // イベントテーブルのレコードを取得
        const eventList: Event[] = await EntityOperation.getEventRecord(thingDto.getUserId(), thingDto.getEventIdentifer(), thingDto.getSourceId());
        // 対象データが1件以外の場合
        if (!eventList || eventList.length !== 1) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // イベント情報の先頭を固定で取得
        const eventInfo: Event = eventList[0];

        // リクエストテンプレートを取得
        const templateList = thingDto.getRequestBulkObject();

        // トランザクションを開始
        const responseList: {}[] = [];
        const connection = await connectDatabase();
        await connection.transaction(async em => {
            // 一括モノ追加
            const cmatrixEventList: CmatrixEvent[] = [];
            const cmatrixThingList: CmatrixThing[] = [];
            for (const template of templateList) {
                const result = await this.thingAdd(em, thingDto, eventInfo, template);
                responseList.push(result['template']);
                let isExistEvent = false;
                for (const cmatrixEvent of cmatrixEventList) {
                    if (cmatrixEvent.eventIdentifier === result['cmatrixEvent']['eventIdentifier']) {
                        isExistEvent = true;
                        break;
                    }
                }
                if (!isExistEvent) {
                    cmatrixEventList.push(result['cmatrixEvent']);
                }
                cmatrixThingList.push(result['cmatrixThing']);
            }

            // CTokenサービスにLocal-CTokenを登録
            const ctokenDto: CTokenDto = new CTokenDto();
            ctokenDto.setOperator(operator);
            ctokenDto.setMessage(message);
            ctokenDto.setUrl(thingDto.getCTokenUrl());
            ctokenDto.setUserId(thingDto.getUserId());
            ctokenDto.setCmatrixEventList(cmatrixEventList);
            ctokenDto.setCmatrixThingList(cmatrixThingList);
            const ctokenService: CTokenService = new CTokenService();
            await ctokenService.saveLocalCToken('add', ctokenDto);
        }).catch(err => {
            throw err;
        });

        // レスポンスを生成
        const response: PostThingBulkByUserIdByEventIdResDto = new PostThingBulkByUserIdByEventIdResDto();
        response.setFromJson(responseList);

        // レスポンスを返す
        return response;
    }

    /**
     * モノ追加
     * @param em
     * @param thingDto
     * @param eventInfo
     * @param template
     *
     * RefactorDescription:
     *  #3803 : checkLicenceForAdd
     *  #3803 : getIndexAndValue
     *  #3803 : addCmatrixThing
     */
    private async thingAdd (em: EntityManager, thingDto: ThingServiceDto, eventInfo: Event, template: {}): Promise<any> {
        // 各情報を取得
        const message = thingDto.getMessage();

        // オペレータ情報を取得
        const operator = thingDto.getOperator();

        // モノ識別子をuuidで採番
        const thingIdentifier: string = uuid();

        // Block外蓄積機能を確認
        const outerBlockStore = config['outerBlockStore'];

        // 生成したイベント識別子を設定
        template['id']['value'] = thingIdentifier;

        // リクエストからCMatrixテーブルに出てこないindex, valueを取得
        const property: {}[] = this.getIndexAndValue(template, false);

        // 登録データを生成
        const thingActorCode: number = template['app'] ? template['app']['code']['value']['_value'] : template['wf']['code']['value']['_value'];
        const thingActorVersion: number = template['app'] ? template['app']['code']['value']['_ver'] : template['wf']['code']['value']['_ver'];
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
        const thingTemplate = !outerBlockStore ? JSON.stringify(template) : null;

        const thingEntity: Thing = new Thing({
            event_id: eventInfo.getId(),
            source_id: template['sourceId'],
            thing_identifier: thingIdentifier,
            thing_catalog_code: template['code']['value']['_value'],
            thing_catalog_version: template['code']['value']['_ver'],
            thing_actor_code: thingActorCode,
            thing_actor_version: thingActorVersion,
            wf_catalog_code: wfCatalogCode,
            wf_catalog_version: wfCatalogVersion,
            wf_role_code: wfRoleCode,
            wf_role_version: wfRoleVersion,
            wf_staff_identifier: wfStaffIdentifier,
            app_catalog_code: appCatalogCode,
            app_catalog_version: appCatalogVersion,
            template: thingTemplate,
            attributes: null,
            created_by: operator.getLoginId(),
            updated_by: operator.getLoginId()
        });

        // モノテーブルにレコードを登録
        await EntityOperation.insertThingRecord(em, thingEntity);

        // CMatrixモノテーブルに登録
        const { insertResult, cmatrixEventEntity, cmatrixThingEntity }: { insertResult: InsertResult; cmatrixEventEntity: CmatrixEvent; cmatrixThingEntity: CmatrixThing; } = await this.addCmatrixThing(thingDto, message, thingIdentifier, template, thingActorCode, thingActorVersion, wfCatalogCode, wfCatalogVersion, wfRoleCode, wfRoleVersion, wfStaffIdentifier, appCatalogCode, appCatalogVersion, operator, property, em);

        // Block外蓄積機能がOFFの場合
        if (!outerBlockStore) {
            for (const prop of property) {
                // CmatrixFloatingColumnテーブル追加データを生成
                const cmatrixFloatingColumnEntity: CmatrixFloatingColumn = new CmatrixFloatingColumn({
                    cmatrix_thing_id: insertResult.identifiers[0].id,
                    index_key: prop['index'],
                    value: prop['value'],
                    created_by: operator.getLoginId(),
                    updated_by: operator.getLoginId()
                });
                // CMatrix変動列テーブルのレコードを追加
                await EntityOperation.insertCmatrixFloatingColumnRecord(em, cmatrixFloatingColumnEntity);
            }
        }

        return {
            template: template,
            cmatrixEvent: cmatrixEventEntity,
            cmatrixThing: cmatrixThingEntity
        };
    }

    /**
     * CMatrixモノのレコードを追加
     * @param thingDto
     * @param message
     * @param thingIdentifier
     * @param template
     * @param thingActorCode
     * @param thingActorVersion
     * @param wfCatalogCode
     * @param wfCatalogVersion
     * @param wfRoleCode
     * @param wfRoleVersion
     * @param wfStaffIdentifier
     * @param appCatalogCode
     * @param appCatalogVersion
     * @param operator
     * @param property
     * @param em
     * @returns
     */
    private async addCmatrixThing (thingDto: ThingServiceDto, message: any, thingIdentifier: string, template: {}, thingActorCode: number, thingActorVersion: number, wfCatalogCode: number, wfCatalogVersion: number, wfRoleCode: number, wfRoleVersion: number, wfStaffIdentifier: string, appCatalogCode: number, appCatalogVersion: number, operator: OperatorReqDto, property: {}[], em: EntityManager) {
        // CMatrixイベントテーブルのレコードを取得
        const cmatixEventList: CmatrixEvent[] = await EntityOperation.getCMatrixEventRecord(thingDto.getUserId(), thingDto.getEventIdentifer());
        if (!cmatixEventList || cmatixEventList.length <= 0) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }
        const cmatrixEventEntity: CmatrixEvent = cmatixEventList[0];

        // cmatrixモノテーブル追加データを生成
        const nowTime: Date = new Date();
        const nowDateTime: Date = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds());
        const cmatrixThingEntity: CmatrixThing = new CmatrixThing({
            cmatrix_event_id: cmatrixEventEntity.getId(),
            '4_1_1': thingIdentifier,
            '4_1_2_1': template['code']['value']['_value'],
            '4_1_2_2': template['code']['value']['_ver'],
            '4_4_1_1': thingActorCode,
            '4_4_1_2': thingActorVersion,
            '4_4_2_1': wfCatalogCode,
            '4_4_2_2': wfCatalogVersion,
            '4_4_3_1': wfRoleCode,
            '4_4_3_2': wfRoleVersion,
            '4_4_4': wfStaffIdentifier,
            '4_4_5_1': appCatalogCode,
            '4_4_5_2': appCatalogVersion,
            row_hash: null,
            row_hash_create_at: nowDateTime,
            created_by: operator.getLoginId(),
            updated_by: operator.getLoginId()
        });

        // CMatrixモノテーブルに登録する行イメージを生成
        const rowImage: string = this.createRowImage(cmatrixEventEntity, cmatrixThingEntity, property);

        // 生成した行イメージをsha256ハッシュ化
        const rowHash: string = crypto.createHash('sha256')
            .update(rowImage)
            .digest('hex');
        cmatrixThingEntity.setRowHash(rowHash);
        cmatrixThingEntity.setRowHashCreateAt(nowDateTime);

        // CMatrixモノテーブルにレコードを登録
        const insertResult: InsertResult = await EntityOperation.insertCMatrixThingRecord(em, cmatrixThingEntity);
        return { insertResult, cmatrixEventEntity, cmatrixThingEntity };
    }
}
