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

// SDE-IMPL-REQUIRED 本ファイルをコピーしコントローラーに定義した各 REST API のリクエスト・レスポンスごとにDTOを作成します。

// import { IsUUID, IsString, IsNumber, IsDateString } from 'class-validator';
/**
 * モノ更新(PUT)リクエストモデル
 */
export default class PutThingByUserIdByEventIdReqDto {
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
     * モノソースID
     */
    private thingSourceId: string = null;

    /**
     * リクエストオブジェクト
     */
    private requestObject: {} = null;

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
     * モノソースID取得
     */
    public getThingSourceId (): string {
        return this.thingSourceId;
    }

    /**
     * モノソースID設定
     * @param thingSourceId
     */
    public setThingSourceId (thingSourceId: string) {
        this.thingSourceId = thingSourceId;
    }

    /**
     * リクエストオブジェクト
     */
    public getRequestObject (): {} {
        return this.requestObject;
    }

    /**
     * データ構造設定(JSON用連想配列)
     * @param obj
     */
    public setFromJson (obj: {}): void {
        this.requestObject = obj;
    }
}
