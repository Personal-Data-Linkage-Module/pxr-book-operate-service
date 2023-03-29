/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import AppError from '../../common/AppError';
import { ResponseCode } from '../../common/ResponseCode';
import { transformAndValidate } from 'class-transformer-validator';
import PostUserDeleteReqDto from '../dto/PostUserDeleteReqDto';
import Config from '../../common/Config';
const Message = Config.ReadConfig('./config/message.json');

@Middleware({ type: 'before' })
export default class PostUserDeleteRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!request.body || JSON.stringify(request.body) === JSON.stringify({})) {
            throw new AppError(Message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }
        // パラメータを取得
        await transformAndValidate(PostUserDeleteReqDto, request.body);
        next();
    }
}
