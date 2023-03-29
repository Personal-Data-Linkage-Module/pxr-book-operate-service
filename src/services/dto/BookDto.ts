/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { DateStartEndObject, CodeVersionObject, CodeObject } from '../../resources/dto/PostGetBookReqDto';
/* eslint-enable */

/**
 * BOOKデータ
 */
export default class BookDto {
    /**
     * ユーザID
     */
    private userId: string = null;

    /**
     * タイプ
     */
    private type: string = null;

    /**
     * 識別子
     */
    private identifier: string[] = null;

    /**
     * 更新日時オブジェクト
     */
    private updatedAt: DateStartEndObject = null;

    /**
     * コードオブジェクト
     */
    private _code: CodeVersionObject[] = null;

    /**
     * ワークフローオブジェクト
     */
    private wf: CodeObject = null;

    /**
     * アプリケーションオブジェクト
     */
    private app: CodeObject = null;

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
     * タイプ取得
     */
    public getType (): string {
        return this.type;
    }

    /**
     * タイプ設定
     * @param type
     */
    public setType (type: string) {
        this.type = type;
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
     * コードオブジェクト取得
     */
    public getCode (): CodeVersionObject[] {
        return this._code;
    }

    /**
     * コードオブジェクト設定
     * @param _code
     */
    public setCode (_code: CodeVersionObject[]) {
        this._code = _code;
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
}
