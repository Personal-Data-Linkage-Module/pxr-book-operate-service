/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

/**
 * 蓄積データサービス
 */
export default class StoreServiceDto {
    /**
     * オペレーター
     */
    operator: Operator;

    /**
     * リクエスト
     */
    requestBody: any;

    /**
     * オペレーター取得
     */
    public getOperator (): Operator {
        return this.operator;
    }

    /**
     * オペレーター設定
     * @param operator
     */
    public setOperator (operator: Operator) {
        this.operator = operator;
    }

    /**
     * リクエスト取得
     */
    public getRequestBody (): any {
        return this.requestBody;
    }

    /**
     * リクエスト設定
     * @param requestBody
     */
    public setRequestBody (requestBody: any) {
        this.requestBody = requestBody;
    }
}
