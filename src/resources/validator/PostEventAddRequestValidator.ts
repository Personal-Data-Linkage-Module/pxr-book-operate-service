/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import { transformAndValidate } from 'class-transformer-validator';
import PostEventByUserIdReqDto from '../dto/PostEventByUserIdReqDto';
import AppError from '../../common/AppError';
import Config from '../../common/Config';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../../common/ResponseCode';

@Middleware({ type: 'before' })
export default class PostEventAddRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        // リクエストデータを取得
        const requestBody = request.body;

        // 空かどうか判定し、空と判定した場合にはエラーをスロー
        if (!requestBody || JSON.stringify(requestBody) === JSON.stringify({})) {
            throw new AppError(message.REQUEST_IS_EMPTY, ResponseCode.BAD_REQUEST);
        }

        // リクエストボディ内の各要素をチェック
        // userIdが定義されていない場合
        if (this.isUndefined(requestBody['userId'])) {
            throw new AppError(sprintf(message.NO_PARAM, 'userId'), 400);
        }
        // idが定義されていない場合
        if (this.isUndefined(requestBody['id'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'id'), 400);
        }
        // codeが定義されていない場合
        if (this.isUndefined(requestBody['code'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'code'), 400);
        }
        // code.valueが定義されていない場合
        if (requestBody['code'] &&
            this.isUndefined(requestBody['code']['value'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'code.value'), 400);
        }
        // code.value._valueが定義されていない場合
        if (requestBody['code'] &&
            requestBody['code']['value'] &&
            this.isUndefined(requestBody['code']['value']['_value'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'code.value._value'), 400);
        }
        // code.value._verが定義されていない場合
        if (requestBody['code'] &&
            requestBody['code']['value'] &&
            this.isUndefined(requestBody['code']['value']['_ver'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'code.value._ver'), 400);
        }
        // startが定義されていない場合
        if (this.isUndefined(requestBody['start'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'start'), 400);
        }
        // endが定義されていない場合
        if (this.isUndefined(requestBody['end'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'end'), 400);
        }
        // locationが定義されていない場合
        if (this.isUndefined(requestBody['location'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'location'), 400);
        }
        // sourceIdが定義されていない場合
        if (this.isUndefined(requestBody['sourceId'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'sourceId'), 400);
        }
        // envが定義されていない場合
        if (this.isUndefined(requestBody['env'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'env'), 400);
        }
        // appが定義されていない場合
        if (this.isUndefined(requestBody['app'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'app'), 400);
        }
        // thingが定義されていない場合
        if (this.isUndefined(requestBody['thing'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NO_PARAM, 'thing'), 400);
        }
        // wfに値が定義されている場合
        if (!(this.isUndefined(requestBody['wf']) || this.isNull(requestBody['wf']))) {
            // エラーレスポンスを返す
            throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }

        let appWfCheck: string = '';
        if (!this.isNull(requestBody['app'])) {
            // appに値が定義されている場合

            // app.codeが定義されていない場合
            if (this.isUndefined(requestBody['app']['code'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.code'), 400);
            }
            // app.code.valueが定義されていない場合
            if (requestBody['app']['code'] &&
                this.isUndefined(requestBody['app']['code']['value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.code.value'), 400);
            }
            // app.code.value._valueが定義されていない場合
            if (requestBody['app']['code'] &&
                requestBody['app']['code']['value'] &&
                this.isUndefined(requestBody['app']['code']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.code.value._value'), 400);
            }
            // app.code.value._verが定義されていない場合
            if (requestBody['app']['code'] &&
                requestBody['app']['code']['value'] &&
                this.isUndefined(requestBody['app']['code']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.code.value._ver'), 400);
            }
            // app.appが定義されていない場合
            if (this.isUndefined(requestBody['app']['app'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.app'), 400);
            }
            // app.app.valueが定義されていない場合
            if (requestBody['app']['app'] &&
                this.isUndefined(requestBody['app']['app']['value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.app.value'), 400);
            }
            // app.app.value._valueが定義されていない場合
            if (requestBody['app']['app'] &&
                requestBody['app']['app']['value'] &&
                this.isUndefined(requestBody['app']['app']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.app.value._value'), 400);
            }
            // app.app.value._verが定義されていない場合
            if (requestBody['app']['app'] &&
                requestBody['app']['app']['value'] &&
                this.isUndefined(requestBody['app']['app']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NO_PARAM, 'app.app.value._ver'), 400);
            }
            appWfCheck = 'app';
        }

        // 各値のチェック

        // userIdが空の場合
        if (this.isNull(requestBody['userId']['value'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.STRING_INVALID, 'userId'), 400);
        }
        // idがnull以外の場合
        if (!this.isNull(requestBody['id']['value'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.VALUE_INVALID, 'id', 'null'), 400);
        }
        // _valueが数値以外の場合
        if (!this.isNumber(requestBody['code']['value']['_value'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NUMBER_INVALID, 'code.value._value'), 400);
        }
        // _verが数値以外の場合
        if (!this.isNumber(requestBody['code']['value']['_ver'])) {
            // エラーレスポンスを返す
            throw new AppError(sprintf(message.NUMBER_INVALID, 'code.value._ver'), 400);
        }
        // appが定義されている場合
        if (appWfCheck === 'app') {
            // _valueが数値以外の場合
            if (!this.isNumber(requestBody['app']['code']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'app.code.value._value'), 400);
            }
            // _verが数値以外の場合
            if (!this.isNumber(requestBody['app']['code']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'app.code.value._ver'), 400);
            }
            // _valueが数値以外の場合
            if (!this.isNumber(requestBody['app']['app']['value']['_value'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'app.app.value._value'), 400);
            }
            // _verが数値以外の場合
            if (!this.isNumber(requestBody['app']['app']['value']['_ver'])) {
                // エラーレスポンスを返す
                throw new AppError(sprintf(message.NUMBER_INVALID, 'app.app.value._ver'), 400);
            }
        }
        await transformAndValidate(PostEventByUserIdReqDto, request.body);

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
