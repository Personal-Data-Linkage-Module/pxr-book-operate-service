/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import CatalogDto from './dto/CatalogDto';
/* eslint-enable */
import { doGetRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import Config from '../common/Config';
import urljoin = require('url-join');
const Configure = Config.ReadConfig('./config/config.json');

export default class CatalogService {
    /**
     * カタログ情報取得
     * @param catalogDto
     * @param includeDeleted 論理削除済データ取得フラグ. 状態共有機能カタログ取得の際はtrue
     */
    public async getCatalogInfo (catalogDto: CatalogDto, includeDeleted = false): Promise<any> {
        const message = catalogDto.getMessage();
        // URLを生成
        let url = null;
        // コードでカタログを取得する
        if (catalogDto.getVersion()) {
            url = urljoin(catalogDto.getUrl(), catalogDto.getCode() + '', catalogDto.getVersion() + '', '?includeDeleted=' + includeDeleted);
        } else {
            url = urljoin(catalogDto.getUrl(), catalogDto.getCode() + '');
        }

        const options = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                session: encodeURIComponent(JSON.stringify(catalogDto.getOperator()))
            }
        };

        try {
            // カタログサービスからカタログを取得
            const result = await doGetRequest(url, options);
            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.UNAUTHORIZED);
            }
            // カタログ情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CATALOG, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * カタログ情報取得
     * @param catalogDto
     */
    public async getNs (catalogDto: CatalogDto): Promise<any> {
        const message = catalogDto.getMessage();
        // URLを生成
        let url;
        const baseUrl = Configure.catalogUrl;
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            url = baseUrl + '?ns=' + encodeURIComponent(catalogDto.getNs());
        } else {
            url = baseUrl + encodeURIComponent('?ns=' + catalogDto.getNs());
        }

        const options = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                session: encodeURIComponent(JSON.stringify(catalogDto.getOperator()))
            }
        };

        try {
            // カタログサービスからカタログを取得
            const result = await doGetRequest(url, options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.UNAUTHORIZED);
            }
            // カタログ情報を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CATALOG, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * extNameを取得する
     * @param catalogDto
     */
    public async getExtName (catalogDto: CatalogDto) {
        const message = catalogDto.getMessage();
        const url = catalogDto.getUrl() + '/name';
        const options = {
            headers: {
                accept: 'application/json',
                session: encodeURIComponent(JSON.stringify(catalogDto.getOperator()))
            }
        };
        try {
            // カタログサービスからカタログを取得
            const result = await doGetRequest(url, options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.UNAUTHORIZED);
            }
            // カタログ情報を戻す
            return result.body['ext_name'];
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CATALOG, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
