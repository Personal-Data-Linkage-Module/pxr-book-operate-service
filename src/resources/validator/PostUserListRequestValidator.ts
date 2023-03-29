/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import PostUserListReqDto from '../dto/PostUserListReqDto';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { sprintf } from 'sprintf-js';
import { transformFromDateTimeToString } from '../../common/Transform';
import { ResponseCode } from '../../common/ResponseCode';
const config = Config.ReadConfig('./config/config.json');

@Middleware({ type: 'before' })
export default class PostUserListRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        const requestBody = request.body;

        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!requestBody || JSON.stringify(requestBody) === JSON.stringify({})) {
            throw new AppError(message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        // userIdの判定
        if (!this.isEmpty(requestBody['userId'])) {
            if (!Array.isArray(requestBody['userId'])) {
                // 定義されている場合で配列以外はエラーレスポンスを返す
                throw new AppError(sprintf(message.NO_ARRAY_PARAM, 'userId'), 400);
            }
            const userIdList: Array<any> = requestBody['userId'];
            if (userIdList.length === 0) {
                throw new AppError(sprintf(message.EMPTY_PARAM, 'userId'), 400);
            }
            for (let i = 0; i < userIdList.length; i++) {
                if (this.isEmpty(userIdList[i])) {
                    throw new AppError(sprintf(message.EMPTY_PARAM, 'userId'), 400);
                }
            }
        }

        // 開設日時の判定
        if ((!this.isUndefined(requestBody['establishAt'])) && (!this.isEmpty(requestBody['establishAt']))) {
            if ((!this.isUndefined(requestBody['establishAt']['start'])) && (!this.isEmpty(requestBody['establishAt']['start']))) {
                if (!this.isDateTime(requestBody['establishAt']['start'])) {
                    throw new AppError(sprintf(message.DATE_INVALID, 'establishAt.start'), 400);
                }
            }
            if ((!this.isUndefined(requestBody['establishAt']['end'])) && (!this.isEmpty(requestBody['establishAt']['end']))) {
                if (!this.isDateTime(requestBody['establishAt']['end'])) {
                    throw new AppError(sprintf(message.DATE_INVALID, 'establishAt.end'), 400);
                }
            }
            if (((!this.isUndefined(requestBody['establishAt']['start'])) && (!this.isEmpty(requestBody['establishAt']['start']))) &&
             ((!this.isUndefined(requestBody['establishAt']['end'])) && (!this.isEmpty(requestBody['establishAt']['end'])))) {
                const startDate: Date = new Date(requestBody['establishAt']['start']);
                const endDate: Date = new Date(requestBody['establishAt']['end']);
                if (this.getDateTimeDiff(startDate, endDate) < 0) {
                    throw new AppError(sprintf(message.DATE_SCOPE_INVALID, 'establishAt'), 400);
                }
            }
        }

        await transformAndValidate(PostUserListReqDto, request.body);

        next();
    }

    /**
     * 空判定
     * @param target
     */
    private isEmpty (target: any): boolean {
        // null, ''は空文字と判定
        return target == null || target === '';
    }

    /**
     * undefined判定
     * @param target
     */
    private isUndefined (target: any): boolean {
        return target === undefined;
    }

    /**
     * 日付判定
     * @param target
     */
    private isDateTime (target: string): boolean {
        const date: Date = new Date(target);
        if (date.toString() === 'Invalid Date') {
            return false;
        }
        if (transformFromDateTimeToString(config['timezone'], date) !== target) {
            return false;
        }
        return true;
    }

    /**
     * 日付期間差異取得
     * @param from
     * @param to
     */
    private getDateTimeDiff (from: Date, to: Date): number {
        return to.getTime() - from.getTime();
    }
}
