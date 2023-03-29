/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
import { DateStartEndObject, CodeVersionObject, CodeObject } from '../../resources/dto/PostShareSearchReqDto';
/* eslint-enable */

/**
 * 共有データ
 */
export default class ShareDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * ユーザID
     */
    private userId: string = null;

    /**
     * 一時的データ共有APIコード
     */
    private tempShareCode: string = null;

    /**
     * 識別子
     */
    private identifier: string[] = null;

    /**
     * ログ識別子
     */
    private logIdentifier: string = null;

    /**
     * 更新日時オブジェクト
     */
    private updatedAt: DateStartEndObject = null;

    /**
     * ワークフローオブジェクト
     */
    private wf: CodeObject = null;

    /**
     * アプリケーションオブジェクト
     */
    private app: CodeObject = null;

    /**
     * ドキュメントリスト
     */
    private documentList: CodeVersionObject[] = null;

    /**
     * イベントリスト
     */
    private eventList: CodeVersionObject[] = null;

    /**
     * モノリスト
     */
    private thingList: CodeVersionObject[] = null;

    /**
     * 共有定義カタログコード
     */
    private shareDefinitionCatalogCode: number = null;

    /**
     * 共有定義カタログバージョン
     */
    private shareDefinitionCatalogVersion: number = null;

    /**
     * 共有終了方法
     */
    private endMethod: number = null;

    /**
     * アクターコード
     */
    private actorCode: number = null;

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
     * 一時的データ共有APIコード取得
     */
    public getTempShareCode (): string {
        return this.tempShareCode;
    }

    /**
     * 一時的データ共有APIコード設定
     * @param tempShareCode
     */
    public setTempShareCode (tempShareCode: string) {
        this.tempShareCode = tempShareCode;
    }

    /**
     * 識別子取得
     */
    public getIdentifier (): string[] {
        return this.identifier;
    }

    /**
     * 識別子設定
     * @param identifier
     */
    public setIdentifier (identifier: string[]) {
        this.identifier = identifier;
    }

    /**
     * ログ識別子取得
     */
    public getLogIdentifier (): string {
        return this.logIdentifier;
    }

    /**
     * ログ識別子設定
     * @param identifier
     */
    public setLogIdentifier (logIdentifier: string) {
        this.logIdentifier = logIdentifier;
    }

    /**
     * 更新日時オブジェクト取得
     */
    public getUpdatedAt (): DateStartEndObject {
        return this.updatedAt;
    }

    /**
     * 更新日時オブジェクト設定
     * @param updatedAt
     */
    public setUpdatedAt (updatedAt: DateStartEndObject) {
        this.updatedAt = updatedAt;
    }

    /**
     * ワークフローオブジェクト取得
     */
    public getWf (): CodeObject {
        return this.wf;
    }

    /**
     * ワークフローオブジェクト設定
     * @param wf
     */
    public setWf (wf: CodeObject) {
        this.wf = wf;
    }

    /**
     * アプリケーションオブジェクト取得
     */
    public getApp (): CodeObject {
        return this.app;
    }

    /**
     * アプリケーションオブジェクト設定
     * @param app
     */
    public setApp (app: CodeObject) {
        this.app = app;
    }

    /**
     * ドキュメントリスト取得
     */
    public getDocumentList (): CodeVersionObject[] {
        return this.documentList;
    }

    /**
     * ドキュメントリスト設定
     * @param documentList
     */
    public setDocumentList (documentList: CodeVersionObject[]) {
        this.documentList = documentList;
    }

    /**
     * イベントリスト取得
     */
    public getEventList (): CodeVersionObject[] {
        return this.eventList;
    }

    /**
     * イベントリスト設定
     * @param eventList
     */
    public setEventList (eventList: CodeVersionObject[]) {
        this.eventList = eventList;
    }

    /**
     * モノリスト取得
     */
    public getThingList (): CodeVersionObject[] {
        return this.thingList;
    }

    /**
     * モノリスト設定
     * @param thingList
     */
    public setThingList (thingList: CodeVersionObject[]) {
        this.thingList = thingList;
    }

    /**
     * 共有定義カタログコード取得
     */
    public getShareDefinitionCatalogCode (): number {
        return this.shareDefinitionCatalogCode;
    }

    /**
     * 共有定義カタログコード設定
     * @param userId
     */
    public setShareDefinitionCatalogCode (shareDefinitionCatalogCode: number) {
        this.shareDefinitionCatalogCode = shareDefinitionCatalogCode;
    }

    /**
     * 共有定義カタログバージョン取得
     */
    public getShareDefinitionCatalogVersion (): number {
        return this.shareDefinitionCatalogVersion;
    }

    /**
     * 共有定義カタログバージョン設定
     * @param shareDefinitionCatalogVersion
     */
    public setShareDefinitionCatalogVersion (shareDefinitionCatalogVersion: number) {
        this.shareDefinitionCatalogVersion = shareDefinitionCatalogVersion;
    }

    /**
     * 共有終了方法取得
     */
    public getEndMethod (): number {
        return this.endMethod;
    }

    /**
     * 共有終了方法設定
     * @param endMethod
     */
    public setEndMethod (endMethod: number) {
        this.endMethod = endMethod;
    }

    /**
     * アクターコード取得
     */
    public getActorCode (): number {
        return this.actorCode;
    }

    /**
     * アクターコード設定
     * @param actorCode
     */
    public setActorCode (actorCode: number) {
        this.actorCode = actorCode;
    }
}
