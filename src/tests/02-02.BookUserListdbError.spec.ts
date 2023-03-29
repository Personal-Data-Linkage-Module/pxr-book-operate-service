/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import StubCatalogServer from './StubCatalogServer';
import Config from '../common/Config';
const Message = Config.ReadConfig('./config/message.json');

// テストモジュールをインポート
jest.mock('../common/Connection');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー（カタログサービス）
let _catalogServer: StubCatalogServer = null;

/**
 * book-mange API のユニットテスト
 */
describe('book-mange API', () => {
    /**
     * 全テスト実行の前処理
     */
    beforeAll(async () => {
        // DB接続
        await common.connect();
        // DB初期化
        await common.executeSqlFile('initialData.sql');
    });
    /**
     * 各テスト実行の前処理
     */
    beforeEach(async () => {
        // DB接続
        await common.connect();
    });

    /**
     * 各テスト実行の後処理
     */
    afterEach(async () => {
        // スタブサーバー停止
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
    });

    /**
     * 全テスト実行の後処理
     */
    afterAll(async () => {
        // サーバ停止
        app.stop();
    });

    /**
     * 利用者一覧検索
     */
    describe('利用者一覧検索', () => {
        test('異常：DBエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_DATABASE);
        });
    });
});
