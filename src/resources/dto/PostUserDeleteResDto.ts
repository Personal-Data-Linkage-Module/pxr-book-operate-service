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
     * actorCode
     */
    public actorCode: number = null;

    /**
     * actorVersion
     */
    public actorVersion: number = null;

    /**
     * regionCode
     */
    public regionCode: number = null;

    /**
     * regionVersion
     */
    public regionVersion: number = null;

    /**
     * appCode
     */
    public appCode: number = null;

    /**
     * appVersion
     */
    public appVersion: number = null;

    /**
     * wfCode
     */
    public wfCode: number = null;

    /**
     * wfVersion
     */
    public wfVersion: number = null;

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const resJson = {
            userId: this.userId,
            actor: {
                _value: this.actorCode,
                _ver: this.actorVersion
            },
            region: this.regionCode ? {
                _value: this.regionCode,
                _ver: this.regionVersion
            } : undefined,
            app: this.appCode ? {
                _value: this.appCode,
                _ver: this.appVersion
            } : undefined,
            wf: this.wfCode ? {
                _value: this.wfCode,
                _ver: this.wfVersion
            } : undefined
        };
        return resJson;
    }
}
