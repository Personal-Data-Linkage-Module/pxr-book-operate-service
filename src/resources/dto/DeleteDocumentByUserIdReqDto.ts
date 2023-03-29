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
 * ドキュメント削除(DELETE)リクエストモデル
 */
export default class DeleteDocumentByUserIdReqDto {
    /**
     * 利用者ID
     */
    private userId: string = null;

    /**
     * ドキュメント識別子
     */
    private documentIdentifer: string = null;

    /**
     * ドキュメントソースID
     */
    private documentSourceId: string = null;

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
     * ドキュメント識別子取得
     */
    public getDocumentIdentifer (): string {
        return this.documentIdentifer;
    }

    /**
     * ドキュメント識別子設定
     * @param documentIdentifer
     */
    public setDocumentIdentifer (documentIdentifer: string) {
        this.documentIdentifer = documentIdentifer;
    }

    /**
     * ドキュメントソースID取得
     */
    public getDocumentSourceId (): string {
        return this.documentSourceId;
    }

    /**
     * ドキュメントソースID設定
     * @param documentSourceId
     */
    public setDocumentSourceId (documentSourceId: string) {
        this.documentSourceId = documentSourceId;
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
