/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 *
 *
 *
 * $Date$
 * $Revision$
 * $Author$
 *
 * TEMPLATE VERSION :  76463
 */
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

// SDE-IMPL-REQUIRED 本ファイルをコピーしてサービスレイヤーのDTOを実装します。

export default class ThingServiceDto {
    /**
     * 利用者ID
     */
    private userId: string = null;

    /**
     * イベント識別子
     */
    private eventIdentifer: string = null;

    /**
     * モノ識別子
     */
    private thingIdentifer: string = null;

    /**
     * ソースID
     */
    private sourceId: string = null;

    /**
     * リクエストオブジェクト
     */
    private requestObject: {} = null;

    /**
     * 一括リクエストオブジェクト
     */
    private requestBulkObject: {}[] = null;

    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * カタログサービスURL
     */
    private catalogUrl: string = null;

    /**
     * Local-CTokenサービスURL
     */
    private ctokenUrl: string = null;

    /**
     * message
     */
    private message: any = null;

    /**
     * 利用者ID取得
     */
    public getUserId (): string {
        return this.userId;
    }

    /**
     * 利用者ID設定
     * @param userId
     */
    public setUserId (userId: string) {
        this.userId = userId;
    }

    /**
     * イベント識別子取得
     */
    public getEventIdentifer (): string {
        return this.eventIdentifer;
    }

    /**
     * イベント識別子設定
     * @param eventIdentifer
     */
    public setEventIdentifer (eventIdentifer: string) {
        this.eventIdentifer = eventIdentifer;
    }

    /**
     * モノ識別子取得
     */
    public getThingIdentifer (): string {
        return this.thingIdentifer;
    }

    /**
     * モノ識別子設定
     * @param thingIdentifer
     */
    public setThingIdentifer (thingIdentifer: string) {
        this.thingIdentifer = thingIdentifer;
    }

    /**
     * ソースID取得
     */
    public getSourceId (): string {
        return this.sourceId;
    }

    /**
     * ソースID設定
     * @param sourceId
     */
    public setSourceId (sourceId: string) {
        this.sourceId = sourceId;
    }

    /**
     * リクエストオブジェクト
     */
    public getRequestObject (): {} {
        return this.requestObject;
    }

    /**
     * リクエストオブジェクト
     * @param requestObject
     */
    public setRequestObject (requestObject: {}) {
        this.requestObject = requestObject;
    }

    /**
     * 一括リクエストオブジェクト
     */
    public getRequestBulkObject (): {}[] {
        return this.requestBulkObject;
    }

    /**
     * 一括リクエストオブジェクト
     * @param requestBulkObject
     */
    public setRequestBulkObject (requestBulkObject: {}[]) {
        this.requestBulkObject = requestBulkObject;
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
     * カタログサービスURL取得
     */
    public getCatalogUrl (): string {
        return this.catalogUrl;
    }

    /**
     * カタログサービスURL設定
     * @param catalogUrl
     */
    public setCatalogUrl (catalogUrl: string) {
        this.catalogUrl = catalogUrl;
    }

    /**
     * Local-CTokenサービスURL取得
     */
    public getCTokenUrl (): string {
        return this.ctokenUrl;
    }

    /**
     * Local-CTokenサービスURL設定
     * @param ctokenUrl
     */
    public setCTokenUrl (ctokenUrl: string) {
        this.ctokenUrl = ctokenUrl;
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
