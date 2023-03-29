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

// SDE-IMPL-REQUIRED 本ファイルをコピーして外部サービスに公開する REST API インタフェースを定義します。
/* eslint-disable */
import { Request, Response } from 'express';
import {
    JsonController, Post, Put, Delete, Body, Param, Header, QueryParam, Res, Req, UseBefore
} from 'routing-controllers';
import PostEventByUserIdReqDto from './dto/PostEventByUserIdReqDto';
import PostEventByUserIdResDto from './dto/PostEventByUserIdResDto';
import PutEventByUserIdReqDto from './dto/PutEventByUserIdReqDto';
import PutEventByUserIdResDto from './dto/PutEventByUserIdResDto';
import DeleteEventByUserIdReqDto from './dto/DeleteEventByUserIdReqDto';
import DeleteEventByUserIdResDto from './dto/DeleteEventByUserIdResDto';
/* eslint-enable */
import PostEventAddRequestValidator from './validator/PostEventAddRequestValidator';
import PutEventRepRequestValidator from './validator/PutEventRepRequestValidator';
import DeleteEventDelRequestValidator from './validator/DeleteEventDelRequestValidator';
import EventServiceDto from '../services/dto/EventServiceDto';
import SessionCheckDto from '../services/dto/SessionCheckDto';
import SessionCheckService from '../services/SessionCheckService';
import EventService from '../services/EventService';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import { OperatorType } from '../common/Operator';
import Config from '../common/Config';
import { applicationLogger } from '../common/logging';

@JsonController('/book-operate')
export default class EventController {
    /**
     * イベント蓄積
     */
    @Post('/event/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostEventAddRequestValidator)
    async postEventByUserId (@Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: PostEventByUserIdReqDto, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');
        applicationLogger.info('add event start');
        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);
        applicationLogger.info('session check start');
        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);
        applicationLogger.info('session check end');
        // リクエストを取得
        dto.setUserId(parmUserId);
        dto.setFromJson(req.body);

        // イベント蓄積データオブジェクトを生成
        const eventDto = new EventServiceDto();
        eventDto.setUserId(dto.getUserId());
        eventDto.setRequestObject(dto.getRequestObject());
        eventDto.setOperator(operator);
        eventDto.setCatalogUrl(configure['catalogUrl']);
        eventDto.setMessage(message);
        // サービス層のイベント蓄積を実行
        const eventService: EventService = new EventService();
        const ret:PostEventByUserIdResDto = await eventService.addEvent(eventDto);
        applicationLogger.info('add event end');
        return ret.getAsJson();
    }

    /**
     * ソースIDによるイベント更新
     */
    @Put('/event/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutEventRepRequestValidator)
    async putEventByUserId (@QueryParam('eventSourceId') queryEventSourceId: string, @Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: PutEventByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setSourceId(queryEventSourceId);
        dto.setEventIdentifer(null);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:PutEventByUserIdResDto = await this.updateEventProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * イベント更新
     */
    @Put('/event/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutEventRepRequestValidator)
    async putEventByUserIdByEventId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Body() dto: PutEventByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setSourceId(null);
        dto.setEventIdentifer(parmEventId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:PutEventByUserIdResDto = await this.updateEventProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * イベント更新処理
     */
    private async updateEventProc (reqParm: any) : Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(reqParm.req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // イベント更新データオブジェクトを生成
        const eventDto = new EventServiceDto();
        eventDto.setUserId(reqParm.dto.getUserId());
        eventDto.setSourceId(reqParm.dto.getSourceId());
        eventDto.setEventIdentifer(reqParm.dto.getEventIdentifer());
        eventDto.setRequestObject(reqParm.dto.getRequestObject());
        eventDto.setOperator(operator);
        eventDto.setCatalogUrl(configure['catalogUrl']);
        eventDto.setCTokenUrl(configure['ctokenUrl']);
        eventDto.setMessage(message);
        // サービス層のイベント蓄積を実行
        const eventService: EventService = new EventService();
        const ret:PutEventByUserIdResDto = await eventService.updateEvent(eventDto);
        return ret;
    }

    /**
     * ソースIDによるイベント削除
     */
    @Delete('/event/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteEventDelRequestValidator)
    async deleteEventByUserId (@QueryParam('eventSourceId') queryEventSourceId: string, @Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: DeleteEventByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setEventSourceId(queryEventSourceId);
        dto.setEventIdentifer(null);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:DeleteEventByUserIdResDto = await this.deleteEventProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * イベント削除
     */
    @Delete('/event/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteEventDelRequestValidator)
    async deleteEventByUserIdByEventId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Body() dto: DeleteEventByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setEventSourceId(null);
        dto.setEventIdentifer(parmEventId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:DeleteEventByUserIdResDto = await this.deleteEventProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * イベント削除処理
     */
    private async deleteEventProc (reqParm: any) : Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(reqParm.req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // イベント削除データオブジェクトを生成
        const eventDto = new EventServiceDto();
        eventDto.setUserId(reqParm.dto.getUserId());
        eventDto.setSourceId(reqParm.dto.getEventSourceId());
        eventDto.setEventIdentifer(reqParm.dto.getEventIdentifer());
        eventDto.setRequestObject(reqParm.dto.getRequestObject());
        eventDto.setOperator(operator);
        eventDto.setCatalogUrl(configure['catalogUrl']);
        eventDto.setCTokenUrl(configure['ctokenUrl']);
        eventDto.setMessage(message);
        // サービス層のイベント蓄積を実行
        const eventService: EventService = new EventService();
        const ret:DeleteEventByUserIdResDto = await eventService.deleteEvent(eventDto);
        return ret;
    }
}
