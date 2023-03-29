/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

/**
 * カタログサービスデータ
 */
export default class CatalogDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * カタログサービスURL
     */
    private url: string = null;

    /**
     * 拡張名称
     */
    private extName: string = null;

    /**
     * NS
     */
    private ns: string = null;

    /**
     * カタログコード
     */
    private code: number = null;

    /**
     * カタログバージョン
     */
    private version: number = null;

    /**
     * message
     */
    private message: any = null;

    /**
     * body
     */
    private body: any = null;

    /**
     * オペレータ情報取得
     */
    public getOperator (): Operator {
        return this.operator;
    }

    /**
     * オペレータ情報設定
     * @param operator
     */
    public setOperator (operator: Operator) {
        this.operator = operator;
    }

    /**
     * カタログサービスURL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * カタログサービスURL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
    }

    /**
     * NS取得
     */
    public getNs (): string {
        return this.ns;
    }

    /**
     * NS設定
     * @param ns
     */
    public setNs (ns: string) {
        this.ns = ns;
    }

    /**
     * コード取得
     */
    public getCode (): number {
        return this.code;
    }

    /**
     * コード設定
     * @param code
     */
    public setCode (code: number) {
        this.code = code;
    }

    /**
     * カタログバージョン取得
     */
    public getVersion (): number {
        return this.version;
    }

    /**
     * カタログバージョン設定
     * @param version
     */
    public setVersion (version: number) {
        this.version = version;
    }

    /**
     * message
     */
    public getMessage (): any {
        return this.message;
    }

    /**
     * message
     * @param message
     */
    public setMessage (message: any) {
        this.message = message;
    }

    /**
     * body
     */
    public getBody (): any {
        return this.body;
    }

    /**
     * body
     * @param body
     */
    public setBody (body: any) {
        this.body = body;
    }
}
