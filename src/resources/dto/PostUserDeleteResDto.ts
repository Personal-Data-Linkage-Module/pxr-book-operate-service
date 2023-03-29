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

export default class PostUserDeleteResDto {
    /**
     * ユーザID
     */
    public userId: string = null;

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const resJson = {
            userId: this.userId
        };
        return resJson;
    }
}
