/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import Config from '../common/Config';
import StubCatalogServer from './StubCatalogServer';
import StubOperatorServer from './StubOperatorServer';
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServer = null;
let _catalogServer: StubCatalogServer = null;

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
        await common.executeSqlFile('initialDocumentOnlyData.sql');
        await common.executeSqlFile('initialEventDataForBook.sql');
        await common.executeSqlFile('initialDocumentRelationData.sql');
        await common.executeSqlFile('initialThingDataForBook.sql');
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
    });

    /**
     * Book参照
     */
    describe('Book参照', () => {
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                app: {
                    code: {
                        index: '2_3_1',
                        value: {
                            _value: 1000004,
                            _ver: 1
                        }
                    },
                    app: {
                        index: '2_3_5',
                        value: {
                            _value: 1000007,
                            _ver: 1
                        }
                    }
                },
                chapter: [
                    {
                        title: 'タイトル２',
                        event: [
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ]
                    },
                    {
                        title: 'タイトル３',
                        event: [
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ]
                    },
                    {
                        title: 'タイトル４',
                        event: [
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ]
                    }
                ],
                sourceId: null
            });
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(400, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス未起動', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('正常：ドキュメント指定の場合', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('正常：ドキュメント指定の場合(識別子)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('正常：ドキュメント指定の場合(対象データなし、該当userIdなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'XXXXX',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：ドキュメント指定の場合(対象データなし、該当updatedAtなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2019-01-01T00:00:00.000+0900',
                            end: '2020-01-01T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：ドキュメント指定の場合(対象データなし、該当_codeなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2019-01-01T00:00:00.000+0900',
                            end: '2020-01-01T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：ドキュメント指定の場合(対象データなし、該当wfなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2019-01-01T00:00:00.000+0900',
                            end: '2020-01-01T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 99999
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：ドキュメント指定の場合(対象データなし、ドキュメントデータなし)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：ドキュメント指定の場合(対象データなし、イベントデータなし)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialDocumentOnlyData.sql');
            await common.executeSqlFile('initialDocumentRelationData.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：イベント指定の場合(アプリケーション)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialDocumentOnlyData.sql');
            await common.executeSqlFile('initialEventDataForBook.sql');
            await common.executeSqlFile('initialDocumentRelationData.sql');
            await common.executeSqlFile('initialThingDataForBook.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: 'event',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '3_1_1',
                    value: 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                },
                code: {
                    index: '3_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                start: {
                    index: '3_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                end: {
                    index: '3_2_2',
                    value: '2020-02-21T00:00:00.000+0900'
                },
                location: {
                    index: '3_3_1',
                    value: 'location'
                },
                sourceId: '20200221-1',
                env: null,
                app: {
                    code: {
                        index: '3_5_1',
                        value: {
                            _value: 1000004,
                            _ver: 1
                        }
                    },
                    app: {
                        index: '3_5_5',
                        value: {
                            _value: 1000007,
                            _ver: 1
                        }
                    }
                },
                wf: null,
                thing: [
                    {
                        id: {
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        }
                    }
                ]
            });
        });
        test('正常：イベント指定の場合(識別子：アプリケーション)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: null,
                        identifier: [
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '3_1_1',
                    value: 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                },
                code: {
                    index: '3_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                start: {
                    index: '3_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                end: {
                    index: '3_2_2',
                    value: '2020-02-21T00:00:00.000+0900'
                },
                location: {
                    index: '3_3_1',
                    value: 'location'
                },
                sourceId: '20200221-1',
                env: null,
                app: {
                    code: {
                        index: '3_5_1',
                        value: {
                            _value: 1000004,
                            _ver: 1
                        }
                    },
                    app: {
                        index: '3_5_5',
                        value: {
                            _value: 1000007,
                            _ver: 1
                        }
                    }
                },
                wf: null,
                thing: [
                    {
                        id: {
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        }
                    }
                ]
            });
        });
        test('正常：イベント指定の場合(対象データなし、該当userIdなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'XXXXX',
                        type: 'event',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：イベント指定の場合(対象データなし、イベントデータなし)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialDocumentOnlyData.sql');
            // await common.executeSqlFile('initialDocumentRelationData.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'event',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：イベント指定の場合(対象データなし、モノなし)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialDocumentOnlyData.sql');
            await common.executeSqlFile('initialEventDataForBook.sql');
            await common.executeSqlFile('initialDocumentRelationData.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'event',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：モノ指定の場合(ワークフロー)', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialDocumentOnlyData.sql');
            await common.executeSqlFile('initialEventDataForBook.sql');
            await common.executeSqlFile('initialDocumentRelationData.sql');
            await common.executeSqlFile('initialThingDataForBook.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'thing',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '4_1_1',
                    value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '4_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                env: null,
                sourceId: '20200221-1',
                'x-axis': {
                    index: '4_2_2_1',
                    value: null
                },
                'y-axis': {
                    index: '4_2_2_2',
                    value: null
                },
                'z-axis': {
                    index: '4_2_2_3',
                    value: null
                },
                acquired_time: {
                    index: '4_2_2_4',
                    value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                }
            });
        });
        test('正常：モノ指定の場合(アプリケーション)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: 'thing',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                }
            });
        });
        test('正常：モノ指定の場合(識別子：ワークフロー)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: [
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '4_1_1',
                    value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '4_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                env: null,
                sourceId: '20200221-1',
                'x-axis': {
                    index: '4_2_2_1',
                    value: null
                },
                'y-axis': {
                    index: '4_2_2_2',
                    value: null
                },
                'z-axis': {
                    index: '4_2_2_3',
                    value: null
                },
                acquired_time: {
                    index: '4_2_2_4',
                    value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                }
            });
        });
        test('正常：モノ指定の場合(識別子：アプリケーション)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: null,
                        identifier: [
                            'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                }
            });
        });
        test('正常：モノ指定の場合(対象データなし)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'XXXXX',
                        type: 'thing',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('パラメータ異常：body JSON不正', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send('{ XXXX: }');

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('リクエストボディにエラー、JSONへの変換に失敗しました');
        });
        test('パラメータ異常：body 空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send('');

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ異常：userId パラメータなし', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：userId null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: null,
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：userId 空文字', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: '',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：type, identifier パラメータなし', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IS_DEFINED_TYPE_IDENTIFIER);
        });
        test('パラメータ異常：type, identifier null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IS_DEFINED_TYPE_IDENTIFIER);
        });
        test('パラメータ異常：type, identifier 空文字', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: '',
                        identifier: [
                            ''
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(2);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
            expect(response.body.reasons[1].property).toBe('type');
            expect(response.body.reasons[1].message).toBe(Message.validation.matches);
        });
        test('パラメータ異常：type 指定文字列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'test',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.matches);
        });
        test('パラメータ異常：identifier 配列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: 'XXXXX',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('identifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ異常：identifier null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: [
                            null
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IS_DEFINED_TYPE_IDENTIFIER);
        });
        test('パラメータ異常：identifier 空文字', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: null,
                        identifier: [
                            ''
                        ],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IS_DEFINED_TYPE_IDENTIFIER);
        });
        test('パラメータ異常：任意パラメータなし', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
                id: {
                    index: '2_1_1',
                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                },
                code: {
                    index: '2_1_2',
                    value: {
                        _value: 1000008,
                        _ver: 1
                    }
                },
                createAt: {
                    index: '2_2_1',
                    value: '2020-02-20T00:00:00.000+0900'
                },
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('パラメータ異常：updatedAt オブジェクト以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: 'XXXXX',
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('updatedAt');
            expect(response.body.reasons[0].message).toBe(Message.validation.nestedValidation);
        });
        test('パラメータ異常：updatedAt 不正なオブジェクト', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            XXXXX: '2020-01-01T00:00:00.000+0900',
                            YYYYY: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(2);
            expect(response.body.reasons[0].property).toBe('start');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
            expect(response.body.reasons[1].property).toBe('end');
            expect(response.body.reasons[1].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：updatedAt 不正な日時', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00',
                            end: '2020-12-31T00:00:00'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(2);
            expect(response.body.reasons[0].property).toBe('start');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
            expect(response.body.reasons[1].property).toBe('end');
            expect(response.body.reasons[1].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常：_code 配列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: 'XXXXX',
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('_code');
            expect(response.body.reasons[0].message).toBe(Message.validation.nestedValidation);
        });
        test('パラメータ異常：_code 不正なオブジェクト', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                XXXXX: 1000008,
                                YYYYY: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(2);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
            expect(response.body.reasons[1].property).toBe('_ver');
            expect(response.body.reasons[1].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：_code 文字列', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 'XXXXX',
                                _ver: 'XXXXX'
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(2);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
            expect(response.body.reasons[1].property).toBe('_ver');
            expect(response.body.reasons[1].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：wf 不正なオブジェクト', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            XXXXX: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：wf 文字列', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 'XXXXX'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：app 不正なオブジェクト', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id2',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            XXXXX: 1000007
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：app 文字列', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: {
                            _value: 'XXXXX'
                        },
                        wf: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons.length).toBe(1);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
    });
});
