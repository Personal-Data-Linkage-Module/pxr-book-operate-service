/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorAddDto from './dto/OperatorAddDto';
import { CoreOptions } from 'request';
import { Request } from 'express';
import { doPostRequest, doGetRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { OperatorType } from '../common/Operator';
import ConfigReader from '../common/Config';
import UserInformationDto from '../resources/dto/UserInformationDto';
import { transformAndValidate } from 'class-transformer-validator';
import OperatorDomain from '../domains/OperatorDomain';
import { ValidationError } from 'class-validator';
import Operator from '../resources/dto/OperatorReqDto';
import request = require('request');
/* eslint-enable */
import config = require('config');
const Message = ConfigReader.ReadConfig('./config/message.json');
const Configure = ConfigReader.ReadConfig('./config/config.json');

/**
 * オペレーターサービス
 */
export default class OperatorService {
    /**
     * オペレーターのセッション情報を取得する
     * @param req リクエストオブジェクト
     */
    static async authMe (req: Request): Promise<Operator> {
        const { cookies } = req;
        const sessionId = cookies[OperatorDomain.TYPE_PERSONAL_KEY]
            ? cookies[OperatorDomain.TYPE_PERSONAL_KEY]
            : cookies[OperatorDomain.TYPE_APPLICATION_KEY]
                ? cookies[OperatorDomain.TYPE_APPLICATION_KEY]
                : cookies[OperatorDomain.TYPE_MANAGER_KEY];
        // Cookieからセッションキーが取得できた場合、オペレーターサービスに問い合わせる
        if (typeof sessionId === 'string' && sessionId.length > 0) {
            const data = JSON.stringify({ sessionId: sessionId });
            const options: request.CoreOptions = {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                },
                body: data
            };
            try {
                const result = await doPostRequest(
                    config.get('operatorService.session'),
                    options
                );
                // ステータスコードにより制御
                const { statusCode } = result.response;
                if (statusCode === 204 || statusCode === 400) {
                    throw new AppError(Message.NOT_AUTHORIZED, 401);
                } else if (statusCode !== 200) {
                    throw new AppError(Message.FAILED_TAKE_SESSION, 500);
                }
                const operator = new Operator();
                operator.setFromJson(result.body);
                return operator;
            } catch (err) {
                if (err instanceof AppError) {
                    throw err;
                }

                throw new AppError(
                    Message.FAILED_CONNECT_TO_OPERATOR, 500, err);
            }

            // ヘッダーにセッション情報があれば、それを流用する
        } else if (req.headers.session) {
            let data = decodeURIComponent(req.headers.session + '');
            while (typeof data === 'string') {
                data = JSON.parse(data);
            }
            const operator = new Operator();
            operator.setFromJson(data);
            return operator;

            // セッション情報が存在しない場合、未ログインとしてエラーをスローする
        } else {
            throw new AppError(Message.NOT_AUTHORIZED, 401);
        }
    }

    /**
     * オペレーター追加
     * @param OperatorAddDto
     */
    static async addProhibitedIndividual (operatorAddDto: OperatorAddDto): Promise<any> {
        // ログイン不可個人を登録
        let body;
        if (operatorAddDto.getRegionCatalogCode()) {
            body = JSON.stringify({
                type: OperatorType.TYPE_IND,
                loginId: operatorAddDto.getUserId(),
                userId: operatorAddDto.getUserId(),
                regionCatalogCode: operatorAddDto.getRegionCatalogCode(),
                loginProhibitedFlg: true
            });
        } else if (operatorAddDto.getAppCatalogCode()) {
            body = JSON.stringify({
                type: OperatorType.TYPE_IND,
                loginId: operatorAddDto.getUserId(),
                userId: operatorAddDto.getUserId(),
                appCatalogCode: operatorAddDto.getAppCatalogCode(),
                loginProhibitedFlg: true
            });
        } else {
            body = JSON.stringify({
                type: OperatorType.TYPE_IND,
                loginId: operatorAddDto.getUserId(),
                userId: operatorAddDto.getUserId(),
                wfCatalogCode: operatorAddDto.getWfCatalogCode(),
                loginProhibitedFlg: true
            });
        }

        return OperatorService.request(
            operatorAddDto.getUrl(),
            encodeURIComponent(JSON.stringify(operatorAddDto.getOperator())),
            'post',
            body
        );
    }

    /**
     * 利用者情報の登録
     * @param userId
     * @param userInfo
     * @param operator
     */
    static async registerUserInformation (userId: string, userInfo: UserInformationDto | undefined, operator: string) {
        if (userInfo) {
            this.request(
                Configure.operatorUrl + '/user/info',
                operator,
                'post',
                JSON.stringify({
                    userId: userId,
                    userInfo: userInfo
                })
            );
        }
    }

    /**
     * 利用者情報を取得
     * @param userId
     * @param operator
     */
    static async acquireUserInformation (userId: string, operator: string) {
        const result = await this.request(
            Configure.operatorUrl + '/user/info?userId=' + userId,
            operator,
            'get'
        );
        try {
            const dto = (await transformAndValidate(UserInformationDto, result.body.userInfo || {})) as UserInformationDto;
            return dto;
        } catch (err) {
            if (
                err instanceof ValidationError ||
                (Array.isArray(err) && err.every(element => element instanceof ValidationError))
            ) {
                return null;
            }
            throw err;
        }
    }

    /**
     *
     * @param url
     * @param body
     * @param operator
     */
    static async request (url: string, operator: string, method: 'post' | 'get', body?: string) {
        const options: CoreOptions = {
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                session: operator
            }
        };
        if (body) {
            options.headers['content-length'] = Buffer.byteLength(body);
            options.body = body;
        }
        try {
            // postを実行
            const result = method === 'post' ? await doPostRequest(url, options) : await doGetRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(
                    result.body.message || Message.FAILED_OPERATOR,
                    ResponseCode.BAD_REQUEST
                );
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(
                    Message.FAILED_OPERATOR,
                    ResponseCode.SERVICE_UNAVAILABLE
                );
            } else if (result.response.statusCode === ResponseCode.NO_CONTENT && method === 'get') {
                result.body = { userInfo: null };
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(
                    Message.FAILED_OPERATOR,
                    ResponseCode.UNAUTHORIZED
                );
            }
            return result;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(Message.FAILED_CONNECT_TO_OPERATOR, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
