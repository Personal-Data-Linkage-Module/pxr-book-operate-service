/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import Config from '../common/Config';
import { StubOperatorServerType0 } from './StubOperatorServer';
import StubBookManageServer from './StubBookManageServer';
import StubProxyServer from './StubProxyServer';
import StubCatalogServer from './StubCatalogServer';
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServerType0 = null;
let _bookManageServer: StubBookManageServer = null;
let _proxyServer: StubProxyServer = null;
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
        await common.executeSqlFile('initialDocumentDataForShare.sql');
        await common.executeSqlFile('initialDocumentData.sql');
        await common.executeSqlFile('initialEventData.sql');
        await common.executeSqlFile('initialThingData.sql');
        await common.executeSqlFile('initialDocumentRelationData.sql');
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
        if (_bookManageServer) {
            _bookManageServer._server.close();
            _bookManageServer = null;
        }
        if (_proxyServer) {
            _proxyServer._server.close();
            _proxyServer = null;
        }
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
    });

    /**
     * データ共有(外部蓄積機能OFF)
     */
    describe('データ共有(外部蓄積機能OFF)', () => {
        test('正常：一時的データ共有コード指定(ドキュメント指定 + イベント指定app + モノ指定app)', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: {
                            _value: 1000007
                        },
                        wf: null,
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                document: [
                    {
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
                        sourceId: '202108-1-1',
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
                        wf: null,
                        chapter: [
                            {
                                title: 'タイトル２',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            },
                            {
                                title: 'タイトル３',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            },
                            {
                                title: 'タイトル４',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
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
                        sourceId: '202108-1-1',
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
                                    index: '4_1_1',
                                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '202108-1',
                                env: null,
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
                            },
                            {
                                id: {
                                    index: '4_1_1',
                                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '20200221-1',
                                env: null,
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
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        id: {
                            index: '4_1_1',
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '202108-1',
                        env: null,
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
                    },
                    {
                        id: {
                            index: '4_1_1',
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '20200221-1',
                        env: null,
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
                    }
                ]
            });
        });
        test('正常：ドキュメント指定 + イベント指定app + モノ指定app', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user2',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                            'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                            'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        ],
                        logIdentifier: '1',
                        app: {
                            _value: 1000007
                        },
                        wf: null,
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                document: [
                    {
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
                        sourceId: '202108-1-1',
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
                        wf: null,
                        chapter: [
                            {
                                title: 'タイトル２',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            },
                            {
                                title: 'タイトル３',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            },
                            {
                                title: 'タイトル４',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1',
                                    '202108-1-1',
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
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
                        sourceId: '202108-1-1',
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
                                    index: '4_1_1',
                                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '202108-1',
                                env: null,
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
                            },
                            {
                                id: {
                                    index: '4_1_1',
                                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '20200221-1',
                                env: null,
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
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        id: {
                            index: '4_1_1',
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '202108-1',
                        env: null,
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
                    },
                    {
                        id: {
                            index: '4_1_1',
                            value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '20200221-1',
                        env: null,
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
                    }
                ]
            });
        });
        test('正常：ドキュメントid指定、イベントなし', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
                            app: null,
                            wf: {
                                code: {
                                    index: '2_3_1',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                wf: {
                                    index: '2_3_2',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                role: {
                                    index: '2_3_3',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                staffId: {
                                    index: '2_3_4',
                                    value: null
                                }
                            },
                            chapter: [
                                {
                                    title: 'タイトル１',
                                    event: [
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                    ],
                                    sourceId: ['202108-1-1']
                                }
                            ]
                        }
                    ],
                    event: null,
                    thing: null
                }
            ));
        });
        test('正常：ドキュメントid指定、イベントid指定、モノ無し', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
                            app: null,
                            wf: {
                                code: {
                                    index: '2_3_1',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                wf: {
                                    index: '2_3_2',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                role: {
                                    index: '2_3_3',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                staffId: {
                                    index: '2_3_4',
                                    value: null
                                }
                            },
                            chapter: [
                                {
                                    title: 'タイトル１',
                                    event: [
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                    ],
                                    sourceId: ['202108-1-1']
                                }
                            ]
                        }
                    ],
                    event: [
                        {
                            id: {
                                index: '3_1_1',
                                value: 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
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
                            sourceId: '202108-1-1',
                            env: null,
                            app: null,
                            wf: {
                                code: {
                                    index: '3_5_1',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                wf: {
                                    index: '3_5_2',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                },
                                role: {
                                    index: '3_5_3',
                                    value: {
                                        _value: null,
                                        _ver: null
                                    }
                                }
                            },
                            thing: [
                                {
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
                                    sourceId: '202108-1',
                                    env: null,
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
                                },
                                {
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
                                    sourceId: '20200221-1',
                                    env: null,
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
                                }
                            ]
                        }
                    ],
                    thing: null
                }
            ));
        });
        test('正常：dest.actorが設定されている', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user2',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        wf: null,
                        app: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1000400
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
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
                            wf: null,
                            chapter: [
                                {
                                    title: 'タイトル２',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル３',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル４',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                }
                            ]
                        }
                    ],
                    event: [
                        {
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
                            sourceId: '202108-1-1',
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
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '202108-1',
                                    env: null,
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
                                },
                                {
                                    id: {
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '20200221-1',
                                    env: null,
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
                                }
                            ]
                        }
                    ],
                    thing: [
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '202108-1',
                            env: null,
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
                        },
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '20200221-1',
                            env: null,
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
                        }
                    ]
                }
            ));
        });
        test('正常：共有定義に設定されているデータ種とリクエストのデータ種が一致しない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user2',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        wf: null,
                        app: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1000401
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
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
                            wf: null,
                            chapter: [
                                {
                                    title: 'タイトル２',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル３',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル４',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                }
                            ]
                        }
                    ],
                    event: [
                        {
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
                            sourceId: '202108-1-1',
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
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '202108-1',
                                    env: null,
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
                                },
                                {
                                    id: {
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '20200221-1',
                                    env: null,
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
                                }
                            ]
                        }
                    ],
                    thing: [
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '202108-1',
                            env: null,
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
                        },
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '20200221-1',
                            env: null,
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
                        }
                    ]
                }
            ));
        });
        test('正常：共有定義にデータ種が設定されていない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user2',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        wf: null,
                        app: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1000403
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
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
                            wf: null,
                            chapter: [
                                {
                                    title: 'タイトル２',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル３',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル４',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                }
                            ]
                        }
                    ],
                    event: [
                        {
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
                            sourceId: '202108-1-1',
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
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '202108-1',
                                    env: null,
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
                                },
                                {
                                    id: {
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '20200221-1',
                                    env: null,
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
                                }
                            ]
                        }
                    ],
                    thing: [
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '202108-1',
                            env: null,
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
                        },
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '20200221-1',
                            env: null,
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
                        }
                    ]
                }
            ));
        });
        test('正常：共有定義の配列が空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user2',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        wf: null,
                        app: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1000404
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: [
                        {
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
                            sourceId: '202108-1-1',
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
                            wf: null,
                            chapter: [
                                {
                                    title: 'タイトル２',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル３',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                },
                                {
                                    title: 'タイトル４',
                                    event: [
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                                        'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                        'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    ],
                                    sourceId: [
                                        '202108-1-1',
                                        '202108-1-1',
                                        '202108-1-1'
                                    ]
                                }
                            ]
                        }
                    ],
                    event: [
                        {
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
                            sourceId: '202108-1-1',
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
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '202108-1',
                                    env: null,
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
                                },
                                {
                                    id: {
                                        index: '4_1_1',
                                        value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                    },
                                    code: {
                                        index: '4_1_2',
                                        value: {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    },
                                    sourceId: '20200221-1',
                                    env: null,
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
                                }
                            ]
                        }
                    ],
                    thing: [
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '202108-1',
                            env: null,
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
                        },
                        {
                            id: {
                                index: '4_1_1',
                                value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            sourceId: '20200221-1',
                            env: null,
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
                        }
                    ]
                }
            ));
        });
        test('正常：取得したデータが空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: [],
                        dest: {
                            actor: 1000403
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: null,
                    event: null,
                    thing: null
                }
            ));
        });
        test('異常：対象データなし', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 2000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 2000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 2000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(
                {
                    document: null,
                    event: null,
                    thing: null
                }
            ));
        });
        test('異常：Book管理から400エラー', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(400);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(400);
        });
        test('異常：Book管理から500系エラー', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(503);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(503);
        });
        test('異常：Book管理から200以外エラー', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(401);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(401);
        });
        test('異常：Book管理に接続できない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_BOOK_LIST);
            expect(response.status).toBe(503);
        });

        test('異常：アクターカタログがappでない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1000432
                        }
                    }));

            // レスポンスチェック
            expect(response.body.message).toBe(Message.ACTOR_CATALOG_INVALID);
            expect(response.status).toBe(400);
        });

        test('異常：dest.actorに設定されたアクターが取得できない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _catalogServer = new StubCatalogServer(3001, -1, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        dest: {
                            actor: 1
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_CATALOG_GET);
        });
        test('パラメータ異常：body JSON不正', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify('a'));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('リクエストボディにエラー、JSONへの変換に失敗しました');
        });
        test('パラメータ異常：body 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ異常：userId 文字列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: ['test_user1'],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ異常：tempShareCode 文字列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: ['fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'],
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ異常：identifier 配列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：logIdentifier', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：logIdentifier 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：logIdentifier null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: null,
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：logIdentifier 文字列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: ['1'],
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足：updatedAt.start ', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：updatedAt.start 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：updatedAt.start 日付以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020010100000000000900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足：updatedAt.end ', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：updatedAt.end 日付以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023010100000000000900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ不足：app._value', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: {
                        },
                        wf: null,
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：app._value 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: {
                            _value: 'dummy'
                        },
                        wf: null,
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：document[]._value 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._value null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._value 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：document[]._ver 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._ver null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: null
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._ver 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 'dummy'
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event[]._value 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._value null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._value 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event[]._ver 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._ver null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: null
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._ver 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 'dummy'
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing[]._value 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._value null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._value 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing[]._ver 空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._ver null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: null
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._ver 数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000008,
                                _ver: 'dummy'
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + ''])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、Book管理サービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(204, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、Book管理サービス応答400系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(400, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：Cookie使用、Book管理サービス応答500系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(503, 2);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：Cookie使用、Book管理サービス未起動', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：Book管理サービスからBook一覧が取得できない', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user1',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2023-01-01T00:00:00.000+0900'
                        },
                        identifier: [
                            'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        app: null,
                        wf: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('bookが存在しません');
        });
    });
});
