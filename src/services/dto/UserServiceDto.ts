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
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
import UserInformationDto from '../../resources/dto/UserInformationDto';
/* eslint-enable */

// SDE-IMPL-REQUIRED 本ファイルをコピーしてサービスレイヤーのDTOを実装します。

export default class UserServiceDto {
    /**
     * bookManageUrl
     */
    private bookManageUrl: string = null;

    /**
     * notificationUrl
     */
    private notificationUrl: string = null;

    /**
     * operatorUrl
     */
    private operatorUrl: string = null;

    /**
     * app
     */
    private app: any = null;

    /**
     * wf
     */
    private wf: any = null;

    /**
     * region
     */
    private region: any = null;

    /**
     * identifyCode
     */
    private identifyCode: string = null;

    /**
     * attributes
     */
    private attributes: any = null;

    /**
     * userIdList
     */
    private userIdList: string[] = null;

    /**
     * establishAtStart
     */
    private establishAtStart: Date = null;

    /**
     * establishAtEnd
     */
    private establishAtEnd: Date = null;

    /**
     * includeRequest
     */
    private includeRequest: boolean = false;

    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * 物理削除フラグ
     */
    private physicalDelete: boolean;

    /**
     * message
     */
    private message: any = null;

    userInfo: UserInformationDto | undefined;

    /**
     * bookManageUrl取得
     */
    public getBookManageUrl (): string {
        return this.bookManageUrl;
    }

    /**
     * bookManageUrl設定
     */
    public setBookManageUrl (bookManageUrl: string) {
        this.bookManageUrl = bookManageUrl;
    }

    /**
     * notificationUrl取得
     */
    public getNotificationUrl (): string {
        return this.notificationUrl;
    }

    /**
     * notificationUrl設定
     */
    public setNotificationUrl (notificationUrl: string) {
        this.notificationUrl = notificationUrl;
    }

    /**
     * operatorUrl取得
     */
    public getOperatorUrl (): string {
        return this.operatorUrl;
    }

    /**
     * operatorUrl設定
     */
    public setOperatorUrl (operatorUrl: string) {
        this.operatorUrl = operatorUrl;
    }

    /**
     * app取得
     */
    public getApp () {
        return this.app;
    }

    /**
     * app設定
     */
    public setApp (app: any) {
        this.app = app;
    }

    /**
     * wf取得
     */
    public getWf () {
        return this.wf;
    }

    /**
     * wf設定
     */
    public setWf (wf: any) {
        this.wf = wf;
    }

    /**
     * region取得
     */
    public getRegion () {
        return this.region;
    }

    /**
     * region設定
     */
    public setRegion (region: any) {
        this.region = region;
    }

    /**
     * IdentifyCode取得
     */
    public getIdentifyCode (): string {
        return this.identifyCode;
    }

    /**
     * IdentifyCode設定
     * @param identifyCode
     */
    public setIdentifyCode (identifyCode: string) {
        this.identifyCode = identifyCode;
    }

    /**
     * attributes取得
     */
    public getAttributes (): any {
        return this.attributes;
    }

    /**
     * attributes設定
     * @param attributes
     */
    public setAttributes (attributes: any) {
        this.attributes = attributes;
    }

    /**
     * UserIdList取得
     */
    public getUserIdList (): string[] {
        return this.userIdList;
    }

    /**
     * UserIdList設定
     */
    public setUserIdList (userIdList: string[]): void {
        this.userIdList = userIdList;
    }

    /**
     * establishAtStart取得
     */
    public getEstablishAtStart (): Date {
        return this.establishAtStart;
    }

    /**
     * establishAtStart設定
     */
    public setEstablishAtStart (establishAtStart: Date): void {
        this.establishAtStart = establishAtStart;
    }

    /**
     * establishAtEnd取得
     */
    public getEstablishAtEnd (): Date {
        return this.establishAtEnd;
    }

    /**
     * establishAtEnd設定
     */
    public setEstablishAtEnd (establishAtEnd: Date): void {
        this.establishAtEnd = establishAtEnd;
    }

    /**
     * includeRequest取得
     */
    public getIncludeRequest (): boolean {
        return this.includeRequest;
    }

    /**
     * includeRequest設定
     */
    public setIncludeRequest (includeRequest: boolean): void {
        this.includeRequest = includeRequest;
    }

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
     * physicalDelete
     */
    public getPhysicalDelete (): boolean {
        return this.physicalDelete;
    }

    /**
     * physicalDelete
     * @param physicalDelete
     */
    public setPhysicalDelete (physicalDelete: boolean) {
        this.physicalDelete = physicalDelete;
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
