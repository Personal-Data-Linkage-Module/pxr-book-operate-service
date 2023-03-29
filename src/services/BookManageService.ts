/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import BookManageDto from './dto/BookManageDto';
import { CoreOptions } from 'request';
import { transformAndValidate } from 'class-transformer-validator';
import SharingDataDefinition from '../domains/SharingDataDefinition';
import { applicationLogger } from '../common/logging';
/* eslint-enable */
import { doPostRequest, doGetRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import urljoin = require('url-join');

export default class BookManageService {
    /**
     * My-Condition-Book管理サービスの利用者ID連携を呼び出す
     * @param bookManageDto
     */
    public async getCooperateInfo (bookManageDto: BookManageDto): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();
        // URLを生成
        const url = bookManageDto.getUrl();
        // bodyを生成
        const bodyStr = JSON.stringify({
            identifyCode: bookManageDto.getIdentifyCode()
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                session: operator.getEncodeData()
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスから利用者ID連携を呼び出す
            const result = await doPostRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_USERIDCOOPERATE, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_USERIDCOOPERATE, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_USERIDCOOPERATE, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_USERIDCOOPERATE, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * My-Condition-Book管理サービスの利用者ID連携解除を呼び出す
     * @param bookManageDto
     */
    public async cancelCooperateInfo (bookManageDto: BookManageDto): Promise<any> {
        // オペレータ情報を取得
        const operator = bookManageDto.getOperator();

        // メッセージ情報を取得
        const message = bookManageDto.getMessage();

        // URLを生成
        const url = bookManageDto.getUrl();
        const bodyStr: string = JSON.stringify({
            identifyCode: bookManageDto.getIdentifyCode()
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                session: operator.getEncodeData()
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスから利用者ID連携を呼び出す
            const result = await doPostRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_CANCELUSERIDCOOPERATE, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * My-Condition-Book管理サービスのデータ蓄積定義取得を呼び出す
     * @param bookManageDto
     */
    public async getDataInfo (bookManageDto: BookManageDto): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                session: operator.getEncodeData()
            }
        };

        try {
            // MyConditionBook管理サービスからデータ蓄積定義取得を呼び出す
            const result = await doGetRequest(bookManageDto.getUrl(), options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                return 'no_user';
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK &&
                result.response.statusCode !== ResponseCode.NOT_FOUND) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携取得情報を戻す
            return result.response.statusCode === ResponseCode.OK ? result.body : null;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_DATA_ACCUMU_GET, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * My-Condition-Book管理サービスの一時的共有コード照合を呼び出す
     * @param bookManageDto
     */
    public async getCollationTempShareCode (bookManageDto: BookManageDto): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();

        // URLを生成
        const url = bookManageDto.getUrl();

        // bodyを生成
        const bodyStr = JSON.stringify({
            tempShareCode: bookManageDto.getTempShareCode()
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                session: operator.getEncodeData()
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスから一時的共有コード照合を呼び出す
            const result = await doPostRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_TEMPSHARECODECOOPERATE, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * My-Condition-Book管理サービスのデータ共有定義取得を呼び出す
     * @param bookManageDto
     */
    public async getDataShareDefined (bookManageDto: BookManageDto): Promise<SharingDataDefinition[]> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();

        // URLを生成
        let url: string;
        let query: string = '?id=' + bookManageDto.getUserId();
        if (bookManageDto.getApplication()) {
            query += '&app=' + bookManageDto.getApplication();
        }
        if (bookManageDto.getIsGetData()) {
            query += '&to=' + bookManageDto.getIsGetData();
        }
        if (bookManageDto.getActor()) {
            query += '&actor=' + bookManageDto.getActor();
        }
        if ((bookManageDto.getUrl() + '').indexOf('pxr-block-proxy') === -1) {
            url = urljoin(bookManageDto.getUrl(), query);
        } else {
            url = bookManageDto.getUrl() + encodeURIComponent(query);
        }

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                session: operator.getEncodeData()
            }
        };

        let result;
        try {
            // MyConditionBook管理サービスからデータ共有定義取得を呼び出す
            result = await doGetRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_GETDATASHAREDEFINED, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_GETDATASHAREDEFINED, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_GETDATASHAREDEFINED, ResponseCode.UNAUTHORIZED);
            }
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_GETDATASHAREDEFINED, ResponseCode.SERVICE_UNAVAILABLE, err);
        }

        try {
            // データ共有定義情報を戻す
            applicationLogger.info('share:' + JSON.stringify(result.body));
            const domain = await transformAndValidate(SharingDataDefinition, result.body) as SharingDataDefinition[];
            return domain;
        } catch (err) {
            throw new AppError('Book管理サービス.データ共有定義取得の結果を内部処理用に変換することに失敗しました', ResponseCode.INTERNAL_SERVER_ERROR, err);
        }
    }

    /**
     * My-Condition-Book管理サービスのBook一覧を呼び出す
     * @param bookManageDto
     */
    public async getCoopList (bookManageDto: BookManageDto, pxrId?: string): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();
        let bodyStr;
        if (pxrId) {
            bodyStr = JSON.stringify({
                pxrId: [pxrId],
                createdAt: null
            });
        } else {
            bodyStr = JSON.stringify({
                pxrId: null,
                createdAt: null
            });
        }

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                session: operator.getEncodeData()
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスからデータ蓄積定義取得を呼び出す
            const result = await doPostRequest(bookManageDto.getUrl(), options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK &&
                result.response.statusCode !== ResponseCode.NOT_FOUND) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携取得情報を戻す
            return result.response.statusCode === ResponseCode.OK ? result.body : null;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.BOOK_MANAGE_BOOK_LIST_RESPONSE_STATUS, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * My-Condition-Book管理サービスのMy-Condition-Book一覧取得を呼び出す
     * @param bookManageDto
     */
    public async searchUser (bookManageDto: BookManageDto): Promise<any> {
        const operator = bookManageDto.getOperator();
        const message = bookManageDto.getMessage();

        // URLを生成
        const url = bookManageDto.getUrl();

        // bodyを生成
        const bodyStr = JSON.stringify({
            actor: bookManageDto.getActor() ? bookManageDto.getActor() : operator.getActorCode(),
            userId: bookManageDto.getUserId()
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyStr),
                session: operator.getEncodeData()
            },
            body: bodyStr
        };

        try {
            // MyConditionBook管理サービスからMy-Condition-Book一覧取得を呼び出す
            const result = await doPostRequest(url, options);

            // レスポンスコードが200以外の場合
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200以外の場合、エラーを返す
                throw new AppError(message.FAILED_BOOK_MANAGE_BOOK_LIST, ResponseCode.UNAUTHORIZED);
            }
            // 利用者ID連携情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_BOOK_MANAGE_BOOK_LIST, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
