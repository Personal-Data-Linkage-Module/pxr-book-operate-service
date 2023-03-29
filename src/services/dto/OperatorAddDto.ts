/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

/**
 * オペレーター追加サービスデータ
 */
export default class OperatorAddDto {
    /**
     * URL
     */
    private url: string = null;

    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * message
     */
    private message: any = null;

    /**
     * 利用者ID
     */
    private userId: string = null;

    /**
     * Regionカタログコード
     */
    private regionCatalogCode: number = null;

    /**
     * APPカタログコード
     */
    private appCatalogCode: number = null;

    /**
     * WFカタログコード
     */
    private wfCatalogCode: number = null;

    /**
     * URL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * 利用者ID取得
     */
    public getUserId (): string {
        return this.userId;
    }

    /**
     * Regionカタログコード取得
     */
    public getRegionCatalogCode (): number {
        return this.regionCatalogCode;
    }

    /**
     * APPカタログコード取得
     */
    public getAppCatalogCode (): number {
        return this.appCatalogCode;
    }

    /**
     * WFカタログコード取得
     */
    public getWfCatalogCode (): number {
        return this.wfCatalogCode;
    }

    /**
     * URL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
    }

    /**
     * オペレータ情報取得
     */
    public getOperator (): Operator {
        return this.operator;
    }

    /**
     * オペレータ情報設定
     * @param operator
     */
    public setOperator (operator: Operator) {
        this.operator = operator;
    }

    /**
     * message
     */
    public getMessage (): any {
        return this.message;
    }

    /**
     * message
     * @param message
     */
    public setMessage (message: any) {
        this.message = message;
    }

    /**
     * userId
     * @param userId
     */
    public setUserId (userId: string) {
        this.userId = userId;
    }

    /**
     * regionCatalogCode
     * @param regionCatalogCode
     */
    public setRegionCatalogCode (regionCatalogCode: number) {
        this.regionCatalogCode = regionCatalogCode;
    }

    /**
     * appCatalogCode
     * @param appCatalogCode
     */
    public setAppCatalogCode (appCatalogCode: number) {
        this.appCatalogCode = appCatalogCode;
    }

    /**
     * wfCatalogCode
     * @param wfCatalogCode
     */
    public setWfCatalogCode (wfCatalogCode: number) {
        this.wfCatalogCode = wfCatalogCode;
    }
}
