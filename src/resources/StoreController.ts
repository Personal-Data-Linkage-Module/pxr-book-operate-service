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
    JsonController, Post, Body, Header, Req, UseBefore, Delete, Param, QueryParam, Res
} from 'routing-controllers';
import PostStoreEventReceiveReqDto from './dto/PostStoreEventReceiveReqDto';
import PostStoreEventReceiveRequestValidator from './validator/PostStoreEventReceiveRequestValidator';
/* eslint-enable */
import SessionCheckDto from '../services/dto/SessionCheckDto';
import SessionCheckService from '../services/SessionCheckService';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import { OperatorType } from '../common/Operator';
import Config from '../common/Config';
import StoreServiceDto from '../services/dto/StoreSreviceDto';
import StoreService from '../services/StoreService';
@JsonController('/book-operate')
export default class StoreController {
    /**
     * 蓄積イベント受信
     */
    @Post('/store-event/receive')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostStoreEventReceiveRequestValidator)
    async postEventByUserId (@Req() req: Request, @Body() dto: PostStoreEventReceiveReqDto): Promise<any> {
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

        // イベント蓄積データオブジェクトを生成
        const storeDto = new StoreServiceDto();
        storeDto.setOperator(operator);
        storeDto.setRequestBody(dto);
        const storeService: StoreService = new StoreService();
        const ret = await storeService.receiveStoreEvent(storeDto);
        return ret;
    }

    /**
     * 利用者データ削除
     */
    @Delete('/store/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    async deleteUserData (@Param('userId') userId: string, @QueryParam('physicalDelete') physicalDelete: boolean, @Req() req: Request, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');
        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        const ignoreOperators: number[] = [OperatorType.TYPE_IND, OperatorType.TYPE_APP, OperatorType.TYPE_WF];
        sessionCheckDto.setIgnoreOperatorTypeList(ignoreOperators);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // サービス層生成
        return new StoreService().deleteUserStoreData(userId, physicalDelete, operator);
    }
}
