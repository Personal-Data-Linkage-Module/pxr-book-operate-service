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
    JsonController, Post, Put, Delete, Get, Body, Param, Header, QueryParam, Res, Req, UseBefore
} from 'routing-controllers';
import PostGetIndAccessLogReqDto from './dto/PostGetIndAccessLogReqDto';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import PostGetIndAccessLogRequestValidator from './validator/PostGetIndAccessLogRequestValidator';
import AccessLogService from '../services/AccessLogService';

@JsonController('/book-operate')
export default class AccessLogControler {
    /**
     * 個人用共有アクセスログ取得(非推奨)
     * @deprecated 代わりに POST /accesslog を使用
     */
    @Post('/ind/accesslog')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostGetIndAccessLogRequestValidator)
    async getIndAccessLog (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostGetIndAccessLogReqDto, req.body);
        dto = <PostGetIndAccessLogReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);

        // アクセスログ取得を実行
        const service: AccessLogService = new AccessLogService();
        const ret = await service.getIndAccessLog(dto, operator);
        return ret;
    }

    /**
     * 個人用共有アクセスログ取得
     */
    @Post('/accesslog')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostGetIndAccessLogRequestValidator)
    async postGetIndAccessLog (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostGetIndAccessLogReqDto, req.body);
        dto = <PostGetIndAccessLogReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);

        // アクセスログ取得を実行
        const service: AccessLogService = new AccessLogService();
        const ret = await service.getIndAccessLog(dto, operator);
        return ret;
    }
}
