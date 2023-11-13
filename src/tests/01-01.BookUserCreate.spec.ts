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

// DoRequestメソッドのmock化
const doRequest = require('../common/DoRequest');
const mockDoPostRequest = jest.spyOn(doRequest, 'doPostRequest');
const mockDoGetRequest = jest.spyOn(doRequest, 'doGetRequest');

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
            if (req.body.sessionId === 'sessionId') {
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
                        _value: 1000001,
                        _ver: 1
                    }
                });
            } else if (req.body.sessionId === 'appSessionId') {
                res.json({
                    sessionId: 'appSsessionId',
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
                        _value: 1000436,
                        _ver: 1
                    }
                });
            } else if (req.body.sessionId === 'regionSessionId') {
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
                        _value: 1000432,
                        _ver: 1
                    }
                });
            } else {
                console.log(req.body);
                res.json({});
            }
        };
        this._app.post('/operator/user/info', (req, res) => {
            res.status(status).json({ userId: req.body.userId }).end();
        });
        this._app.get('/operator/user/info', (req, res) => {
            if (status !== 200) {
                res.status(status).json({ status: status, message: 'テストエラー' }).end();
            } else {
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
            }
        });
        const _listener2 = (req: express.Request, res: express.Response) => {
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
                    _value: 1000001,
                    _ver: 1
                }
            });
        };
        const _listener3 = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                operatorId: 1,
                register: 'loginid'
            });
        };
        const _listener4 = (req: express.Request, res: express.Response) => {
            // ログイン不可個人の登録レスポンス、処理で使用しないためスタブでは空を返却
            res.status(status);
            res.json({});
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.post('/operator/session', _listener);
        this._app.post('/operator', _listener4);
        this._app.get('/operator', _listener2);
        this._app.delete('/operator/:operatorId', _listener3);
        this._server = this._app.listen(3000);
    }
}

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServer = null;
let _catalogServer: StubCatalogServer = null;
let _bookManageServer: StubBookManageServer = null;
let _notificationServer: StubNotificationServer = null;

// wf,app,region種別
const TYPE_APP = 1;
const TYPE_REGION = 2;

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
    });

    /**
     * 各テスト実行の前処理
     */
    beforeEach(async () => {
        // DB接続
        await common.connect();
        // mockDoPostRequestのリセット
        mockDoPostRequest.mockClear();
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
        if (_notificationServer) {
            _notificationServer._server.close();
            _notificationServer = null;
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
     * 利用者作成
     */
    describe('利用者作成', () => {
        test('正常：app', async () => {
            // 事前データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo2',
                        attributes: {},
                        userInformation: {
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
                                            }
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
            expect(response.body.wf).toBe(undefined);
            expect(response.body.region).toBe(undefined);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.attributes).toEqual({});
            expect(response.body.establishAt).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+0900$/);
        });

        test('正常：region', async () => {
            // 事前データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_REGION);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRoot) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {}
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.app).toBe(undefined);
            expect(response.body.wf).toBe(undefined);
            expect(response.body.region._value).toBe(1000006);
            expect(response.body.region._ver).toBe(1);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.attributes).toEqual({});
            expect(response.body.establishAt).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+0900$/);
        });

        test('正常：Cookieにセッション情報がある（Appプロバイダー）', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.wf).toBe(undefined);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
            expect(response.body.region).toBe(undefined);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.attributes).toEqual({});
            expect(response.body.establishAt).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+0900$/);
        });

        test('正常：Cookieにセッション情報がある（運営メンバー）', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.wf).toBe(undefined);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
            expect(response.body.region).toBe(undefined);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.attributes).toEqual({});
            expect(response.body.establishAt).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+0900$/);
        });

        test('異常：運営メンバー以外', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 2);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {}
                    }
                ));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
            expect(response.status).toBe(400);
        });

        test('異常：取得した利用者ID連携のAPP,WF,REGIONが同時に設定されている', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, 3);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {}
                    }
                ));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.SET_APP_REGION);
            expect(response.status).toBe(400);
        });

        test('異常：取得した利用者ID連携のAPP,REGIONが設定されていない', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, 4);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {}
                    }
                ));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.EMPTY_APP);
            expect(response.status).toBe(400);
        });

        test('パラメータ不足：全体が空', async () => {
            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });

        test('パラメータ不足：identifyCode', async () => {
            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });

        test('パラメータ異常：identifyCode（空文字）', async () => {
            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: '',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：attributes（文字）', async () => {
            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: 'a',
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_INVALID, 'attributes', 'オブジェクト'));
        });

        test('異常：セッション情報なし', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456781',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：ヘッダセッション情報が空', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: '' })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456782',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：セッション情報が個人', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 0);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456780',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });

        test('異常：セッション情報が個人', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 0);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456780',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });

        test('異常：オペレータサービスレスポンス異常（500系）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(500, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456780',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });

        test('異常：オペレータサービスレスポンス異常（200以外）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(204, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456780',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });

        test('異常：オペレータサービス接続エラー', async () => {
            // スタブを起動
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '123456780',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });

        test('正常：別アプリケーションに同一IDの利用者', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
                INSERT INTO pxr_book_operate.my_condition_book
                (
                    user_id,
                    actor_catalog_code, actor_catalog_version,
                    app_catalog_code, app_catalog_version,
                    wf_catalog_code, wf_catalog_version,
                    open_start_at, identify_code,
                    attributes, is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    '123456789',
                    1000003, 1,
                    1000006, 1,
                    null, null,
                    '2020-02-01T00:00:00.000+0900', 'ukO8z+Xf8vv7yxXQj2Hpo',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                actor: {
                    _value: 1000003,
                    _ver: 1
                },
                app: {
                    _value: 1000005,
                    _ver: 1
                },
                userId: '123456789',
                establishAt: response.body.establishAt,
                attributes: {}
            }));
        });

        test('異常：MyConditionBook管理サービス利用者ID連携からのレスポンスエラー（400）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(400);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '1111111',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_USERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携からのレスポンスエラー（500系）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(500);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '1111111',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_USERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携からのレスポンスエラー（200以外）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(404);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '1111111',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_USERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携への接続エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '1111111',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_USERIDCOOPERATE);
        });

        test('異常：通知サービスからのレスポンスエラー（400）', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(400);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '2222222',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービスからのレスポンスエラー（500系）', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(500);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '2222223',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービスからのレスポンスエラー（200以外）', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(404);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '2222225',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービス接続エラー', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        userId: '2222226',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_NOTIFICATION);
        });
        test('異常：オペレーターサービスからのレスポンスエラー（400）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(400, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_OPERATOR);
        });
        test('異常：オペレーターサービスからのレスポンスエラー（500系）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(500, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_OPERATOR);
        });
        test('異常：オペレーターサービスからのレスポンスエラー（200以外）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(401, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_OPERATOR);
        });
        test('異常：オペレーターサービス接続エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });

        test('異常：itemのcontentが配列', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _operatorServer = new StubOperatorServer(200, 3);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send({
                    identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                    userInformation: {
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
                                        content: ['太郎', 'Tarou']
                                    }
                                ]
                            }
                        ]
                    }
                });

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                status: 400,
                reasons: [
                    {
                        property: 'content',
                        value: ['太郎', 'Tarou'],
                        message: 'この値には、配列やJSONを設定することはできません'
                    }
                ]
            }));
            expect(response.status).toBe(400);
        });
    });

    /**
     * 利用者作成（userId重複パターン）
     */
    describe('利用者作成（userId重複パターン）', () => {
        test('正常：セッションのオペレータ所属blockがapp, 利用者管理情報追加のリクエストにappコード設定', async () => {
            // データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;
            const userInfo = {
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
                                }
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
            };
            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify({
                    identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                    attributes: {},
                    userInformation: userInfo
                }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.wf).toBe(undefined);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
            expect(response.body.region).toBe(undefined);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.attributes).toEqual({});
            expect(response.body.establishAt).toMatch(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}\+0900$/);
            const bookRecordCount = await common.executeSqlString(`
            SELECT COUNT(*) FROM pxr_book_operate.my_condition_book WHERE user_id = '123456789' and app_catalog_code = 1000005;
            `);
            expect(JSON.stringify(bookRecordCount)).toEqual(JSON.stringify([{ count: '1' }]));
            // オペレータサービス.利用者管理情報登録API へのリクエストの確認
            const apiInfos = mockDoPostRequest.mock.calls.filter(elem => elem[0] === 'http://localhost:3000/operator/user/info');
            expect(apiInfos[0][1]['body']).toBe(JSON.stringify({
                userId: '123456789',
                wfCode: null,
                appCode: 1000005,
                regionCode: null,
                userInfo: userInfo
            }));
        });
        test('異常：セッションのオペレータ所属blockがapp, 利用者管理情報追加のリクエストにregionコード設定', async () => {
            // データ準備
            await common.executeSqlString(`
                    DELETE FROM pxr_book_operate.my_condition_book;
                    SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
                `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_REGION);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;
            const userInfo = {
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
                                }
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
            };
            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify({
                    identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                    attributes: {},
                    userInformation: userInfo
                }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.MISMATCH_OPERATOR_BLOCK_TYPE_AND_SERVICE_CODE);
        });
        test('異常：セッションのオペレータ所属blockがregion, 利用者管理情報追加のリクエストにappコード設定', async () => {
            // データ準備
            await common.executeSqlString(`
                    DELETE FROM pxr_book_operate.my_condition_book;
                    SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
                `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;
            const userInfo = {
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
                                }
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
            };
            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRoot) })
                .send(JSON.stringify({
                    identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                    attributes: {},
                    userInformation: userInfo
                }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.MISMATCH_OPERATOR_BLOCK_TYPE_AND_SERVICE_CODE);
        });
        test('異常：アクターカタログのNSが取得できない', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 2, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_FOUND_ACTOR_CATALOG);
        });
        test('異常：オペレータの所属Block判定がapp, region以外', async () => {
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
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
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.INVALID_OPERATOR_BLOCK_TYPE);
        });
    });

    /**
     * 利用者削除（userId重複パターン）
     */
    describe('利用者削除（userId重複パターン）', () => {
        test('正常：セッションのオペレータ所属blockがapp', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                null, null,
                1000004, 1,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            ),
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
            // 削除対象bookが削除されているか確認
            const targetBookRecord = await common.executeSqlString(`
            SELECT * FROM pxr_book_operate.my_condition_book WHERE user_id = '123456789' and app_catalog_code = 1000005;
            `);
            expect(targetBookRecord.length).toBe(1);
            expect(JSON.stringify(targetBookRecord[0].is_disabled)).toBe('true');
            // 削除対象book以外が削除されていないか確認
            const notTargetBookRecords = await common.executeSqlString(`
            SELECT * FROM pxr_book_operate.my_condition_book WHERE user_id = '123456789' and app_catalog_code <> 1000005;
            `);
            expect(targetBookRecord.length).toBe(1);
            for (const notTargetBook of notTargetBookRecords) {
                expect(JSON.stringify(notTargetBook.is_disabled)).toBe('false');
            }
            // オペレータサービス.オペレータID取得API のクエリパラメータ確認
            // http://localhost:3000/operator をuriに含むリクエストに対し、クエリ含むuriが正しいか確認する
            const apiInfos = mockDoGetRequest.mock.calls;
            for (const apiInfo of apiInfos) {
                const apiUri = JSON.stringify(apiInfo[0]);
                if (apiUri.includes('http://localhost:3000/operator')) {
                    expect(apiUri).toBe(JSON.stringify('http://localhost:3000/operator?type=0&loginId=123456789&appCode=1000005'));
                }
            }
        });
        test('異常：アクターカタログのNSが取得できない', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                null, null,
                1000004, 1,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 2, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_FOUND_ACTOR_CATALOG);
        });
        test('異常：オペレータの所属Block判定がapp, region以外', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                null, null,
                1000004, 1,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.INVALID_OPERATOR_BLOCK_TYPE);
        });
    });

    /**
     * 利用者削除
     */
    describe('利用者削除', () => {
        test('正常：app', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo2'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
        });

        test('正常：region', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                1000006, 1,
                null, null,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_REGION);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRoot) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.region._value).toBe(1000006);
            expect(response.body.region._ver).toBe(1);
        });

        test('異常：Cookieにセッション情報がある（Appプロバイダー）', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 2);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });

        test('正常：Cookieにセッション情報がある（運営メンバー）', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                null, null,
                1000004, 1,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.wf._value).toBe(1000004);
            expect(response.body.wf._ver).toBe(1);
        });

        test('正常：物理削除', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI + '?physicalDelete=true';

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.userId).toBe('123456789');
            expect(response.body.actor._value).toBe(1000003);
            expect(response.body.actor._ver).toBe(1);
            expect(response.body.app._value).toBe(1000005);
            expect(response.body.app._ver).toBe(1);
        });
        test('異常：パラメータが空', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });

        test('パラメータ異常：identifyCode（空文字）', async () => {
            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: ''
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('異常：セッション情報なし', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：ヘッダセッション情報が空', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200);
            _notificationServer = new StubNotificationServer(200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: '' })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：セッション情報が個人', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 0);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：オペレータサービスレスポンス異常（500系）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(500, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });

        test('異常：オペレータサービスレスポンス異常（200以外）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(204, 3);
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });

        test('異常：オペレータサービス接続エラー', async () => {
            // スタブを起動
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：MyConditionBook管理サービス利用者ID連携解除からのレスポンスエラー（400）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(400);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携解除からのレスポンスエラー（500系）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(500);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携解除からのレスポンスエラー（200以外）', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(404);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_CANCELUSERIDCOOPERATE);
        });

        test('異常：MyConditionBook管理サービス利用者ID連携解除への接続エラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 0, 200);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_CANCELUSERIDCOOPERATE);
        });

        test('異常：通知サービスからのレスポンスエラー（400）', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(400);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービスからのレスポンスエラー（500系）', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(500);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービスからのレスポンスエラー（200以外）', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _notificationServer = new StubNotificationServer(404);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_NOTIFICATION_POST);
        });

        test('異常：通知サービス接続エラー', async () => {
            // 対象データ準備
            await common.executeSqlString(`
                DELETE FROM pxr_book_operate.my_condition_book;
                SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
            `);
            await common.executeSqlString(`
            INSERT INTO pxr_book_operate.my_condition_book
            (
                user_id,
                actor_catalog_code, actor_catalog_version,
                region_catalog_code, region_catalog_version,
                app_catalog_code, app_catalog_version,
                wf_catalog_code, wf_catalog_version,
                open_start_at,
                identify_code,
                attributes, is_disabled, created_by, created_at, updated_by, updated_at
            )
            VALUES
            (
                '123456789',
                1000003, 1,
                null, null,
                1000005, 1,
                null, null,
                NOW(),
                'ukO8z+Xf8vv7yxXQj2Hpo',
                null, false, 'loginid', NOW(), 'loginid', NOW()
            )
            `);
            _catalogServer = new StubCatalogServer(3001, 0, 200);
            _bookManageServer = new StubBookManageServer(200, TYPE_APP);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userDeleteURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.appManager) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_NOTIFICATION);
        });
    });
});
