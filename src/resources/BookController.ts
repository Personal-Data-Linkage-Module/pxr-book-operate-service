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
import PostGetBookReqDto from './dto/PostGetBookReqDto';
import PostGetBookResDto from './dto/PostGetBookResDto';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import OperatorService from '../services/OperatorService';
import PostGetBookRequestValidator from './validator/PostGetBookRequestValidator';
import BookDto from '../services/dto/BookDto';
import BookService from '../services/BookService';
import { applicationLogger } from '../common/logging';

@JsonController('/book-operate')
export default class BookControler {
    /**
     * Book参照
     */
    @Post('/book/search')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostGetBookRequestValidator)
    async postGetBook (@Req() req: Request, @Res() res: Response): Promise<any> {
        // パラメータを取得
        let dto = await transformAndValidate(PostGetBookReqDto, req.body);
        dto = <PostGetBookReqDto>dto;

        // オペレーターセッション情報を取得
        const operator = await OperatorService.authMe(req);

        // BOOK参照オブジェクトを生成
        const bookDto = new BookDto();
        bookDto.setUserId(dto.userId);
        bookDto.setType(dto.type);
        bookDto.setIdentifier(dto.identifier);
        bookDto.setUpdatedAt(dto.updatedAt);
        bookDto.setCode(dto._code);
        bookDto.setWf(null);
        bookDto.setApp(dto.app);

        // Bookデータ取得者情報をログに出力
        applicationLogger.info('operatorType: ' + operator.getType() + ' , loginId: ' + operator.getLoginId() + ' が以下の条件でBookを参照');
        applicationLogger.info(JSON.stringify(bookDto));

        // サービス層のBOOK参照を実行
        const service: BookService = new BookService();
        const ret: PostGetBookResDto = await service.getBook(bookDto);
        return ret.getAsJson();
    }
}
