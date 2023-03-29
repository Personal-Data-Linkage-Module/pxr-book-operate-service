/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { sprintf } from 'sprintf-js';

@Middleware({ type: 'before' })
export default class DeleteThingDelRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        // リクエストデータを取得
        const requestData = request.params;
        const requestQuery = request.query;

        // thingSourceIdが定義されている場合
        if (!this.isUndefined(requestQuery['thingSourceId'])) {
            // 空文字チェック
            if (this.isEmpty(requestQuery['thingSourceId'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.STRING_INVALID, 'thingSourceId'), 400);
            }
        } else {
            // 必須項目チェック
            if (this.isUndefined(requestData['thingId'])) {
            // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'thingIdentifer'), 400);
            }
        }

        next();
    }

    /**
     * 空判定
     * @param target
     */
    private isEmpty (target: any): boolean {
        // null, ''は空文字数値と判定
        return target == null || target === '';
    }

    /**
     * undefined判定
     * @param target
     */
    private isUndefined (target: any): boolean {
        return target === undefined;
    }
}
