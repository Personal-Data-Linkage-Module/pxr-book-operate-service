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

export default class PostShareSearchResDto {
    /**
     * ドキュメントリスト
     */
    public documentList: {}[] = [];

    /**
     * イベントリスト
     */
    public eventList: {}[] = [];

    /**
     * モノリスト
     */
    public thingList: {}[] = [];

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        return {
            document: this.documentList.length > 0 ? this.documentList : null,
            event: this.eventList.length > 0 ? this.eventList : null,
            thing: this.thingList.length > 0 ? this.thingList : null
        };
    }

    /**
     * データ構造設定(JSON用連想配列)
     * @param obj
     */
    public setFromJson (obj: {}): void {
        if (obj) {
            this.documentList = obj['document'];
            this.eventList = obj['event'];
            this.thingList = obj['thing'];
        }
    }
}
