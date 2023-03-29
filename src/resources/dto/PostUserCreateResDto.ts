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
import Config from '../../common/Config';
import { transformFromDateTimeToString } from '../../common/Transform';
const config = Config.ReadConfig('./config/config.json');

export default class PostUserResDto {
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
     * 利用者ID
     */
    public userId: string = null;

    /**
     * 開設日時
     */
    public openStartAt: Date = null;

    /**
     * attributes
     */
    public attributes: any = null;

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const resJson = {
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
            } : undefined,
            userId: this.userId,
            establishAt: transformFromDateTimeToString(config['timezone'], this.openStartAt),
            attributes: this.attributes
        };
        return resJson;
    }
}
