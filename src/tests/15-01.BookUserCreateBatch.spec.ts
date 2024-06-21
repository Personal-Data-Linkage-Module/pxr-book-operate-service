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
import moment = require('moment');
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
        this._app.use(bodyParser.json({ limit: '100mb' }) as express.RequestHandler);
        this._app.use(bodyParser.urlencoded({ extended: false }) as express.RequestHandler);
        this._app.use(cookieParser());

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                sessionId: 'sessionId',
                operatorId: 1,
                type,
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
        this._app.get('/operator/user/info', (req, res) => {
            res.status(status).json({
                userId: req.query.userId,
                userInfo: {
                    _code: {
                        _value: 1000373,
                        _ver: 1
                    },
                    'item-group': [
                        {
                            title: '氏名',
                            item: [
                                {
                                    title: '姓',
                                    type: {
                                        _value: 30019,
                                        _ver: 1
                                    },
                                    content: 'サンプル'
                                },
                                {
                                    title: '名',
                                    type: {
                                        _value: 30020,
                                        _ver: 1
                                    },
                                    content: '太郎'
                                }
                            ]
                        },
                        {
                            title: '性別',
                            item: [
                                {
                                    title: '性別',
                                    type: {
                                        _value: 30021,
                                        _ver: 1
                                    },
                                    content: '男'
                                }
                            ]
                        },
                        {
                            title: '生年',
                            item: [
                                {
                                    title: '生年',
                                    type: {
                                        _value: 1000372,
                                        _ver: 1
                                    },
                                    content: 2000
                                }
                            ]
                        },
                        {
                            title: '住所（行政区）',
                            item: [
                                {
                                    title: '住所（行政区）',
                                    type: {
                                        _value: 1000371,
                                        _ver: 1
                                    },
                                    content: '東京都港区'
                                }
                            ]
                        },
                        {
                            title: '連絡先電話番号',
                            item: [
                                {
                                    title: '連絡先電話番号',
                                    type: {
                                        _value: 30036,
                                        _ver: 1
                                    },
                                    content: '080-1234-5678',
                                    'changeable-flag': true
                                }
                            ]
                        }
                    ]
                }
            }).end();
        });
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
        await common.disconnect();
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
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: '2020-01-01T00:00:00.000+0900'
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(4);
            expect(response2.body[0].userId).toBe('test_user_id1');
            expect(response2.body[1].userId).toBe('test_user_id2');
            expect(response2.body[2].userId).toBe('test_user_id3');
            expect(response2.body[3].userId).toBe('test_user_id4');
        });
        test('正常：Book管理から返却されたデータにcooperationが存在しない', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 4);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Book管理から返却されたデータがnull', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(204);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

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
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

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
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

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
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

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
            const url = Url.userCreateBatchURI + '?maxCount=1000&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.body.message).toBe(Message.BOOK_MANAGE_BOOK_LIST_RESPONSE_STATUS);
            expect(response.status).toBe(503);
        });
    });

    describe('利用者作成（バッチ） (9097追加分)', () => {
        // DoRequestメソッドのmock化
        const doRequet = require('../common/DoRequest');
        const mockDoPostRequest = jest.spyOn(doRequet, 'doPostRequest');

        /**
         * 各テスト実行の前処理
         */
        beforeEach(async () => {
            mockDoPostRequest.mockClear();
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.my_condition_book
                (
                    user_id,
                    actor_catalog_code, actor_catalog_version,
                    app_catalog_code, app_catalog_version,
                    wf_catalog_code, wf_catalog_version,
                    open_start_at,
                    attributes, is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'test_exists_user',
                    1000004, 1,
                    1000007, 1,
                    null, null,
                    '2024-02-01T00:00:00.000+0900',
                    null, false, 'loginid', '2020-02-01T00:00:00.000+0900', 'loginid', '2020-02-01T00:00:00.000+0900'
                );
            `);
        });
        afterAll(async () => {
            mockDoPostRequest.mockRestore();
        });
        test('正常: 作成済みのBookが1件もない', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 5);
            _operatorServer = new StubOperatorServer(200, 3);

            // Book消去
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
            `);

            // 現在時刻
            const now = moment(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

            // 2020/01/01を基準日とする
            const tartgetDate = moment('2020-01-01T00:00:00.000+0900').tz('Asia/Tokyo').subtract(1, 'days').toDate();

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=10&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // Book管理サービス.Book一覧取得APIへのリクエスト
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3005/book-manage/search');
            const reqBody = JSON.parse(apiInfos[0][1]['body']);
            expect(reqBody.offset).toBe(0);
            expect(reqBody.limit).toBe(10);
            expect(reqBody.coopStartAt).toBe(tartgetDate.toISOString());

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: now
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(5);
            expect(response2.body[0].userId).toBe('test_app_user01');
            expect(response2.body[1].userId).toBe('test_app_user02');
            expect(response2.body[2].userId).toBe('test_app_user03');
            expect(response2.body[3].userId).toBe('test_app_user04');
            expect(response2.body[4].userId).toBe('test_app_user05');
        });
        test('正常: 作成対象件数(Book一覧取得の件数)がmaxCount以下', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 5);
            _operatorServer = new StubOperatorServer(200, 3);

            // 現在時刻
            const now = moment(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

            const tartgetDate = moment('2024-02-01T00:00:00.000+0900').tz('Asia/Tokyo').subtract(1, 'days').toDate();

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=10&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // Book管理サービス.Book一覧取得APIへのリクエスト
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3005/book-manage/search');
            const reqBody = JSON.parse(apiInfos[0][1]['body']);
            expect(reqBody.offset).toBe(0);
            expect(reqBody.limit).toBe(10);
            expect(reqBody.coopStartAt).toBe(tartgetDate.toISOString());

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: now
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(5);
            expect(response2.body[0].userId).toBe('test_app_user01');
            expect(response2.body[1].userId).toBe('test_app_user02');
            expect(response2.body[2].userId).toBe('test_app_user03');
            expect(response2.body[3].userId).toBe('test_app_user04');
            expect(response2.body[4].userId).toBe('test_app_user05');
        });
        test('正常: 作成対象件数(Book一覧取得の件数)がmaxCountと同じ', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 5);
            _operatorServer = new StubOperatorServer(200, 3);

            // 現在時刻
            const now = moment(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

            const tartgetDate = moment('2024-02-01T00:00:00.000+0900').tz('Asia/Tokyo').subtract(1, 'days').toDate();

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=5&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // Book管理サービス.Book一覧取得APIへのリクエスト
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3005/book-manage/search');
            const reqBody = JSON.parse(apiInfos[0][1]['body']);
            expect(reqBody.offset).toBe(0);
            expect(reqBody.limit).toBe(5);
            expect(reqBody.coopStartAt).toBe(tartgetDate.toISOString());

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: now
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(5);
            expect(response2.body[0].userId).toBe('test_app_user01');
            expect(response2.body[1].userId).toBe('test_app_user02');
            expect(response2.body[2].userId).toBe('test_app_user03');
            expect(response2.body[3].userId).toBe('test_app_user04');
            expect(response2.body[4].userId).toBe('test_app_user05');
        });
        test('正常: 作成対象件数(Book一覧取得の件数)がmaxCountより多い', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 5);
            _operatorServer = new StubOperatorServer(200, 3);

            // 現在時刻
            const now = moment(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

            const tartgetDate = moment('2024-02-01T00:00:00.000+0900').tz('Asia/Tokyo').subtract(1, 'days').toDate();

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=2&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // Book管理サービス.Book一覧取得APIへのリクエスト
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3005/book-manage/search');
            const reqBody = JSON.parse(apiInfos[0][1]['body']);
            expect(reqBody.offset).toBe(0);
            expect(reqBody.limit).toBe(2);
            expect(reqBody.coopStartAt).toBe(tartgetDate.toISOString());

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: now
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(2);
            expect(response2.body[0].userId).toBe('test_app_user01');
            expect(response2.body[1].userId).toBe('test_app_user02');
        });
        test('正常: 1件作成済み', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 5);
            _operatorServer = new StubOperatorServer(200, 3);

            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.my_condition_book
                (
                    user_id,
                    actor_catalog_code, actor_catalog_version,
                    app_catalog_code, app_catalog_version,
                    wf_catalog_code, wf_catalog_version,
                    open_start_at,
                    attributes, is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'test_app_user01',
                    1000004, 1,
                    1000007, 1,
                    null, null,
                    '2024-02-01T00:00:00.000+0900',
                    null, false, 'loginid', '2020-02-01T00:00:00.000+0900', 'loginid', '2020-02-01T00:00:00.000+0900'
                );
            `);

            // 現在時刻
            const now = moment(new Date()).tz('Asia/Tokyo').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

            const tartgetDate = moment('2024-02-01T00:00:00.000+0900').tz('Asia/Tokyo').subtract(1, 'days').toDate();

            // 送信データを生成
            const url = Url.userCreateBatchURI + '?maxCount=2&dayBack=1';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);

            // Book管理サービス.Book一覧取得APIへのリクエスト
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3005/book-manage/search');
            const reqBody = JSON.parse(apiInfos[0][1]['body']);
            expect(reqBody.offset).toBe(0);
            expect(reqBody.limit).toBe(2);
            expect(reqBody.coopStartAt).toBe(tartgetDate.toISOString());

            const reqBody2 = JSON.parse(apiInfos[1][1]['body']);
            expect(reqBody2.offset).toBe(2);
            expect(reqBody2.limit).toBe(2);
            expect(reqBody2.coopStartAt).toBe(tartgetDate.toISOString());

            // 結果を確認
            // 対象APIに送信
            const response2 = await supertest(expressApp).post(Url.userListURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    establishAt: {
                        start: now
                    }
                }));

            // レスポンスチェック
            expect(response2.status).toBe(200);
            expect(response2.body.length).toBe(2);
            expect(response2.body[0].userId).toBe('test_app_user02');
            expect(response2.body[1].userId).toBe('test_app_user03');
        });
    });
});
