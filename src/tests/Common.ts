/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { connectDatabase } from './Connection';
import path = require('path');
import fs = require('fs');

// テスト用にlisten数を無制限に設定
require('events').EventEmitter.defaultMaxListeners = 0;

/**
 * URL
 */
export namespace Url {
    /**
     * ベースURL
     */
    export const baseURI: string = '/book-operate';

    /**
     * 利用者作成URL
     */
    export const userCreateURI: string = baseURI + '/user';

    /**
     * 利用者削除URL
     */
    export const userDeleteURI: string = userCreateURI + '/delete';

    /**
     * 利用者一覧検索URL
     */
    export const userListURI: string = baseURI + '/user/list';

    /**
     * 利用者作成（バッチ）URL
     */
    export const userCreateBatchURI: string = baseURI + '/user/batch';

    /**
     * イベントURL
     */
    export const eventURI: string = baseURI + '/event';

    /**
     * モノURL
     */
    export const thingURI: string = baseURI + '/thing';

    /**
     * 一括モノURL
     */
    export const thingBulkURI: string = thingURI + '/bulk';

    /**
     * Book参照URL
     */
    export const bookSearchURI: string = baseURI + '/book/search';

    /**
     * 個人用共有アクセスログ取得(非推奨)URL
     */
    export const indAccessLogURI: string = baseURI + '/ind/accesslog';

    /**
     * 個人用共有アクセスログ取得URL
     */
    export const accessLogURI: string = baseURI + '/accesslog';

    /**
     * データ共有によるデータ取得URL
     */
    export const shareURI: string = baseURI + '/share';

    /**
     * 共有トリガーによる共有状態取得URL
     */
    export const shareTriggerURI: string = baseURI + '/share/trigger';

    /**
     * 共有トリガーによる共有状態取得URL
     */
    export const updateShareTriggerURI: string = baseURI + '/share/trigger/:id/end';

    /**
      * 蓄積イベント通知受信URL
      */
    export const storeEventReceive: string = baseURI + '/store-event/receive';

    /**
     * 一時的データ共有コードによるデータ取得URL
     */
    export const ShareByTempShereCodeURI: string = baseURI + '/share/temp';

    /**
     * データ共有URL
     */
    export const ShareSearchURI: string = baseURI + '/share/search';

    /**
     * 対象データ取得URL
     */
    export const contractCollectURI: string = baseURI + '/contract/collect';

    /**
     * 利用者対象データ連携完了URL
     */
    export const contractCollectCompleteURI: string = baseURI + '/contract/collect/complete';

    /**
     * 利用者データ削除URL
     */
    export const deleteUserStoreDataURI: string = baseURI + '/store';

    /**
     * データ収集依頼URL
     */
    export const contractRequestURI: string = baseURI + '/contract/request';
}

/**
 * テスト用共通クラス
 */
export default class Common {
    /**
     * DB接続
     */
    public async connect () {
        await connectDatabase();
    }

    /**
     * SQLファイル実行
     * @param fileName
     */
    public async executeSqlFile (fileName: string) {
        // ファイルをオープン
        const fd: number = fs.openSync(path.join('./ddl/unit-test/', fileName), 'r');

        // ファイルからSQLを読込
        const sql: string = fs.readFileSync(fd, 'utf-8');

        // ファイルをクローズ
        fs.closeSync(fd);

        // DBを初期化
        await this.executeSqlString(sql);
    }

    /**
     * SQL実行
     * @param sql
     */
    public async executeSqlString (sql: string) {
        // DBを初期化
        const connection = await connectDatabase();
        await connection.query(sql);
    }
}
