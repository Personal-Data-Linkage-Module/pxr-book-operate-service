/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */

/**
 * 通知サービスデータ
 */
export default class NotificationDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * セッションID
     */
    private sessionId: string = null;

    /**
     * 通知サービスURL
     */
    private url: string = null;

    /**
     * 通知タイプ
     */
    private type: number = null;

    /**
     * タイトル
     */
    private title: string = null;

    /**
     * コンテンツ
     */
    private content: string = null;

    /**
     * 属性
     */
    private attribute: any = null;

    /**
     * カテゴリコード
     */
    private categoryCode: number = null;

    /**
     * カテゴリバージョン
     */
    private categoryVersion: number = null;

    /**
     * 差出元APPのカタログ定義コード
     */
    private fromApplicationCode: number = null;

    /**
     * 差出元WFのカタログ定義コード
     */
    private fromWorkflowCode: number = null;

    /**
     * 宛先PXR-Blockのカタログ定義コード
     */
    private destinationBlockCode: number = null;

    /**
     * 宛先オペレータータイプ
     */
    private destinationOperatorType: number = null;

    /**
     * 全体送信フラグ
     */
    private destinationIsSendAll: boolean = false;

    /**
     * オペレーターID指定
     */
    private destinationOperatorId: number[] = null;

    /**
     * 利用者ID指定
     */
    private destinationUserId: string[] = null;

    /**
     * message
     */
    private message: any = null;

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
     * セッションID設定
     * @param sessionId
     */
    public setSessionId (sessionId: string) {
        this.sessionId = sessionId;
    }

    /**
     * 通知サービスURL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * 通知サービスURL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
    }

    /**
     * 通知タイプ取得
     */
    public getType (): number {
        return this.type;
    }

    /**
     * 通知タイプ設定
     * @param type
     */
    public setType (type: number) {
        this.type = type;
    }

    /**
     * タイトル取得
     */
    public getTitle (): string {
        return this.title;
    }

    /**
     * タイトル設定
     * @param title
     */
    public setTitle (title: string) {
        this.title = title;
    }

    /**
     * コンテンツ取得
     */
    public getContent (): string {
        return this.content;
    }

    /**
     * コンテンツ設定
     * @param content
     */
    public setContent (content: string) {
        this.content = content;
    }

    /**
     * 属性取得
     */
    public getAttribute (): any {
        return this.attribute;
    }

    /**
     * 属性設定
     * @param attribute
     */
    public setAttribute (attribute: any) {
        this.attribute = attribute;
    }

    /**
     * カテゴリコード取得
     */
    public getCategoryCode (): number {
        return this.categoryCode;
    }

    /**
     * カテゴリコード設定
     */
    public setCategoryCode (categoryCode: number): void {
        this.categoryCode = categoryCode;
    }

    /**
     * カテゴリバージョン取得
     */
    public getCategoryVersion (): number {
        return this.categoryVersion;
    }

    /**
     * カテゴリバージョン設定
     */
    public setCategoryVersion (categoryVersion: number): void {
        this.categoryVersion = categoryVersion;
    }

    /**
     * 差出元APPのカタログ定義コード取得
     */
    public getFromApplicationCode (): number {
        return this.fromApplicationCode;
    }

    /**
     * 差出元APPのカタログ定義コード設定
     * @param fromApplicationCode
     */
    public setFromApplicationCode (fromApplicationCode: number) {
        this.fromApplicationCode = fromApplicationCode;
    }

    /**
     * 差出元WFのカタログ定義コード取得
     */
    public getFromWorkflowCode (): number {
        return this.fromWorkflowCode;
    }

    /**
     * 差出元WFのカタログ定義コード設定
     * @param fromWorkflowCode
     */
    public setFromWorkflowCode (fromWorkflowCode: number) {
        this.fromWorkflowCode = fromWorkflowCode;
    }

    /**
     * 宛先PXR-Blockのカタログ定義コード取得
     */
    public getDestinationBlockCode (): number {
        return this.destinationBlockCode;
    }

    /**
     * 宛先PXR-Blockのカタログ定義コード設定
     * @param destinationBlockCode
     */
    public setDestinationBlockCode (destinationBlockCode: number) {
        this.destinationBlockCode = destinationBlockCode;
    }

    /**
     * 宛先オペレータータイプ取得
     */
    public getDestinationOperatorType (): number {
        return this.destinationOperatorType;
    }

    /**
     * 宛先オペレータータイプ設定
     * @param destinationOperatorType
     */
    public setDestinationOperatorType (destinationOperatorType: number) {
        this.destinationOperatorType = destinationOperatorType;
    }

    /**
     * 全体送信フラグ取得
     */
    public getDestinationIsSendAll (): boolean {
        return this.destinationIsSendAll;
    }

    /**
     * 全体送信フラグ設定
     * @param destinationIsSendAll
     */
    public setDestinationIsSendAll (destinationIsSendAll: boolean) {
        this.destinationIsSendAll = destinationIsSendAll;
    }

    /**
     * オペレーターID指定取得
     */
    public getDestinationOperatorId (): number[] {
        return this.destinationOperatorId;
    }

    /**
     * オペレーターID指定設定
     * @param destinationOperatorId
     */
    public setDestinationOperatorId (destinationOperatorId: number[]) {
        this.destinationOperatorId = destinationOperatorId;
    }

    /**
     * 利用者ID指定取得
     */
    public getDestinationUserId (): string[] {
        return this.destinationUserId;
    }

    /**
     * 利用者ID指定設定
     * @param destinationUserId
     */
    public setDestinationUserId (destinationUserId: string[]) {
        this.destinationUserId = destinationUserId;
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
}
