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
import { Request, Response } from 'express';
import {
    JsonController, Post, Header, Res, Req, UseBefore
} from 'routing-controllers';
import PostShareReqDto from './dto/PostShareReqDto';
import PostShareResDto from './dto/PostShareResDto';
import PostShareByTempShareCodeReqDto from './dto/PostShareByTempShareCodeReqDto';
import PostShareByTempShareCodeResDto from './dto/PostShareByTempShareCodeResDto';
import PostShareSearchReqDto from './dto/PostShareSearchReqDto';
import PostShareSearchResDto from './dto/PostShareSearchResDto';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import PostShareRequestValidator from './validator/PostShareRequestValidator';
import PostShareByTempShareCodeRequestValidator from './validator/PostShareByTempShareCodeRequestValidator';
import PostShareSearchRequestValidator from './validator/PostShareSearchRequestValidator';
import ShareDto from '../services/dto/ShareDto';
import ShareService from '../services/ShareService';
import { applicationLogger } from '../common/logging';

@JsonController('/book-operate')
export default class ShareControler {
    /**
     * データ共有によるデータ取得
     */
    @Post('/share')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostShareRequestValidator)
    async postShare (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostShareReqDto, req.body);
        dto = <PostShareReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);
        applicationLogger.info('access-token:' + req.headers['access-token']);
        // アクセストークンを取得
        let accessToken = null;
        if (req.headers['access-token']) {
            accessToken = req.headers['access-token'] as string;
        }

        // サービス層のデータ共有によるデータ取得を実行
        const service: ShareService = new ShareService();
        const ret: PostShareResDto = await service.getShare(dto, operator, accessToken);
        return ret.getAsJson();
    }

    /**
     * 一時的データ共有コードによるデータ取得
     */
    @Post('/share/temp')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostShareByTempShareCodeRequestValidator)
    async postShareByTempShareCode (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostShareByTempShareCodeReqDto, req.body);
        dto = <PostShareByTempShareCodeReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);
        applicationLogger.info('access-token:' + req.headers['access-token']);
        // アクセストークンを取得
        let accessToken = null;
        if (req.headers['access-token']) {
            accessToken = req.headers['access-token'] as string;
        }

        // サービス層の一時的データ共有コードによるデータ取得を実行
        const service: ShareService = new ShareService();
        const ret: PostShareByTempShareCodeResDto = await service.getShareByTempShareCode(dto, operator, accessToken);
        return ret.getAsJson();
    }

    /**
     * データ共有
     */
    @Post('/share/search')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostShareSearchRequestValidator)
    async postShareSearch (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostShareSearchReqDto, req.body);
        dto = <PostShareSearchReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);

        // データ共有オブジェクトを生成
        const shareDto = new ShareDto();
        shareDto.setOperator(operator);
        shareDto.setUserId(dto.userId);
        shareDto.setTempShareCode(dto.tempShareCode);
        shareDto.setIdentifier(dto.identifier);
        shareDto.setLogIdentifier(dto.logIdentifier);
        shareDto.setUpdatedAt(dto.updatedAt);
        shareDto.setApp(dto.app);
        shareDto.setWf(null);
        shareDto.setDocumentList(dto.document);
        shareDto.setEventList(dto.event);
        shareDto.setThingList(dto.thing);

        if (dto.dest) {
            shareDto.setActorCode(dto.dest.actor);
        }
        // サービス層のデータ共有によるデータ取得を実行
        const service: ShareService = new ShareService();
        const ret: PostShareSearchResDto = await service.getShareSearch(shareDto);
        return ret.getAsJson();
    }
}
