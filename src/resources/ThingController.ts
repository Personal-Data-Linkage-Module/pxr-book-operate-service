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
import { Container } from 'typedi';
import { Request, Response, CookieOptions } from 'express';
import {
    JsonController, Post, Put, Delete, Body, Param, Header, QueryParam, Res, Req, UseBefore
} from 'routing-controllers';
import PostThingByUserIdByEventIdResDto from './dto/PostThingByUserIdByEventIdResDto';
import PutThingByUserIdByEventIdReqDto from './dto/PutThingByUserIdByEventIdReqDto';
import PutThingByUserIdByEventIdResDto from './dto/PutThingByUserIdByEventIdResDto';
import DeleteThingByUserIdByEventIdReqDto from './dto/DeleteThingByUserIdByEventIdReqDto';
import DeleteThingByUserIdByEventIdResDto from './dto/DeleteThingByUserIdByEventIdResDto';
/* eslint-enable */
import ThingServiceDto from '../services/dto/ThingServiceDto';
import SessionCheckDto from '../services/dto/SessionCheckDto';
import SessionCheckService from '../services/SessionCheckService';
import ThingService from '../services/ThingService';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import PostThingAddRequestValidator from './validator/PostThingAddRequestValidator';
import PutThingRepRequestValidator from './validator/PutThingRepRequestValidator';
import DeleteThingDelRequestValidator from './validator/DeleteThingDelRequestValidator';
import { OperatorType } from '../common/Operator';
import Config from '../common/Config';
import PostThingBulkAddRequestValidator from './validator/PostThingBulkAddRequestValidator';

// SDE-IMPL-REQUIRED REST API のベースルートを指定します。("/")をベースルートにする場合は引数なしとしてください。
@JsonController('/book-operate')
export default class ThingController {
    /**
     * モノ追加
     */
    @Post('/thing/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostThingAddRequestValidator)
    async postThingByUserIdByEventId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // モノ追加データオブジェクトを生成
        const thingDto = new ThingServiceDto();
        thingDto.setUserId(parmUserId);
        thingDto.setEventIdentifer(parmEventId);
        thingDto.setRequestObject(req.body);
        thingDto.setOperator(operator);
        thingDto.setCatalogUrl(configure['catalogUrl']);
        thingDto.setCTokenUrl(configure['ctokenUrl']);
        thingDto.setMessage(message);
        // サービス層を実行
        const thingService: ThingService = new ThingService();
        const ret: PostThingByUserIdByEventIdResDto = await thingService.addThing(thingDto);
        return ret.getAsJson();
    }

    /**
     * ソースIDによるモノ更新
     */
    @Put('/thing/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutThingRepRequestValidator)
    async putThingByUserIdByEventId (@QueryParam('thingSourceId') queryThingSourceId: string, @Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Body() dto: PutThingByUserIdByEventIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setEventIdentifer(parmEventId);
        dto.setThingSourceId(queryThingSourceId);
        dto.setThingIdentifer(null);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret: PutThingByUserIdByEventIdResDto = await this.updateThingProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * モノ更新
     */
    @Put('/thing/:userId/:eventId/:thingId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutThingRepRequestValidator)
    async putThingByUserIdByEventIdByThingId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Param('thingId') parmThingId: string, @Req() req: Request, @Body() dto: PutThingByUserIdByEventIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setEventIdentifer(parmEventId);
        dto.setThingSourceId(null);
        dto.setThingIdentifer(parmThingId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret: PutThingByUserIdByEventIdResDto = await this.updateThingProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * モノ更新処理
     */
    private async updateThingProc (reqParm: any) : Promise<any> {
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

        // モノ更新データオブジェクトを生成
        const thingDto = new ThingServiceDto();
        thingDto.setUserId(reqParm.dto.getUserId());
        thingDto.setSourceId(reqParm.dto.getThingSourceId());
        thingDto.setThingIdentifer(reqParm.dto.getThingIdentifer());
        thingDto.setEventIdentifer(reqParm.dto.getEventIdentifer());
        thingDto.setRequestObject(reqParm.dto.getRequestObject());
        thingDto.setOperator(operator);
        thingDto.setCatalogUrl(configure['catalogUrl']);
        thingDto.setCTokenUrl(configure['ctokenUrl']);
        thingDto.setMessage(message);
        // サービス層を実行
        const thingService: ThingService = new ThingService();
        const ret: PutThingByUserIdByEventIdResDto = await thingService.updateThing(thingDto);
        return ret;
    }

    /**
     * ソースIDによるモノ削除
     */
    @Delete('/thing/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteThingDelRequestValidator)
    async deleteThingByUserIdByEventId (@QueryParam('thingSourceId') queryThingSourceId: string, @Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Body() dto: DeleteThingByUserIdByEventIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setThingSourceId(queryThingSourceId);
        dto.setThingIdentifer(null);
        dto.setEventIdentifer(parmEventId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret: DeleteThingByUserIdByEventIdResDto = await this.deleteThingProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * モノ削除
     */
    @Delete('/thing/:userId/:eventId/:thingId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteThingDelRequestValidator)
    async deleteThingByUserIdByEventIdByThingId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Param('thingId') parmThingId: string, @Req() req: Request, @Body() dto: DeleteThingByUserIdByEventIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setThingSourceId(null);
        dto.setThingIdentifer(parmThingId);
        dto.setEventIdentifer(parmEventId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret: DeleteThingByUserIdByEventIdResDto = await this.deleteThingProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * モノ削除処理
     */
    private async deleteThingProc (reqParm: any) : Promise<any> {
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

        // モノ削除データオブジェクトを生成
        const thingDto = new ThingServiceDto();
        thingDto.setUserId(reqParm.dto.getUserId());
        thingDto.setSourceId(reqParm.dto.getThingSourceId());
        thingDto.setEventIdentifer(reqParm.dto.getEventIdentifer());
        thingDto.setThingIdentifer(reqParm.dto.getThingIdentifer());
        thingDto.setRequestObject(reqParm.dto.getRequestObject());
        thingDto.setOperator(operator);
        thingDto.setCatalogUrl(configure['catalogUrl']);
        thingDto.setCTokenUrl(configure['ctokenUrl']);
        thingDto.setMessage(message);
        // サービス層のイベント蓄積を実行
        const thingService: ThingService = new ThingService();
        const ret: DeleteThingByUserIdByEventIdResDto = await thingService.deleteThing(thingDto);
        return ret;
    }

    /**
     * モノ一括追加
     */
    @Post('/thing/bulk/:userId/:eventId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostThingBulkAddRequestValidator)
    async postThingBulkByUserIdByEventId (@Param('userId') parmUserId: string, @Param('eventId') parmEventId: string, @Req() req: Request, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // モノ追加データオブジェクトを生成
        const thingDto = new ThingServiceDto();
        thingDto.setUserId(parmUserId);
        thingDto.setEventIdentifer(parmEventId);
        thingDto.setRequestBulkObject(req.body);
        thingDto.setOperator(operator);
        thingDto.setCatalogUrl(configure['catalogUrl']);
        thingDto.setCTokenUrl(configure['ctokenUrl']);
        thingDto.setMessage(message);
        // サービス層を実行
        const thingService: ThingService = new ThingService();
        const ret: PostThingByUserIdByEventIdResDto = await thingService.addBulkThing(thingDto);
        return ret.getAsJson();
    }
}
