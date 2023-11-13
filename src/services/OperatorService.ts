/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import OperatorAddDto from './dto/OperatorAddDto';
import { CoreOptions } from 'request';
import { Request } from 'express';
import { doPostRequest, doGetRequest, doDeleteRequest} from '../common/DoRequest';
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
    static BLOCK_TYPE_APP: string = 'app';
    static BLOCK_TYPE_REGION: string = 'region-root';
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
    static async registerUserInformation (operatorAddDto: OperatorAddDto, operatorBlockType: string, userInfo: UserInformationDto | undefined, operator: string) {
        const userId = operatorAddDto.getUserId();
        const appCode = operatorAddDto.getAppCatalogCode();
        const regionCode = operatorAddDto.getRegionCatalogCode();
        if (userInfo) {
            this.checkCodeBlockType(null, appCode, regionCode, operatorBlockType);
            this.request(
                Configure.operatorUrl + '/user/info',
                operator,
                'post',
                JSON.stringify({
                    userId: userId,
                    wfCode: null,
                    appCode: appCode,
                    regionCode: regionCode,
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
    static async acquireUserInformation (userId: string, wfCode: number, appCode: number, regionCode: number, operator: string) {
        if (!wfCode && !appCode && !regionCode) {
            // コード設定のない利用者は不正なデータのため、利用者情報取得をスキップする
            return null;
        }
        // クエリパラメータを設定
        const codeQuery = wfCode ? '&wfCode=' + wfCode : appCode ? '&appCode=' + appCode : '&regionCode=' + regionCode;
        const result = await this.request(
            Configure.operatorUrl + '/user/info?userId=' + userId + codeQuery,
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
     * オペレーターID取得
     * @param OperatorAddDto
     */
    static async getOperatorId (operatorAddDto: OperatorAddDto, operatorBlockType: string): Promise<any> {
        const appCode = operatorAddDto.getAppCatalogCode();
        const regionCode = operatorAddDto.getRegionCatalogCode();
        // dtoに適切なコードが設定されていることを確認し、クエリパラメータを設定
        this.checkCodeBlockType(null, appCode, regionCode, operatorBlockType);
        const codeQuery = appCode ? '&appCode=' + appCode : '&regionCode=' + regionCode;
        // url生成
        const url = (operatorAddDto.getUrl() + '?type=' + OperatorType.TYPE_IND + '&loginId=' + operatorAddDto.getUserId() + codeQuery);

        const res = await OperatorService.request(
            url,
            encodeURIComponent(JSON.stringify(operatorAddDto.getOperator())),
            'get'
        );
        return res.body['operatorId'];
    }

    /**
     * オペレーター削除
     * @param operatorId
     * @param operatorUrl
     * @param operator
     */
    static async deleteOperator (operatorId: number, operatorUrl: string, operator: Operator): Promise<any> {
        // url生成
        const url = (operatorUrl + '/' + operatorId);

        return OperatorService.request(
            url,
            encodeURIComponent(JSON.stringify(operator)),
            'delete'
        );
    }

    /**
     *
     * @param url
     * @param body
     * @param operator
     */
    static async request (url: string, operator: string, method: 'post' | 'get' | 'delete', body?: string) {
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
            // リクエストを実行
            const result = method === 'post' ? await doPostRequest(url, options)
                : method === 'get' ? await doGetRequest(url, options)
                    : await doDeleteRequest(url, options);

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

    /**
     * オペレータの所属blockと設定されたcode情報の整合性をチェックする
     * @param wfCode
     * @param appCode
     * @param regionCode
     * @param operatorBlockType
     */
    private static checkCodeBlockType (wfCode: number, appCode: number, regionCode: number, operatorBlockType: string) {
        // オペレータの所属blockと合致するcode情報が設定されていない場合エラー
        if ((operatorBlockType === this.BLOCK_TYPE_APP && !appCode) || (operatorBlockType === this.BLOCK_TYPE_REGION && !regionCode)) {
            throw new AppError(Message.MISMATCH_OPERATOR_BLOCK_TYPE_AND_SERVICE_CODE, 400);
        }
    }

    /**
     * サービス（アプリケーション）のカタログコード取得
     * @param operator
     */
    static async getAppWfCatalogCodeByOperator (operator: Operator) {
        let appCatalogCode: number;
        const wfCatalogCode: number = null;
        const service = operator.getService();
        if (service) {
            if (operator.getType() === OperatorDomain.TYPE_APPLICATION_NUMBER) {
                appCatalogCode = service['_value'];
            } else {
                appCatalogCode = null;
            }
        } else {
            const roles = operator.getRoles();
            // APP
            appCatalogCode = operator.getType() === OperatorDomain.TYPE_APPLICATION_NUMBER ? parseInt(roles[0]['_value']) : null;
        }
        return { appCatalogCode, wfCatalogCode };
    }
}
