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

export default class PostShareByTempShareCodeResDto {
    /**
     * レスポンスオブジェクト
     */
    public responseObject: {}[] = null;

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {}[] {
        return this.responseObject;
    }

    /**
     * データ構造設定(JSON用連想配列)
     * @param obj
     */
    public setFromJson (obj: {}[]): void {
        this.responseObject = obj;
    }
}
