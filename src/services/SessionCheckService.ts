/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import * as express from 'express';
import * as request from 'request';
import SessionCheckDto from './dto/SessionCheckDto';
/* eslint-enable */
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { CookieType } from '../common/Operator';
import Operator from '../resources/dto/OperatorReqDto';
import { doPostRequest } from '../common/DoRequest';
import urljoin = require('url-join');

export default class SessionCheckService {
    /**
     * セッションチェック
     * @param sessioncheckDto
     */
    public async isSessionCheck (sessionCheckDto: SessionCheckDto): Promise<any> {
        const message = sessionCheckDto.getMessage();
        // セッション情報(ヘッダー)からオペレータ情報を取得
        const operator = await this.authMe(sessionCheckDto.getRequest(), sessionCheckDto.getOperatorUrl(), message);

        // 除外メンバーが存在する場合
        const list = sessionCheckDto.getIgnoreOperatorTypeList();
        if (list && list.includes(operator.getType())) {
            // エラーを返す
            throw new AppError(message.REQUEST_UNAUTORIZED, ResponseCode.UNAUTHORIZED);
        }
        // オペレータ情報を返す
        return operator;
    }

    /**
     * オペレータ情報取得(クッキー、ヘッダ)
     * @param req
     */
    private async authMe (req: express.Request, operatorUrl: string, message: any): Promise<Operator> {
        const operator = new Operator();

        // Cookieにセッションキーが含まれているか、確認する
        const { cookies } = req;
        const sessionId = cookies[CookieType.TYPE_PERSONAL_COOKIE]
            ? cookies[CookieType.TYPE_PERSONAL_COOKIE]
            : cookies[CookieType.TYPE_APPLICATION_COOKIE]
                ? cookies[CookieType.TYPE_APPLICATION_COOKIE]
                : cookies[CookieType.TYPE_MANAGER_COOKIE]
                    ? cookies[CookieType.TYPE_MANAGER_COOKIE]
                    : '';
        if (typeof sessionId === 'string' && sessionId.length > 0) {
            operator.setSessionId(sessionId);
            operator.setSessionKey(cookies[CookieType.TYPE_PERSONAL_COOKIE]
                ? CookieType.TYPE_PERSONAL_COOKIE
                : cookies[CookieType.TYPE_APPLICATION_COOKIE]
                    ? CookieType.TYPE_APPLICATION_COOKIE
                    : CookieType.TYPE_MANAGER_COOKIE);
            // リクエストデータ生成
            const data = JSON.stringify({ sessionId: sessionId });
            // 接続のためのオプションを生成
            const options: request.CoreOptions = {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                },
                body: data
            };
            // URLの生成
            const url = urljoin(operatorUrl + '/session');
            try {
                const result = await doPostRequest(url, options);
                const { statusCode } = result.response;
                if (
                    statusCode === ResponseCode.NO_CONTENT ||
                    statusCode === ResponseCode.BAD_REQUEST ||
                    statusCode === ResponseCode.UNAUTHORIZED
                ) {
                    const ex = new AppError(
                        message.IS_NOT_AUTHORIZATION_SESSION,
                        ResponseCode.UNAUTHORIZED);
                    throw ex;
                } else if (statusCode !== ResponseCode.OK) {
                    const ex = new AppError(
                        message.FAILED_TAKE_SESSION, ResponseCode.INTERNAL_SERVER_ERROR);
                    throw ex;
                }
                operator.setEncodeData(encodeURIComponent(JSON.stringify(result.body)));
                // 必要な値は、データから取り出してメンバーへ追加
                operator.setFromJson(result.body);
            } catch (err) {
                if (err.name === AppError.NAME) {
                    throw err;
                }
                const ex = new AppError(
                    message.FAILED_CONNECT_TO_OPERATOR,
                    ResponseCode.INTERNAL_SERVER_ERROR, err);
                throw ex;
            }

        // セッションキーが無ければ、ヘッダーからセッション情報を取得できるか
        } else if (req.headers.session) {
            operator.setEncodeData(req.headers.session + '');
            // JSON化
            let data: any = decodeURIComponent(req.headers.session + '');
            while (typeof data === 'string') {
                data = JSON.parse(data);
            }
            // 必要な値は、データから取り出してメンバーへ追加
            operator.setFromJson(data);
        // ヘッダーのセッション情報も存在していない場合はエラーである
        } else {
            throw new AppError(message.NO_SESSION, ResponseCode.UNAUTHORIZED);
        }
        return operator;
    }
}
