/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import PostUserCreateReqDto from '../dto/PostUserCreateReqDto';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../../common/ResponseCode';

@Middleware({ type: 'before' })
export default class PostUserCreateRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        const requestBody = request.body;

        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!requestBody || JSON.stringify(requestBody) === JSON.stringify({})) {
            throw new AppError(message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        // attributesの判定
        if (requestBody['attributes'] && typeof requestBody['attributes'] !== 'object') {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.VALUE_INVALID, 'attributes', 'オブジェクト'), 400);
        }

        await transformAndValidate(PostUserCreateReqDto, request.body);

        next();
    }
}
