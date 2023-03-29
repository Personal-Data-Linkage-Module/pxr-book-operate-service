/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import ProxyRequestDomain from '../domains/ProxyRequestDomain';
import ProxyService from './ProxyService';
import Operator from '../resources/dto/OperatorReqDto';
import { v4 as uuid } from 'uuid';
/* eslint-enable */

/**
 * Book運用サービス
 */
export default class BookOperateService {
    /**
     * Block間でデータ共有を連携する
     * @param blockCode
     * @param body
     * @param operator
     */
    static async doLinkingGetShareSearch (blockCode: number, body: {}, operator: Operator, accessToken: string): Promise<any> {
        body['logIdentifier'] = uuid();
        // 送信データを生成
        const data = JSON.stringify(body);

        // リクエストを生成
        const detail: ProxyRequestDomain = {
            fromBlock: operator.getBlockCode(),
            fromPath: '/book-operate',
            toBlock: blockCode,
            toPath: '/book-operate/share/search',
            options: {
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                },
                body: data
            }
        };

        // アクセストークンが設定されている場合、リクエストヘッダーにアクセストークンを付与
        if (accessToken) {
            detail.options.headers['access-token'] = accessToken;
        }
        // Proxy経由でBook運用のデータ共有にアクセス
        const result = await ProxyService.call(detail, operator);
        return result;
    }
}
