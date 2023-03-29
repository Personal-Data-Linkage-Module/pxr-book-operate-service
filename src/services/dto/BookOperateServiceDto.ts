/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { DateStartEndObject, CodeVersionObject, CodeObject } from '../../resources/dto/PostGetBookReqDto';
import Config from '../../common/Config';
import Operator from '../../resources/dto/OperatorReqDto';
/* eslint-enable */
import moment = require('moment-timezone');
const configure = Config.ReadConfig('./config/config.json');

/**
 * BOOKデータ
 */
export default class BookOperateServiceDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

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
     * ドキュメント
     */
    private document: CodeVersionObject[] = null;

    /**
     * イベント
     */
    private event: CodeVersionObject[] = null;

    /**
     * モノ
     */
    private thing: CodeVersionObject[] = null;

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const codeList: {}[] = [];
        if (this._code) {
            for (const code of this._code) {
                codeList.push({
                    _value: code._value ? code._value : null,
                    _ver: code._ver ? code._ver : null
                });
            }
        }
        const document: {}[] = [];
        if (this.document) {
            for (const doc of this.document) {
                document.push({
                    _value: doc._value ? doc._value : null,
                    _ver: doc._ver ? doc._ver : null
                });
            }
        }
        const event: {}[] = [];
        if (this.event) {
            for (const eve of this.event) {
                event.push({
                    _value: eve._value ? eve._value : null,
                    _ver: eve._ver ? eve._ver : null
                });
            }
        }
        const thing: {}[] = [];
        if (this.thing) {
            for (const thg of this.thing) {
                thing.push({
                    _value: thg._value ? thg._value : null,
                    _ver: thg._ver ? thg._ver : null
                });
            }
        }
        return {
            userId: this.userId,
            type: this.type,
            identifier: this.identifier && this.identifier.length > 0 ? this.identifier : null,
            updatedAt: this.updatedAt ? {
                start: this.updatedAt.start ? moment(this.updatedAt.start).tz(configure['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null,
                end: this.updatedAt.end ? moment(this.updatedAt.end).tz(configure['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null
            } : null,
            _code: codeList.length > 0 ? codeList : null,
            app: this.app ? {
                _value: this.app._value
            } : null,
            wf: this.wf ? {
                _value: this.wf._value
            } : null,
            document: document.length > 0 ? document : null,
            event: event.length > 0 ? event : null,
            thing: thing.length > 0 ? thing : null
        };
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

    /**
     * ドキュメント取得
     */
    public getDocument (): CodeVersionObject[] {
        return this.document;
    }

    /**
     * ドキュメント設定
     * @param document
     */
    public setDocument (document: CodeVersionObject[]) {
        this.document = document;
    }

    /**
     * イベント取得
     */
    public getEvent (): CodeVersionObject[] {
        return this.event;
    }

    /**
     * イベント設定
     * @param event
     */
    public setEvent (event: CodeVersionObject[]) {
        this.event = event;
    }

    /**
     * モノ取得
     */
    public getThing (): CodeVersionObject[] {
        return this.thing;
    }

    /**
     * モノ設定
     * @param thing
     */
    public setThing (thing: CodeVersionObject[]) {
        this.thing = thing;
    }
}
