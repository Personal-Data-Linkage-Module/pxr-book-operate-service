/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

/**
 * My-Condition-Book管理サービスデータ
 */
export default class BookManageDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * ユーザID
     */
    private userId: string = null;

    /**
     * My-Condition-Book管理サービスURL
     */
    private url: string = null;

    /**
     * identifyCode
     */
    private identifyCode: string = null;

    /**
     * message
     */
    private message: any = null;

    /**
     * 一時的データ共有コード
     */
    private tempShareCode: string = null;

    /**
     * アクターカタログコード
     */
    private actor: number = null;

    /**
     * ワークフローカタログコード
     */
    private workflow: number = null;

    /**
     * アプリケーションカタログコード
     */
    private application: number = null;

    /**
     * データ取得フラグ
     */
    private isGetData: boolean = false;

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
     * ユーザID取得
     */
    public getUserId (): string {
        return this.userId;
    }

    /**
     * ユーザID設定
     * @param userId
     */
    public setUserId (userId: string) {
        this.userId = userId;
    }

    /**
     * My-Condition-Book管理サービスURL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * My-Condition-Book管理サービスURL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
    }

    /**
     * identifyCode取得
     */
    public getIdentifyCode (): string {
        return this.identifyCode;
    }

    /**
     * identifyCode設定
     */
    public setIdentifyCode (identifyCode: string) {
        this.identifyCode = identifyCode;
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
     * tempShareCode
     */
    public getTempShareCode (): string {
        return this.tempShareCode;
    }

    /**
     * tempShareCode
     * @param tempShareCode
     */
    public setTempShareCode (tempShareCode: string) {
        this.tempShareCode = tempShareCode;
    }

    /**
     * アクターカタログコード取得
     */
    public getActor (): number {
        return this.actor;
    }

    /**
     * アクターカタログコード設定
     * @param actor
     */
    public setActor (actor: number) {
        this.actor = actor;
    }

    /**
     * ワークフローカタログコード取得
     */
    public getWorkflow (): number {
        return this.workflow;
    }

    /**
     * ワークフローカタログコード設定
     * @param workflow
     */
    public setWorkflow (workflow: number) {
        this.workflow = workflow;
    }

    /**
     * アプリケーションカタログコード取得
     */
    public getApplication (): number {
        return this.application;
    }

    /**
     * アプリケーションカタログコード設定
     * @param application
     */
    public setApplication (application: number) {
        this.application = application;
    }

    /**
     * データ取得フラグ取得
     */
    public getIsGetData (): boolean {
        return this.isGetData;
    }

    /**
     * データ取得フラグ設定
     * @param isGetData
     */
    public setIsGetData (isGetData: boolean) {
        this.isGetData = isGetData;
    }
}
