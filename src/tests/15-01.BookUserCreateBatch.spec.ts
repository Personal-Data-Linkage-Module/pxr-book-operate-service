/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import * as express from 'express';
import * as supertest from 'supertest';
import { Server } from 'net';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import { sprintf } from 'sprintf-js';
import OperatorServer from './StubOperatorServer';
import StubCatalogServer from './StubCatalogServer';
import StubBookManageServer from './StubBookManageServer';
import StubNotificationServer from './StubNotificationServer';
import Config from '../common/Config';
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import { resourceUsage } from 'process';
/* eslint-enable */
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// スタブサーバー（オペレータサービス）
class StubOperatorServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number, type: number) {
        this._app = express();
        this._app.use(bodyParser.json({ limit: '100mb' }));
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(cookieParser());

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                sessionId: 'sessionId',
                operatorId: 1,
                type: type,
                loginId: 'loginid',
                name: 'test-user',
                mobilePhone: '0311112222',
                auth: {
                    add: true,
                    update: true,
                    delete: true
                },
                lastLoginAt: '2020-01-01T00:00:00.000+0900',
                attributes: {},
                roles: [
                    {
                        _value: 1,
                        _ver: 1
                    }
                ],
                block: {
                    _value: 1000110,
                    _ver: 1
                },
                actor: {
                    _value: 1000004,
                    _ver: 1
                }
            });
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.post('/operator/session', _listener);
        this._app.post('/operator', _listener);
        this._server = this._app.listen(3000);
    }
}

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServer = null;
let _catalogServer: StubCatalogServer = null;
let _bookManageServer: StubBookManageServer = null;

/**
 * book-operate API のユニットテスト
 */
describe('book-operate API', () => {
    /**
     * 全テスト実行の前処理
     */
    beforeAll(async () => {
        // DB接続
        await common.connect();
        // DB初期化
        await common.executeSqlFile('initialData.sql');
        await common.executeSqlFile('initialMyConditionData.sql');
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
        if (_operatorServer) {
            _operatorServer._server.close();
            _operatorServer = null;
        }
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
        if (_bookManageServer) {
            _bookManageServer._server.close();
            _bookManageServer = null;
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
     * 利用者作成（バッチ）
     */
    describe('利用者作成（バッチ）', () => {
        test('正常', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 3);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Book管理から返却されたデータにcooperationが存在しない', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 4);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Book管理から返却されたデータがnull', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(404);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：Book管理から400エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(400);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(400);
        });
        test('異常：Book管理から500系エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(503);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(503);
        });
        test('異常：Book管理から200以外エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(401);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(401);
        });
        test('異常：Book管理に接続できない', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.body.message).toBe(Message.BOOK_MANAGE_BOOK_LIST_RESPONSE_STATUS);
            expect(response.status).toBe(503);
        });
    });
});
