/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import * as express from 'express';
/* eslint-enable */

/**
 * セッションチェックサービスデータ
 */
export default class SessionCheckDto {
    /**
     * リクエスト情報
     */
    private request: express.Request = null;

    /**
     * 除外オペレータタイプ
     */
    private ignoreOperatorTypeList: Array<number> = null;

    /**
     * カタログサービスURL
     */
    private catalogUrl: string = null;

    /**
     * オペレータサービスURL
     */
    private operatorUrl: string = null;

    /**
     * message
     */
    private message: any = null;

    /**
     * リクエスト情報取得
     */
    public getRequest (): express.Request {
        return this.request;
    }

    /**
     * リクエスト情報設定
     * @param request
     */
    public setRequest (request: express.Request) {
        this.request = request;
    }

    /**
     * 除外オペレータタイプ取得
     */
    public getIgnoreOperatorTypeList (): number[] {
        return this.ignoreOperatorTypeList;
    }

    /**
     * 除外オペレータタイプ設定
     * @param ignoreOperatorTypeList
     */
    public setIgnoreOperatorTypeList (ignoreOperatorTypeList: number[]) {
        this.ignoreOperatorTypeList = ignoreOperatorTypeList;
    }

    /**
     * カタログサービスURL設定
     * @param catalogUrl
     */
    public setCatalogUrl (catalogUrl: string) {
        this.catalogUrl = catalogUrl;
    }

    /**
     * オペレータサービスURL取得
     */
    public getOperatorUrl (): string {
        return this.operatorUrl;
    }

    /**
     * オペレータサービスURL設定
     * @param operatorUrl
     */
    public setOperatorUrl (operatorUrl: string) {
        this.operatorUrl = operatorUrl;
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
}
