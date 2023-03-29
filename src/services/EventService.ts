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
import { EntityManager } from 'typeorm';
import { Service } from 'typedi';
import EventServiceDto from './dto/EventServiceDto';
import MyConditionBook from '../repositories/postgres/MyConditionBook';
import Event from '../repositories/postgres/Event';
import Thing from '../repositories/postgres/Thing';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import CmatrixFloatingColumn from '../repositories/postgres/CmatrixFloatingColumn';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
import Cmatrix2nRelation from '../repositories/postgres/Cmatrix2nRelation';
import * as crypto from 'crypto';
import { connectDatabase } from '../common/Connection';
import EntityOperation from '../repositories/EntityOperation';
import PostEventByUserIdResDto from '../resources/dto/PostEventByUserIdResDto';
import PutEventByUserIdResDto from '../resources/dto/PutEventByUserIdResDto';
import DeleteEventByUserIdResDto from '../resources/dto/DeleteEventByUserIdResDto';
import AppError from '../common/AppError';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../common/ResponseCode';
import { v4 as uuid } from 'uuid';
import CTokenService from './CTokenService';
import CTokenDto from './dto/CTokenDto';
import Config from '../common/Config';
import OperatorReqDto from '../resources/dto/OperatorReqDto';
import { applicationLogger } from '../common/logging';
/* eslint-enable */

@Service()
export default class EventService {
    /**
     * イベント蓄積
     * @param eventDto
     *
     * RefactorDescription:
     *  #3803 : checkLicence
     */
    public async addEvent (eventDto: EventServiceDto): Promise<any> {
        // 各情報を取得
        const configure = Config.ReadConfig('./config/config.json');
        const operator = eventDto.getOperator();
        const message = eventDto.getMessage();

        // リクエストテンプレートを取得
        const template = eventDto.getRequestObject();
        applicationLogger.info('get my condition book start');
        // My-Condition-Bookテーブルのレコードを取得
        const myConditionBookInfo: MyConditionBook = await EntityOperation.getContBookRecordFromUserId(eventDto.getUserId());
        // 対象データが存在しない場合
        if (!myConditionBookInfo) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }
        applicationLogger.info('get my condition book end');
        // Block外蓄積機能を確認
        const outerBlockStore = configure['outerBlockStore'];

        // イベント識別子をuuidで採番
        const eventIdentifier: string = uuid();

        // 生成したイベント識別子を設定
        template['id']['value'] = eventIdentifier;

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // 登録データを生成
            const eventActorCode: number = template['app'] ? template['app']['code']['value']['_value'] : template['wf']['code']['value']['_value'];
            const eventActorVersion: number = template['app'] ? template['app']['code']['value']['_ver'] : template['wf']['code']['value']['_ver'];
            // APP
            const appCatalogCode: number = template['app'] ? template['app']['app']['value']['_value'] : null;
            const appCatalogVersion: number = template['app'] ? template['app']['app']['value']['_ver'] : null;
            // WF
            const wfCatalogCode: number = null;
            const wfCatalogVersion: number = null;
            const wfRoleCode: number = null;
            const wfRoleVersion: number = null;
            const wfStaffIdentifier: string = null;
            // Block外機能がOFFの場合
            const eventTemplate = !outerBlockStore ? JSON.stringify(template) : null;
            applicationLogger.info('insert event record start');
            const entity: Event = new Event({
                my_condition_book_id: myConditionBookInfo.id,
                source_id: template['sourceId'],
                event_identifier: eventIdentifier,
                event_catalog_code: template['code']['value']['_value'],
                event_catalog_version: template['code']['value']['_ver'],
                event_start_at: template['start'] && template['start']['value'] ? new Date(template['start']['value']) : null,
                event_end_at: template['end'] && template['end']['value'] ? new Date(template['end']['value']) : null,
                event_outbreak_position: template['location'] && template['location']['value'] ? template['location']['value'] : null,
                event_actor_code: eventActorCode,
                event_actor_version: eventActorVersion,
                wf_catalog_code: wfCatalogCode,
                wf_catalog_version: wfCatalogVersion,
                wf_role_code: wfRoleCode,
                wf_role_version: wfRoleVersion,
                wf_staff_identifier: wfStaffIdentifier,
                app_catalog_code: appCatalogCode,
                app_catalog_version: appCatalogVersion,
                template: eventTemplate,
                attributes: null,
                created_by: operator.getLoginId(),
                updated_by: operator.getLoginId()
            });

            // イベントテーブルにレコードを登録
            await EntityOperation.insertEventRecord(trans, entity);
            applicationLogger.info('insert event record end');
            applicationLogger.info('insert cmatrix record start');
            // CMatrixイベントテーブルにレコードを登録
            const cmatrixEvent: CmatrixEvent = new CmatrixEvent({
                '1_1': eventDto.getUserId(),
                '1_2': null,
                '1_3': null,
                '3_1_1': eventIdentifier,
                '3_1_2_1': Number(template['code']['value']['_value']),
                '3_1_2_2': Number(template['code']['value']['_ver']),
                '3_2_1': template['start'] && template['start']['value'] ? new Date(template['start']['value']) : null,
                '3_2_2': template['end'] && template['end']['value'] ? new Date(template['end']['value']) : null,
                '3_3_1': template['location'] && template['location']['value'] ? template['location']['value'] : null,
                '3_5_1_1': Number(eventActorCode),
                '3_5_1_2': Number(eventActorVersion),
                '3_5_2_1': 0,
                '3_5_2_2': 0,
                '3_5_3_1': 0,
                '3_5_3_2': 0,
                '3_5_4': wfStaffIdentifier,
                '3_5_5_1': appCatalogCode ? Number(appCatalogCode) : 0,
                '3_5_5_2': appCatalogVersion ? Number(appCatalogVersion) : 0,
                created_by: operator.getLoginId(),
                updated_by: operator.getLoginId()
            });
            await EntityOperation.insertCMatrixEventRecord(trans, cmatrixEvent);
            applicationLogger.info('insert cmatrix record end');
        }).catch(err => {
            throw err;
        });
        applicationLogger.info('create response start');
        // レスポンスを生成
        const response: PostEventByUserIdResDto = new PostEventByUserIdResDto();
        response.setFromJson(template);
        applicationLogger.info('create response end');
        // レスポンスを返す
        return response;
    }

    /**
     * イベント更新
     * @param eventDto
     *
     * RefactorDescription:
     *  #3803 : checkRequestInfo
     *  #3803 : checkLicence
     *  #3803 : getIndexAndValue
     *  #3803 : updateCMatrixEvent
     */
    public async updateEvent (eventDto: EventServiceDto): Promise<any> {
        // 各情報を取得
        const configure = Config.ReadConfig('./config/config.json');
        const operator = eventDto.getOperator();
        const message = eventDto.getMessage();

        // イベントテーブルのレコードを取得
        const eventList: Event[] = await EntityOperation.getEventRecord(eventDto.getUserId(), eventDto.getEventIdentifer(), eventDto.getSourceId());
        // 対象データが1件以外の場合
        if (!eventList || eventList.length !== 1) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // イベント情報の先頭を固定で取得
        const eventInfo: Event = eventList[0];

        // リクエストテンプレートを取得
        const template = eventDto.getRequestObject();

        // イベント情報とリクエスト情報の不整合を確認
        this.checkRequestInfo(eventInfo, template, message);

        // モノテーブルのレコードを取得
        const thingList: Thing[] = await EntityOperation.getThingRecordByEventId(eventDto.getUserId(), eventInfo.getId());

        // リクエストからindexが3で始まるかつCMatrixテーブルに出てこないindex, valueを取得
        const property3: {}[] = this.getIndexAndValue(template);

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // Block外蓄積機能を確認
            const outerBlockStore = configure['outerBlockStore'];
            const eventTemplate = !outerBlockStore ? JSON.stringify(template) : null;

            // イベントテーブル更新データを生成
            const eventEntity: Event = new Event({
                id: eventInfo.getId(),
                event_start_at: template['start'] && template['start']['value'] ? new Date(template['start']['value']) : null,
                event_end_at: template['end'] && template['end']['value'] ? new Date(template['end']['value']) : null,
                event_outbreak_position: template['location'] && template['location']['value'] ? template['location']['value'] : null,
                wf_role_code: null,
                wf_role_version: null,
                wf_staff_identifier: null,
                template: eventTemplate,
                updated_by: operator.getLoginId()
            });
            // イベントテーブルのレコードを更新
            await EntityOperation.updateEventRecord(trans, eventInfo.getId(), eventEntity);

            // CMatrixイベントテーブルのレコードを更新
            await this.updateCMatrixEvent(eventDto, eventInfo, message, template, operator, trans, property3);
        }).catch(err => {
            throw err;
        });

        // 取得したモノレコードを設定
        template['thing'] = [];
        for (const thing of thingList) {
            template['thing'].push(thing.getAsJson());
        }
        // レスポンスを生成
        const response: PutEventByUserIdResDto = new PutEventByUserIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * CMatrixイベントテーブルのレコードを更新
     * @param eventDto
     * @param eventInfo
     * @param message
     * @param template
     * @param operator
     * @param trans
     * @param property3
     */
    private async updateCMatrixEvent (eventDto: EventServiceDto, eventInfo: Event, message: any, template: {}, operator: OperatorReqDto, trans: EntityManager, property3: {}[]) {
        // CMatrixイベントテーブルのレコードを取得
        const cmatrixEventList: CmatrixEvent[] = await EntityOperation.getCMatrixEventRecord(eventDto.getUserId(), eventInfo.getEventIdentifier());
        if (!cmatrixEventList || cmatrixEventList.length !== 1) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        for (const cmatrixEvent of cmatrixEventList) {
            // CMatrixイベントテーブルのレコードを更新
            cmatrixEvent.setEventStartAt(template['start'] && template['start']['value'] ? new Date(template['start']['value']) : null);
            cmatrixEvent.setEventEndAt(template['end'] && template['end']['value'] ? new Date(template['end']['value']) : null);
            cmatrixEvent.setEventOutbreakPosition(template['location'] && template['location']['value'] ? template['location']['value'] : null);
            cmatrixEvent.setEventWfRoleCode(null);
            cmatrixEvent.setEventWfRoleVersion(null);
            cmatrixEvent.setEventWfStaffIdentifier(null);
            cmatrixEvent.updatedBy = operator.getLoginId();
            await EntityOperation.updateCMatrixEventRecord(trans, cmatrixEvent);

            // CMatrixモノテーブルのレコードを取得
            const cmatrixThingList: CmatrixThing[] = await EntityOperation.getCMatrixThingRecordByCMatrixEventId(cmatrixEvent.getId());

            // CMatrixモノ情報をループ
            for (const cmatrixThing of cmatrixThingList) {
                // CMatrixテーブルに登録する行イメージを生成
                const rowImage: string = this.createRowImage(cmatrixEvent, cmatrixThing, property3);

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
                await EntityOperation.deleteCmatrixFloatingColumnRecord(trans, cmatrixThing.getId(), '3_', operator.getLoginId());

                for (const prop3 of property3) {
                    // CmatrixFloatingColumnテーブル追加データを生成
                    const cmatrixFloatingColumnEntity: CmatrixFloatingColumn = new CmatrixFloatingColumn({
                        cmatrix_thing_id: cmatrixThing.getId(),
                        index_key: prop3['index'],
                        value: prop3['value'],
                        created_by: operator.getLoginId(),
                        updated_by: operator.getLoginId()
                    });
                    // CMatrix変動列テーブルのレコードを追加
                    await EntityOperation.insertCmatrixFloatingColumnRecord(trans, cmatrixFloatingColumnEntity);
                }
            }

            // Local-CTokenを更新
            if (cmatrixThingList && cmatrixThingList.length > 0) {
                const ctokenDto: CTokenDto = new CTokenDto();
                ctokenDto.setOperator(operator);
                ctokenDto.setMessage(message);
                ctokenDto.setUrl(eventDto.getCTokenUrl());
                ctokenDto.setUserId(eventDto.getUserId());
                ctokenDto.setCmatrixEventList(cmatrixEventList);
                ctokenDto.setCmatrixThingList(cmatrixThingList);
                const ctokenService: CTokenService = new CTokenService();
                await ctokenService.saveLocalCToken('update', ctokenDto);
            }
        }
    }

    /**
     * templateからindex, valueを取得
     * @param template
     * @returns
     */
    private getIndexAndValue (template: {}) {
        const property3: {}[] = [];
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
                if (!checkList.includes(indexKey) && indexKey.indexOf('3_') === 0) {
                    property3.push({
                        index: indexKey,
                        value: value
                    });
                }
            }
        }
        return property3;
    }

    /**
     * イベント情報とリクエスト情報の不整合を確認
     * @param eventInfo
     * @param template
     * @param message
     */
    private checkRequestInfo (eventInfo: Event, template: {}, message: any) {
        if (eventInfo.getEventIdentifier() !== template['id']['value']) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'id'), ResponseCode.BAD_REQUEST);
        }
        if (eventInfo.getEventCatalogCode() !== Number(template['code']['value']['_value']) ||
            eventInfo.getEventCatalogVersion() !== Number(template['code']['value']['_ver'])) {
            // エラーを返す
            throw new AppError(sprintf(message.VALUE_NOT_VALID, 'code'), ResponseCode.BAD_REQUEST);
        }
        if (template['app']) {
            if (eventInfo.getEventActorCode() !== Number(template['app']['code']['value']['_value']) ||
                eventInfo.getEventActorVersion() !== Number(template['app']['code']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.code'), ResponseCode.BAD_REQUEST);
            }
            if (eventInfo.getAppCatalogCode() !== Number(template['app']['app']['value']['_value']) ||
                eventInfo.getAppCatalogVersion() !== Number(template['app']['app']['value']['_ver'])) {
                // エラーを返す
                throw new AppError(sprintf(message.VALUE_NOT_VALID, 'app.app'), ResponseCode.BAD_REQUEST);
            }
        } else {
            throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }
    }

    /**
     * イベント削除
     * @param eventDto
     */
    public async deleteEvent (eventDto: EventServiceDto): Promise<any> {
        const message = eventDto.getMessage();
        const template = eventDto.getRequestObject();
        const operator = eventDto.getOperator();

        // イベントテーブルのレコードを取得
        const events: Event[] = await EntityOperation.getEventRecord(eventDto.getUserId(), eventDto.getEventIdentifer(), eventDto.getSourceId());
        // 対象データが存在しない場合
        if (!events || events.length <= 0) {
            // エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // トランザクションを開始
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            const targetEventIds: number[] = [];
            const targetEventIdentifies: string[] = [];
            events.forEach((ele: Event) => {
                targetEventIds.push(ele.getId());
                targetEventIdentifies.push(ele.getEventIdentifier());
            });
            // モノテーブルのレコードを削除
            await EntityOperation.deleteThingsForEventIds(trans, targetEventIds, operator.getLoginId());

            // イベントテーブルのレコードを削除
            await EntityOperation.deleteEvents(trans, targetEventIds, operator.getLoginId());
            // CMatrixイベントのレコードを削除
            await this.deleteCmatrixEvent(eventDto, targetEventIdentifies, message, trans, operator);
        }).catch(err => {
            throw err;
        });

        // 取得したモノレコードを設定
        template['event'] = events;
        // レスポンスを生成
        const response: DeleteEventByUserIdResDto = new DeleteEventByUserIdResDto();
        response.setFromJson(template);

        // レスポンスを返す
        return response;
    }

    /**
     * CMatrixイベントのレコードを削除
     * @param eventDto
     * @param targetEventIdentifies
     * @param message
     * @param trans
     * @param operator
     */
    private async deleteCmatrixEvent (eventDto: EventServiceDto, targetEventIdentifies: string[], message: any, trans: EntityManager, operator: OperatorReqDto) {
        // CMatrixイベントのレコードを取得
        const cmatrixEvents: CmatrixEvent[] = await EntityOperation.getCMatrixEventsByEventIdentifier(eventDto.getUserId(), targetEventIdentifies);
        if (!cmatrixEvents || cmatrixEvents.length <= 0) {
            // 対象データが存在しない場合、エラーを返す
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        for (const cmatrixEvent of cmatrixEvents) {
            // CMatrixモノテーブルのレコードを取得
            const cmatrixThings: CmatrixThing[] = await EntityOperation.getCMatrixThingsByEventIdentifier(eventDto.getUserId(), cmatrixEvent.getEventIdentifier());
            if (cmatrixThings && cmatrixThings.length > 0) {
                const targetCmatrixThingIds: number[] = [];
                cmatrixThings.forEach((ele: CmatrixThing) => {
                    targetCmatrixThingIds.push(ele.getId());
                });
                // CMatrix変動列テーブルのレコードを削除
                await EntityOperation.deleteCmatrixFloatingColumns(trans, targetCmatrixThingIds, operator.getLoginId());
                // CMatrixモノテーブルのレコードを削除
                await EntityOperation.deleteCMatrixThings(trans, targetCmatrixThingIds, operator.getLoginId());

                // Thingが存在する場合、Local-CTokenを削除
                const ctokenDto: CTokenDto = new CTokenDto();
                ctokenDto.setOperator(operator);
                ctokenDto.setMessage(message);
                ctokenDto.setUrl(eventDto.getCTokenUrl());
                ctokenDto.setUserId(eventDto.getUserId());
                ctokenDto.setCmatrixEventList([cmatrixEvent]);
                ctokenDto.setCmatrixThingList(cmatrixThings);
                const ctokenService: CTokenService = new CTokenService();
                await ctokenService.deleteLocalCToken(ctokenDto);
            }
            // CMatrix2(n)列リレーションレコードを取得
            const cmatrix2nRelations: Cmatrix2nRelation[] = await EntityOperation.getCMatrix2nRelationRecordByCMatrixEventId(cmatrixEvent.getId());
            if (cmatrix2nRelations && cmatrix2nRelations.length > 0) {
                const targetCmatrix2nRelations: number[] = [];
                const targetCmatrix2ns: number[] = [];
                cmatrix2nRelations.forEach((ele: Cmatrix2nRelation) => {
                    targetCmatrix2nRelations.push(ele.id);
                    targetCmatrix2ns.push(ele.cmatrix2nId);
                });
                // CMatrix2(n)列テーブルのレコードを削除
                await EntityOperation.deleteCMatrix2ns(trans, targetCmatrix2ns, operator.getLoginId());
                // CMatrix2(n)列リレーションのレコードの削除
                await EntityOperation.deleteCMatrix2nRelations(trans, targetCmatrix2nRelations, operator.getLoginId());
            }
        }
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
}
