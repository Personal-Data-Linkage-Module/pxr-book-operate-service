/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import Operator from '../../resources/dto/OperatorReqDto';
import CmatrixEvent from '../../repositories/postgres/CmatrixEvent';
import CmatrixThing from '../../repositories/postgres/CmatrixThing';
import Cmatrix2n from '../../repositories/postgres/Cmatrix2n';
/* eslint-enable */

/**
 * Local-CTokenサービスデータ
 */
export default class CTokenDto {
    /**
     * オペレータ情報
     */
    private operator: Operator = null;

    /**
     * Local-CTokenサービスURL
     */
    private url: string = null;

    /**
     * メッセージ
     */
    private message: any = null;

    /**
     * 利用者ID
     */
    private userId: string = null;

    /**
     * ドキュメント識別子リスト
     */
    private docIdentifierList: string[] = [];

    /**
     * CMatrix2(n)リスト
     */
    private cmatrix2nList: Cmatrix2n[] = [];

    /**
     * CMatrixイベントリスト
     */
    private cmatrixEventList: CmatrixEvent[] = [];

    /**
     * CMatrixモノリスト
     */
    private cmatrixThingList: CmatrixThing[] = [];

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
     * Local-CTokenサービスURL取得
     */
    public getUrl (): string {
        return this.url;
    }

    /**
     * Local-CTokenサービスURL設定
     * @param url
     */
    public setUrl (url: string) {
        this.url = url;
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
     * 利用者ID取得
     */
    public getUserId (): string {
        return this.userId;
    }

    /**
     * 利用者ID設定
     * @param userId
     */
    public setUserId (userId: string) {
        this.userId = userId;
    }

    /**
     * ドキュメント識別子リスト取得
     */
    public getDocIdentifierList (): string[] {
        return this.docIdentifierList;
    }

    /**
     * ドキュメント識別子リスト設定
     * @param docIdentifierList
     */
    public setDocIdentifierList (docIdentifierList: string[]) {
        this.docIdentifierList = docIdentifierList;
    }

    /**
     * CMatrix2(n)リスト取得
     */
    public getCmatrix2nList (): Cmatrix2n[] {
        return this.cmatrix2nList;
    }

    /**
     * CMatrix2(n)リスト設定
     * @param cmatrix2nList
     */
    public setCmatrix2nList (cmatrix2nList: Cmatrix2n[]) {
        this.cmatrix2nList = cmatrix2nList;
    }

    /**
     * CMatrixイベントリスト取得
     */
    public getCmatrixEventList (): CmatrixEvent[] {
        return this.cmatrixEventList;
    }

    /**
     * CMatrixイベントリスト設定
     * @param cmatrixEventList
     */
    public setCmatrixEventList (cmatrixEventList: CmatrixEvent[]) {
        this.cmatrixEventList = cmatrixEventList;
    }

    /**
     * CMatrixモノイベントリスト取得
     */
    public getCmatrixThingList (): CmatrixThing[] {
        return this.cmatrixThingList;
    }

    /**
     * CMatrixモノリスト設定
     * @param cmatrixThingList
     */
    public setCmatrixThingList (cmatrixThingList: CmatrixThing[]) {
        this.cmatrixThingList = cmatrixThingList;
    }
}
