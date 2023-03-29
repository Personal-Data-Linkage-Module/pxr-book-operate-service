/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
/* eslint-enable */

/**
 * データ蓄積定義取得
 */
export default class BookManageSettingStoreDomain {
    /**
     * Id
     */
    public Id: number = null;

    /**
     * bookId
     */
    public bookId: number = null;

    /**
     * regionUseId
     */
    public regionUseId: number = null;

    /**
     * type
     */
    public type: string = null;

    /**
     * actorCode
     */
    public actorCode: number = null;

    /**
     * actorVersion
     */
    public actorVersion: number = null;

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
     * document
     */
    public document: Array<any> = null;

    /**
     * event
     */
    public event: Array<any> = null;

    /**
     * thing
     */
    public thing: Array<any> = null;

    /**
     * userId
     */
    public userId: string = null;

    /**
     * openStartAt
     */
    public openStartAt: Date = null;

    /**
     * attribute
     */
    public attribute: any = null;

    /**
     * status
     */
    public status: number = null;

    /**
     * identifyCode
     */
    public identifyCode: string = null;

    /**
     * データ構造設定(JSON用連想配列)
     * @param obj
     */
    public setFromJson (obj?: {}): void {
        if (obj) {
            this.Id = obj['id'];
            this.bookId = obj['bookId'];
            this.regionUseId = obj['regionUseId'];
            this.type = obj['type'];
            this.actorCode = obj['actor']['_value'];
            this.actorVersion = obj['actor']['_ver'];
            if (obj['app']) {
                this.appCode = obj['app']['_value'];
                this.appVersion = obj['app']['_ver'];
            }
            if (obj['wf']) {
                this.wfCode = null;
                this.wfVersion = null;
            }
            this.document = obj['document'];
            this.event = obj['event'];
            this.thing = obj['thing'];
            this.status = obj['status'];
            this.identifyCode = obj['identifyCode'];
        }
    }
}
