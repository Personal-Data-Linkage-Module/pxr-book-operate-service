/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import PostThingBulkByUserIdByEventIdReqDto from '../dto/PostThingBulkByUserIdByEventIdReqDto';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../../common/ResponseCode';

@Middleware({ type: 'before' })
export default class PostThingBulkAddRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        // リクエストデータを取得
        const requestBody = request.body;

        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!requestBody || JSON.stringify(requestBody) === JSON.stringify({})) {
            throw new AppError(message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        // 配列でない場合
        if (!Array.isArray(requestBody)) {
            throw new AppError(message.validation.isArray, 400);
        }

        // リクエストボディ内の各要素をチェック
        for (let index = 0; index < requestBody.length; index++) {
            // idが定義されていない場合
            if (this.isUndefined(requestBody[index]['id'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'id'), 400);
            }
            // codeが定義されていない場合
            if (this.isUndefined(requestBody[index]['code'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'code'), 400);
            }
            // code.valueが定義されていない場合
            if (requestBody[index]['code'] &&
                this.isUndefined(requestBody[index]['code']['value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'code.value'), 400);
            }
            // code.value._valueが定義されていない場合
            if (requestBody[index]['code'] &&
                requestBody[index]['code']['value'] &&
                this.isUndefined(requestBody[index]['code']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'code.value._value'), 400);
            }
            // code.value._verが定義されていない場合
            if (requestBody[index]['code'] &&
                requestBody[index]['code']['value'] &&
                this.isUndefined(requestBody[index]['code']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'code.value._ver'), 400);
            }
            // sourceIdが定義されていない場合
            if (this.isUndefined(requestBody[index]['sourceId'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'sourceId'), 400);
            }
            // envが定義されていない場合
            if (this.isUndefined(requestBody[index]['env'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'env'), 400);
            }
            // appが定義されていない場合
            if (this.isUndefined(requestBody[index]['app'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app'), 400);
            }
            // wfに値が定義されている場合
            if (!(this.isUndefined(requestBody['wf']) || this.isNull(requestBody['wf']))) {
                // エラーレスポンスを返す
                throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
            }

            let appWfCheck: string = '';
            if (!this.isNull(requestBody[index]['app'])) {
                // appに値が定義されている場合

                // app.codeが定義されていない場合
                if (this.isUndefined(requestBody[index]['app']['code'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.code'), 400);
                }
                // app.code.valueが定義されていない場合
                if (requestBody[index]['app']['code'] &&
                    this.isUndefined(requestBody[index]['app']['code']['value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.code.value'), 400);
                }
                // app.code.value._valueが定義されていない場合
                if (requestBody[index]['app']['code'] &&
                    requestBody[index]['app']['code']['value'] &&
                    this.isUndefined(requestBody[index]['app']['code']['value']['_value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.code.value._value'), 400);
                }
                // app.code.value._verが定義されていない場合
                if (requestBody[index]['app']['code'] &&
                    requestBody[index]['app']['code']['value'] &&
                    this.isUndefined(requestBody[index]['app']['code']['value']['_ver'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.code.value._ver'), 400);
                }
                // app.appが定義されていない場合
                if (this.isUndefined(requestBody[index]['app']['app'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.app'), 400);
                }
                // app.app.valueが定義されていない場合
                if (requestBody[index]['app']['app'] &&
                    this.isUndefined(requestBody[index]['app']['app']['value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.app.value'), 400);
                }
                // app.app.value._valueが定義されていない場合
                if (requestBody[index]['app']['app'] &&
                    requestBody[index]['app']['app']['value'] &&
                    this.isUndefined(requestBody[index]['app']['app']['value']['_value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.app.value._value'), 400);
                }
                // app.app.value._verが定義されていない場合
                if (requestBody[index]['app']['app'] &&
                    requestBody[index]['app']['app']['value'] &&
                    this.isUndefined(requestBody[index]['app']['app']['value']['_ver'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NO_PARAM, 'app.app.value._ver'), 400);
                }
                appWfCheck = 'app';
            }

            // 各値のチェック

            // idがnull以外の場合
            if (!this.isNull(requestBody[index]['id']['value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.VALUE_INVALID, 'id', 'null'), 400);
            }
            // _valueが数値以外の場合
            if (!this.isNumber(requestBody[index]['code']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'code.value._value'), 400);
            }
            // _verが数値以外の場合
            if (!this.isNumber(requestBody[index]['code']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'code.value._ver'), 400);
            }
            // appが定義されている場合
            if (appWfCheck === 'app') {
                // _valueが数値以外の場合
                if (!this.isNumber(requestBody[index]['app']['code']['value']['_value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NUMBER_INVALID, 'app.code.value._value'), 400);
                }
                // _verが数値以外の場合
                if (!this.isNumber(requestBody[index]['app']['code']['value']['_ver'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NUMBER_INVALID, 'app.code.value._ver'), 400);
                }
                // _valueが数値以外の場合
                if (!this.isNumber(requestBody[index]['app']['app']['value']['_value'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NUMBER_INVALID, 'app.app.value._value'), 400);
                }
                // _verが数値以外の場合
                if (!this.isNumber(requestBody[index]['app']['app']['value']['_ver'])) {
                    // エラーレスポンスを返す
                    throw new AppError(sprintf(message.NUMBER_INVALID, 'app.app.value._ver'), 400);
                }
            }
        }
        await transformAndValidate(PostThingBulkByUserIdByEventIdReqDto, request.body);
        next();
    }

    /**
     * undefined判定
     * @param target
     */
    private isUndefined (target: any): boolean {
        return target === undefined;
    }

    /**
     * null判定
     * @param target
     */
    private isNull (target: any): boolean {
        return target === null;
    }

    /**
     * 数値判定
     * @param target
     */
    private isNumber (target: any): boolean {
        // null, falseは数値ではないと判定
        if (target == null || target === false) {
            return false;
        }
        return !isNaN(Number(target));
    }
}
