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
/**
 * モノ一括追加(POST)レスポンスモデル
 */
export default class PostThingBulkByUserIdByEventIdReqDto {
    /**
     * 利用者ID
     */
    private userId: string = null;

    /**
     * イベントID
     */
    private eventId: string = null;

    /**
     * リクエストオブジェクト
     */
    private requestObject: {} = null;
}
