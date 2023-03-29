/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import ProxyRequestDomain from '../domains/ProxyRequestDomain';
import { doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { systemLogger } from '../common/logging';
import Operator from '../resources/dto/OperatorReqDto';
/* eslint-enable */
import Config from '../common/Config';
const Message = Config.ReadConfig('./config/message.json');
const Configure = Config.ReadConfig('./config/config.json');

/**
 * プロキシーサービスとの連携クラス
 */
export default class ProxyService {
    /**
     * Proxyサービス プロキシーAPIをコールする（Postメソッド）
     * @param detail リクエスト明細
     * @param operator オペレーター情報
     */
    public static async call (detail: ProxyRequestDomain, operator: Operator): Promise<any> {
        try {
            detail.options.headers.session = operator.getEncodeData();
            const uri = `${Configure['proxyUrl']}?` +
                `from_block=${detail.fromBlock}&` +
                `from_path=${encodeURIComponent(detail.fromPath)}&` +
                `block=${detail.toBlock}&` +
                `path=${encodeURIComponent(detail.toPath)}`;
            const result = await doPostRequest(uri, detail.options);
            const { statusCode } = result.response;
            systemLogger.debug('ProxyService.call method output this debug log.', result);
            if (statusCode !== 200) {
                throw new AppError(Message.FAILED_LINKAGE, 500);
            }
            return result.body;
        } catch (err) {
            if (err instanceof AppError) {
                throw err;
            }
            throw new AppError(Message.FAILED_CONNECT_TO_LINKAGE_SERVICE, 500, err);
        }
    }
}
