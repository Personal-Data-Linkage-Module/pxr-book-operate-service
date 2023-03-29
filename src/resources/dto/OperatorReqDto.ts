/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 * オペレータ情報
 */
export default class Operator {
    /**
     * セッションID
     */
    private sessionId: string = null;

    /**
     * セッションキー
     */
    private sessionKey: string = null;

    /**
     * オペレータID
     */
    private operatorId: number = null;

    /**
     * オペレータタイプ
     */
    private type: number = null;

    /**
     * ログインID
     */
    private loginId: string = null;

    /**
     * 名前
     */
    private name: string = null;

    /**
     * 携帯番号
     */
    private mobilePhone: string = null;

    /**
     * 権限
     */
    private auth: object = null;

    /**
     * ロール
     */
    private roles: object = null;

    /**
     * ブロックコード
     */
    private blockCode: number = null;

    /**
     * ブロックバージョン
     */
    private blockVersion: number = null;

    /**
     * アクターコード
     */
    private actorCode: number = null;

    /**
     * アクターバージョン
     */
    private actorVersion: number = null;

    /**
     * ブロックコードカタログ形式
     */
    private block: {} = null;

    /**
     * ブロックコードカタログ形式
     */
    private actor: {} = null;

    /**
     * PXR-ID
     */
    private pxrId: string = '';

    /**
     * エンコード済みのデータ
     */
    private encodeData: string = '';

    /**
     * セッションID取得
     */
    public getSessionId (): string {
        return this.sessionId;
    }

    /**
     * セッションID設定
     * @param sessionId
     */
    public setSessionId (sessionId: string) {
        this.sessionId = sessionId;
    }

    /**
     * セッションID設定
     * @param sessionKey
     */
    public setSessionKey (sessionKey: string) {
        this.sessionKey = sessionKey;
    }

    /**
     * オペレータタイプ取得
     */
    public getType (): number {
        return this.type;
    }

    /**
     * ログインID取得
     */
    public getLoginId (): string {
        return this.loginId;
    }

    /**
     * blockコード取得
     */
    public getBlockCode (): number {
        return this.blockCode;
    }

    /**
     * blockバージョン取得
     */
    public getBlockVersion (): number {
        return this.blockVersion;
    }

    /**
     * actorコード取得
     */
    public getActorCode (): number {
        return this.actorCode;
    }

    /**
     * actorバージョン取得
     */
    public getActorVersion (): number {
        return this.actorVersion;
    }

    /**
     * エンコード済みデータ設定
     * @param _encodeData
     */
    public setEncodeData (_encodeData: string) {
        this.encodeData = _encodeData;
    }

    /**
     * エンコード済みデータ取得
     */
    public getEncodeData (): string {
        return this.encodeData;
    }

    /**
     * データ構造設定(JSON用連想配列)
     * @param obj
     */
    public setFromJson (obj: {}): void {
        this.sessionId = obj['sessionId'];
        this.operatorId = Number(obj['operatorId']);
        this.type = obj['type'] ? Number(obj['type']) : 0;
        this.loginId = obj['loginId'];
        this.name = obj['name'];
        this.mobilePhone = obj['mobilePhone'];
        this.auth = obj['auth'];
        this.roles = obj['roles'];
        this.pxrId = obj['pxrId'];
        this.blockCode = Number(obj['block']['_value']);
        this.blockVersion = Number(obj['block']['_ver']);
        this.block = {
            _value: Number(obj['block']['_value']),
            _ver: Number(obj['block']['_ver'])
        };
        if (obj['actor']) {
            this.actorCode = Number(obj['actor']['_value']);
            this.actorVersion = Number(obj['actor']['_ver']);
            this.actor = {
                _value: Number(obj['actor']['_value']),
                _ver: Number(obj['actor']['_ver'])
            };
        }
        this.encodeData = encodeURIComponent(JSON.stringify(obj));
    }
}
