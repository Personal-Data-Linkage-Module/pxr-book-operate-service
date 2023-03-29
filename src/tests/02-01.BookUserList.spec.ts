/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import { sprintf } from 'sprintf-js';
import StubCatalogServer from './StubCatalogServer';
import StubBookManageServer from './StubBookManageServer';
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import Config from '../common/Config';
import { NotificationService } from './StubNotificationServer';
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// スタブサーバー（オペレータサービス）
class StubOperatorServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number, type: number, infoStatus: number = 200) {
        this._app = express();

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
                    _value: 1000001,
                    _ver: 1
                }
            });
        };
        this._app.get('/operator/user/info', (req, res) => {
            if (infoStatus !== 200 || status !== 200) {
                res.status(infoStatus === 200 ? status : infoStatus).json({ status: status, message: 'テストエラー' }).end();
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

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.post('/operator/session', _listener);
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
        await common.executeSqlFile('initialListData.sql');
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
     * 利用者一覧検索
     */
    describe('利用者一覧検索', () => {
        test('正常：app', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            '333333333'
                        ],
                        establishAt: {
                            start: '2020-03-01T00:00:00.000+0900',
                            end: '2020-03-04T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });
        test('正常：オペレーターがregion-root', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, -1, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.regionRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222',
                            '333333333'
                        ],
                        establishAt: {
                            start: '2020-03-01T00:00:00.000+0900',
                            end: '2020-03-04T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：Cookieにセッション情報がある', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });
        test('正常：Cookieのセッション情報がapp', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });
        test('正常：MyConditionBookデータ全件対象（userIdおよび日付指定なし）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });

        test('正常：userIdのみ1件指定', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111'
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：userIdのみ複数件指定', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

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
                            '123456789',
                            '222222222'
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.start境界値）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-02-01T09:00:00.000+0900',
                            end: '2020-03-04T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.end境界値）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-02T09:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.startのみ指定）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-02-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.endのみ指定）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.startが空文字）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.startがnull）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: null,
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.endが空文字）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-02-01T00:00:00.000+0900',
                            end: ''
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.endがnull）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-02-01T00:00:00.000+0900',
                            end: null
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            // console.log(response.body);
        });

        test('正常：日付形式（日付のみ指定、establishAt.startとendが同日）', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        establishAt: {
                            start: '2020-03-02T09:00:00.000+0900',
                            end: '2020-03-02T09:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify([
                {
                    status: 1,
                    app: null,
                    wf: { _value: 1000007, _ver: 1 },
                    userId: '222222222',
                    establishAt: '2020-03-02T09:00:00.000+0900',
                    attribute: {},
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1200009,
                                _ver: 4
                            }, {
                                _value: 1200010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1200011,
                                _ver: 2
                            }, {
                                _value: 1200014,
                                _ver: 3
                            }
                        ]
                    },
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
            ]));
            expect(response.status).toBe(200);
        });

        test('正常：', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);
            const notificationServer = new NotificationService(200);
            await notificationServer.start();

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));
            await notificationServer.stop();

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify([
                {
                    status: 1,
                    app: null,
                    wf: { _value: 1000007, _ver: 1 },
                    userId: '111111111',
                    establishAt: '2020-02-01T09:00:00.000+0900',
                    attribute: {},
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000011,
                                _ver: 1
                            }, {
                                _value: 1000014,
                                _ver: 1
                            }
                        ]
                    },
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
                },
                {
                    status: 1,
                    app: null,
                    wf: { _value: 1000007, _ver: 1 },
                    userId: '222222222',
                    establishAt: '2020-03-02T09:00:00.000+0900',
                    attribute: {},
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1200009,
                                _ver: 4
                            }, {
                                _value: 1200010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1200011,
                                _ver: 2
                            }, {
                                _value: 1200014,
                                _ver: 3
                            }
                        ]
                    },
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
                },
                {
                    status: 1,
                    app: { _value: 1000007, _ver: 1 },
                    wf: null,
                    userId: '333333333',
                    establishAt: '2020-03-03T09:00:00.000+0900',
                    attribute: '{sample:1}',
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1300009,
                                _ver: 4
                            }, {
                                _value: 1300010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1300011,
                                _ver: 2
                            }, {
                                _value: 1300014,
                                _ver: 3
                            }
                        ]
                    },
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
                },
                { status: 0, identifyCode: 'not_found' }
            ]));
            expect(response.status).toBe(200);
        });

        test('異常：通知サービス接続に失敗', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 503, message: '通知サービスへの接続に失敗しました' }));
            expect(response.status).toBe(503);
        });

        test('異常：通知サービス レスポンス5xx', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);
            const notificationServer = new NotificationService(500);
            await notificationServer.start();

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));
            await notificationServer.stop();

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 503, message: '通知サービスの取得に失敗しました' }));
            expect(response.status).toBe(503);
        });

        test('異常：通知サービス レスポンス400', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);
            const notificationServer = new NotificationService(400);
            await notificationServer.start();

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));
            await notificationServer.stop();

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ status: 400, message: '通知サービスの取得に失敗しました' }));
            expect(response.status).toBe(400);
        });

        test('異常：通知サービス レスポンス204', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);
            const notificationServer = new NotificationService(204);
            await notificationServer.start();

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));
            await notificationServer.stop();

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify([
                {
                    status: 1,
                    app: null,
                    wf: { _value: 1000007, _ver: 1 },
                    userId: '111111111',
                    establishAt: '2020-02-01T09:00:00.000+0900',
                    attribute: {},
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000011,
                                _ver: 1
                            }, {
                                _value: 1000014,
                                _ver: 1
                            }
                        ]
                    },
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
                },
                {
                    status: 1,
                    app: null,
                    wf: { _value: 1000007, _ver: 1 },
                    userId: '222222222',
                    establishAt: '2020-03-02T09:00:00.000+0900',
                    attribute: {},
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1200009,
                                _ver: 4
                            }, {
                                _value: 1200010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1200011,
                                _ver: 2
                            }, {
                                _value: 1200014,
                                _ver: 3
                            }
                        ]
                    },
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
                },
                {
                    status: 1,
                    app: { _value: 1000007, _ver: 1 },
                    wf: null,
                    userId: '333333333',
                    establishAt: '2020-03-03T09:00:00.000+0900',
                    attribute: '{sample:1}',
                    store: {
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            }, {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1300009,
                                _ver: 4
                            }, {
                                _value: 1300010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1300011,
                                _ver: 2
                            }, {
                                _value: 1300014,
                                _ver: 3
                            }
                        ]
                    },
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
            ]));
            expect(response.status).toBe(200);
        });

        test('異常：通知サービス レスポンス401', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);
            const notificationServer = new NotificationService(401);
            await notificationServer.start();

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    includeRequest: true
                }));
            await notificationServer.stop();

            // レスポンスチェック
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                status: 401,
                message: '通知サービスの取得に失敗しました'
            }));
            expect(response.status).toBe(401);
        });

        test('パラメータ異常：userId（配列ではない）', async () => {
            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: '123456789',
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'userId'));
        });

        test('パラメータ異常：userId（配列だが値が空文字）', async () => {
            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            ''
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.EMPTY_PARAM, 'userId'));
        });

        test('パラメータ異常：userId（配列だが値がnull）', async () => {
            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            null
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.EMPTY_PARAM, 'userId'));
        });

        test('パラメータ異常：userId（配列だが0件）', async () => {
            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.EMPTY_PARAM, 'userId'));
        });

        test('パラメータ異常：日付形式（establishAt.startが文字）', async () => {
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
                            start: 'a',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.DATE_INVALID, 'establishAt.start'));
        });

        test('パラメータ異常：日付形式（establishAt.startが数字のみ）', async () => {
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
                            start: '2020',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.DATE_INVALID, 'establishAt.start'));
        });

        test('パラメータ異常：日付形式（establishAt.endが文字）', async () => {
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
                            end: 'a'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.DATE_INVALID, 'establishAt.end'));
        });

        test('パラメータ異常：日付形式（establishAt.endが数字のみ）', async () => {
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
                            end: '2020'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.DATE_INVALID, 'establishAt.end'));
        });

        test('パラメータ異常：日付形式（establishAt.startがendより未来）', async () => {
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
                            start: '2020-03-01T00:00:00.000+0900',
                            end: '2020-01-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.DATE_SCOPE_INVALID, 'establishAt'));
        });

        test('異常：対象データなし', async () => {
            _operatorServer = new StubOperatorServer(200, 1);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        userId: [
                            '999999999'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });

        test('異常：セッション情報なし', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：ヘッダセッション情報が空', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: '' })
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });

        test('異常：Cookieのセッション情報が個人', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 0);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
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
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
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
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });

        test('異常：オペレータサービス接続エラー', async () => {
            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });

        test('異常：My-Condition-Book管理サービスデータ蓄積定義取得からのレスポンス異常（400）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(400);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });

        test('異常：My-Condition-Book管理サービスデータ蓄積定義取得からのレスポンス異常（500系）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(500);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET);
        });

        test('異常：My-Condition-Book管理サービスデータ蓄積定義取得からのレスポンス異常（404）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(404);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });

        test('異常：My-Condition-Book管理サービスデータ蓄積定義取得からのレスポンス異常（200以外）', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(401);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_DATA_ACCUMU_GET);
        });

        test('異常：My-Condition-Book管理サービスデータ蓄積定義取得への接続エラー', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111',
                            '222222222'
                        ],
                        establishAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_DATA_ACCUMU_GET);
        });

        test('異常：オペレーターサービスにて、利用者情報が未登録', async () => {
            // スタブを起動
            _operatorServer = new StubOperatorServer(200, 3, 204);
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200);

            // 送信データを生成
            const url = Url.userListURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=sessionId'])
                .send(JSON.stringify(
                    {
                        userId: [
                            '111111111'
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
    });
});
