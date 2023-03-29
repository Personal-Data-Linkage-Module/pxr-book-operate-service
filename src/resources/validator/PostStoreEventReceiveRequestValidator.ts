/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { ResponseCode } from '../../common/ResponseCode';
import PostStoreEventReceiveReqDto from '../dto/PostStoreEventReceiveReqDto';
import { sprintf } from 'sprintf-js';
const Message = Config.ReadConfig('./config/message.json');

@Middleware({ type: 'before' })
export default class PostStoreEventReceiveRequestValidator implements ExpressMiddlewareInterface {
    /** 蓄積イベント */
    readonly STORE_EVENT = 'store-event';

    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!request.body || JSON.stringify(request.body) === JSON.stringify({})) {
            throw new AppError(Message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }
        // パラメータバリデーション
        const dto = await transformAndValidate(PostStoreEventReceiveReqDto, request.body);
        if (Array.isArray(dto)) {
            throw new AppError(Message.UNEXPECTED_ARRAY_REQUEST, 400);
        }
        if (dto.sourceWf || dto.destinationWf) {
            throw new AppError(Message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }
        if ((!dto.sourceApp) || (!dto.destinationApp)) {
            throw new AppError(Message.EMPTY_APP, 400);
        }
        if (dto.type !== this.STORE_EVENT) {
            throw new AppError(sprintf(Message.VALUE_NOT_VALID, 'type'), 400);
        }
        next();
    }
}
