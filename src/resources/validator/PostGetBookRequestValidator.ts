/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import PostGetBookReqDto from '../dto/PostGetBookReqDto';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { ResponseCode } from '../../common/ResponseCode';
const Message = Config.ReadConfig('./config/message.json');

@Middleware({ type: 'before' })
export default class PostGetBookRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!request.body || JSON.stringify(request.body) === JSON.stringify({})) {
            throw new AppError(Message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        // パラメータバリデーション
        let dto = await transformAndValidate(PostGetBookReqDto, request.body);
        dto = <PostGetBookReqDto>dto;

        // type, identifierのいずれも指定がない場合
        if (!dto.type) {
            if (!dto.identifier) {
                throw new AppError(Message.IS_DEFINED_TYPE_IDENTIFIER, ResponseCode.BAD_REQUEST);
            }
            for (let index = 0; index < dto.identifier.length; index++) {
                if (!dto.identifier[index]) {
                    throw new AppError(Message.IS_DEFINED_TYPE_IDENTIFIER, ResponseCode.BAD_REQUEST);
                }
            }
        }
        next();
    }
}
