/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
// import Config from '../common/Config';
import StubCatalogServer from './StubCatalogServer';
import StubOperatorServer from './StubOperatorServer';
import StubBookManageServer from './StubBookManageServer';
import StubProxyServer from './StubProxyServer';
// const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServer = null;
let _catalogServer: StubCatalogServer = null;
let _bookManageServer: StubBookManageServer = null;
let _proxyServer: StubProxyServer = null;

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
        await common.executeSqlFile('initialDocumentData.sql');
        await common.executeSqlFile('initialEventData.sql');
        await common.executeSqlFile('initialDocumentRelationData.sql');
        await common.executeSqlFile('initialThingData.sql');
        await common.executeSqlFile('initialShareStatusData.sql');
    });
    /**
     * 各テスト実行の前処理
     */
    beforeEach(async () => {
        // DB接続
        await common.connect();
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
        if (_proxyServer) {
            _proxyServer._server.close();
            _proxyServer = null;
        }
    });

    describe('データ共有によるデータ取得 バリデーション POST: ' + Url.shareURI, () => {
        test('利用者IDがnull', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    status: 400,
                    reasons: [
                        {
                            property: 'userId',
                            value: null,
                            message: 'この値は必須値です'
                        }
                    ]
                }));
        });
    });

    describe('データ共有によるデータ取得 正常系 POST: ' + Url.shareURI, () => {
        test('正常：Cookie使用, アプリケーション モノのフィルターテスト', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1001355, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200, 7);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: 'testapp1',
                        event: [
                            {
                                _value: 1001027,
                                _ver: 5
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション イベント内にモノがない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000504, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 9);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });

        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
        test('正常：Book管理サービス.データ共有定義の共有IDとカタログの共有定義のIDが一致しない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 7);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            '4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
    });

    describe('データ共有によるデータ取得 異常系 POST: ' + Url.shareURI, () => {
        test('異常：Proxyサービスからのレスポンスコードが200以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000501, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 204);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
        });

        test('異常：Proxyサービスへの接続に失敗', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000501, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 2);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
        });
    });

    describe('SNS通知バグ対応追加ケース' + Url.shareURI, () => {
        test('正常：document,event,thing が全て空のものを除外されているか確認', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200, 8);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
        });
        test('正常：document,event,thing が全て空のもの飲みが返却された場合、空の配列が返却されるか確認', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200, 9);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.shareURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: '...',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        document: [
                            {
                                _value: 1000823,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000815,
                                _ver: 1
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(0);
        });
    });
});
