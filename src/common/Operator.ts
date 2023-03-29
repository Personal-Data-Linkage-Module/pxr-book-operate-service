/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 * オペレータ種別
 */
export namespace OperatorType {
    /**
     * 個人(0)
     */
    export const TYPE_IND: number = 0;

    /**
     * ワークフロー(1)
     */
    export const TYPE_WF: number = 1;

    /**
     * アプリケーション(2)
     */
    export const TYPE_APP: number = 2;

    /**
     * 運営メンバー(3)
     */
    export const TYPE_MANAGE_MEMBER: number = 3;
}

/**
 * クッキー種別
 */
export namespace CookieType {
    /**
     * 個人
     */
    export const TYPE_PERSONAL_COOKIE: string = 'operator_type0_session';

    /**
     * ワークフロー
     */
    export const TYPE_WORKFLOW_COOKIE: string = 'operator_type1_session';

    /**
     * アプリケーション
     */
    export const TYPE_APPLICATION_COOKIE: string = 'operator_type2_session';

    /**
     * 運営メンバー
     */
    export const TYPE_MANAGER_COOKIE: string = 'operator_type3_session';
}
