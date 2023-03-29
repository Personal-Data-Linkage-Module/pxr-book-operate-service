/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { StubOperatorServerType0 } from './StubOperatorServer';
import StubBookManageServer from './StubBookManageServer';
import StubProxyServer from './StubProxyServer';
import StubOutsideStoreServer from './StubOutsideStoreServer';
import StubCatalogServer from './StubCatalogServer';

jest.mock('../common/Config', () => ({
    ...jest.requireActual('../common/Config') as any,
    default: {
        ReadConfig: jest.fn((path: string) => {
            const fs = require('fs');
            if (path === './config/config.json') {
                return {
                    operatorUrl: 'http://localhost:3000/operator',
                    catalogUrl: 'http://localhost:3001/catalog',
                    bookManageUrl: 'http://localhost:3005/book-manage',
                    notificationUrl: 'http://localhost:3004/notification',
                    accessControlUrl: 'http://localhost:3015/access-control',
                    ctokenUrl: 'http://localhost:3009/local-ctoken',
                    infoAccountUrl: 'http://localhost:3010/info-account-manage',
                    proxyUrl: 'http://localhost:3003/pxr-block-proxy',
                    auditUrl: 'http://localhost:3017/pxr-audit',
                    dataUtilization: {
                        registPath: '/data-utilization/regist'
                    },
                    outerBlockStore: true,
                    rootBlock: 1000110,
                    passwordDigit: 8,
                    initialPasswordExpire: 7,
                    timezone: 'Asia/Tokyo',
                    outsideStoreSerive: {
                        url: 'http://localhost:3033/outsideStoreService',
                        useService: true,
                        apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                    }
                };
            } else {
                return JSON.parse(fs.readFileSync(path, 'UTF-8'));
            }
        })
    }
}));

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
let _outsideStoreServer: StubOutsideStoreServer = null;
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
        if (_outsideStoreServer) {
            _outsideStoreServer._server.close();
            _outsideStoreServer = null;
        }
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
    });

    /**
     * データ共有
     */
    describe('データ共有(外部蓄積機能使用)', () => {
        test('正常：', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _outsideStoreServer = new StubOutsideStoreServer(200);
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
                        wf: null,
                        app: {
                            _value: 1000007
                        },
                        document: [],
                        event: [],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
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
        test('正常：対象データなし', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _outsideStoreServer = new StubOutsideStoreServer(200);
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
                            'doc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx',
                            'event-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx',
                            'thing-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx'
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
                    document: null,
                    event: null,
                    thing: null
                }
            ));
        });
        test('正常：外部蓄積からの返却データがnull', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _bookManageServer = new StubBookManageServer(200, 2);
            _proxyServer = new StubProxyServer(3003, 200);
            _outsideStoreServer = new StubOutsideStoreServer(200, 1);
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
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                            'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ],
                        logIdentifier: '1',
                        wf: null,
                        app: {
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
                    document: null,
                    event: null,
                    thing: null
                }
            ));
        });
    });
});
