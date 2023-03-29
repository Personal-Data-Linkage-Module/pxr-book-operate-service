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
import StubOperatorServer from './StubOperatorServer';
import StubCTokenServer from './StubCTokenServer';
import Config from '../common/Config';
import urljoin = require('url-join');
const Message = Config.ReadConfig('./config/message.json');

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
                        url: 'https://',
                        useService: false,
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

// スタブサーバ(カタログサービス)
let _catalogServer: StubCatalogServer = null;

// スタブサーバー（オペレータサービス）
let _operatorServer: StubOperatorServer = null;

// スタブサーバー（Local-CTokenサービス）
let _ctokenServer: StubCTokenServer = null;

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
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
        if (_operatorServer) {
            _operatorServer._server.close();
            _operatorServer = null;
        }
        if (_ctokenServer) {
            _ctokenServer._server.close();
            _ctokenServer = null;
        }
    });

    /**
     * Document蓄積(Post)
     */
    let documentIdentifer2: string = null;
    let documentIdentifer4: string = null;
    describe('ドキュメント蓄積', () => {
        test('正常：アプリケーションの場合', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            documentIdentifer2 = response.body.id.value;
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 92, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id4');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            documentIdentifer4 = response.body.id.value;
        });
        test('パラメータ異常：全体が空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ不足：id', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id'));
        });
        test('パラメータ不足：id.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id.index'));
        });
        test('パラメータ異常：id.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: null,
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'id.index'));
        });
        test('パラメータ不足：id.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id.value'));
        });
        test('パラメータ異常：id.value、null以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: 'dummy'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_INVALID, 'id', 'null'));
        });
        test('パラメータ不足：code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code'));
        });
        test('パラメータ不足：code.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.index'));
        });
        test('パラメータ異常：code.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: null,
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'code.index'));
        });
        test('パラメータ不足：code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2'
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value'));
        });
        test('パラメータ不足：code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._value'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 'dummy',
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: null,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ不足：code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._ver'));
        });
        test('パラメータ異常：code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 'dummy'
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ異常：code.value._ver、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: null
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ不足：createdAt', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt'));
        });
        test('パラメータ不足：createdAt.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt.index'));
        });
        test('パラメータ異常：createdAt.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: null,
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'createdAt.index'));
        });
        test('パラメータ不足：createdAt.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt.value'));
        });
        test('パラメータ異常：createdAt.value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: null
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'createdAt.value'));
        });
        test('パラメータ不足：sourceId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'sourceId'));
        });
        test('パラメータ異常：sourceId、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: null,
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'sourceId'));
        });
        test('パラメータエラー：wf', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IF_WF_HAS_BEEN_SPECIFIED);
        });

        test('パラメータ不足：app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app'));
        });
        test('パラメータ不足：app.code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code'));
        });
        test('パラメータ不足：app.code.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.index'));
        });
        test('パラメータ異常：app.code.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: null,
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'app.code.index'));
        });
        test('パラメータ不足：app.code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1'
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value'));
        });
        test('パラメータ不足：app.code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 'dummy',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: null,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ不足：app.code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 'dummy'
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.code.value._ver、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: null
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ不足：app.app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app'));
        });
        test('パラメータ不足：app.app.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.index'));
        });
        test('パラメータ異常：app.app.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: null,
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'app.app.index'));
        });
        test('パラメータ不足：app.app.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5'
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value'));
        });
        test('パラメータ不足：app.app.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 'dummy',
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: null,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ不足：app.app.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._ver'));
        });
        test('パラメータ異常：app.app.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 'dummy'
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ異常：app.app.value._ver、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: null
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ異常：chapter、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: 'dummy'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter'));
        });
        test('パラメータ異常：chapter、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter'));
        });
        test('パラメータ異常：chapter.event、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.event'));
        });
        test('パラメータ異常：chapter.event、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: null,
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.event'));
        });
        test('パラメータ異常：chapter.sourceId、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: '202108-1-1'
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.sourceId'));
        });
        test('パラメータ異常：chapter.sourceId、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: null
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.sourceId'));
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：利用者IDがMy-Condition-Bookに存在しない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_idXXX');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：ドキュメントに追加する対象イベントのCmatrixイベントレコードが存在しない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = true
                ;
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答400系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 400);

            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = false
                ;
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答500系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 500);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答204)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 204);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CTOKEN_POST);
        });
    });
    /**
     * ソースIDによるドキュメント更新
     */
    describe('ドキュメントIDによるドキュメント更新', () => {
        test('正常：アプリケーションの場合', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 92, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id4', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：更新対象のドキュメントイベントセットリレーションデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.document_event_set_relation
                    SET is_disabled = true;
                `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：更新対象のイベントセットイベントリレーションデータなし、リクエスト.chapter.sourceIdから登録', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ復活
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.document_event_set_relation
                    SET is_disabled = false;
                `);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.event_set_event_relation
                    SET is_disabled = true;
                `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            },
                            {
                                title: 'イベント識別子',
                                event: [],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：更新対象のイベントセットイベントリレーションデータなし、リクエスト.chapter.eventから登録', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.event_set_event_relation
                    SET is_disabled = true;
                `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: []
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：更新対象のCMatrixドキュメント紐づけテーブルデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ復活
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.event_set_event_relation
                    SET is_disabled = false;
                `);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.cmatrix_2_n_relation
                    SET is_disabled = true;
                `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('パラメータ異常：documentSourceId、空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ復活
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.cmatrix_2_n_relation
                    SET is_disabled = false;
                `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'documentSourceId'));
        });
        test('パラメータ異常：全体が空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ不足：id', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id'));
        });
        test('パラメータ不足：id.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id.index'));
        });
        test('パラメータ異常：id.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: null,
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'id.index'));
        });
        test('パラメータ不足：id.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id.value'));
        });
        test('パラメータ異常：id.value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: null
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'id.value'));
        });
        test('パラメータ不足：code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code'));
        });
        test('パラメータ不足：code.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.index'));
        });
        test('パラメータ異常：code.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: null,
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'code.index'));
        });
        test('パラメータ不足：code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2'
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value'));
        });
        test('パラメータ不足：code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._value'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 'dummy',
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ不足：code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._ver'));
        });
        test('パラメータ異常：code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 'dummy'
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ不足：createdAt', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt'));
        });
        test('パラメータ不足：createdAt.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt.index'));
        });
        test('パラメータ異常：createdAt.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: null,
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'createdAt.index'));
        });
        test('パラメータ不足：createdAt.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'createdAt.value'));
        });
        test('パラメータ異常：createdAt.value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: null
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'createdAt.value'));
        });
        test('パラメータ不足：sourceId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'sourceId'));
        });
        test('パラメータ異常：sourceId、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: null,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'sourceId'));
        });
        test('パラメータ不足：app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app'));
        });
        test('パラメータ不足：app.code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code'));
        });
        test('パラメータ不足：app.code.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.index'));
        });
        test('パラメータ異常：app.code.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: null,
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'app.code.index'));
        });
        test('パラメータ不足：app.code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1'
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value'));
        });
        test('パラメータ不足：app.code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 'dummy',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: null,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ不足：app.code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 'dummy'
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.code.value._ver、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: null
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ不足：app.app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app'));
        });
        test('パラメータ不足：app.app.index', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.index'));
        });
        test('パラメータ異常：app.app.index、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: null,
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'app.app.index'));
        });
        test('パラメータ不足：app.app.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5'
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value'));
        });
        test('パラメータ不足：app.app.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 'dummy',
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._value、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: null,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ不足：app.app.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._ver'));
        });
        test('パラメータ異常：app.app.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 'dummy'
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ異常：app.app.value._ver、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: null
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ異常：chapter、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: 'dummy'
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter'));
        });
        test('パラメータ異常：chapter、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: null
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter'));
        });
        test('パラメータ異常：chapter.event、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.event'));
        });
        test('パラメータ異常：chapter.event、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: null,
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.event'));
        });
        test('パラメータ異常：chapter.sourceId、Array以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: '202108-1-1'
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.sourceId'));
        });
        test('パラメータ異常：chapter.sourceId、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: null
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_ARRAY_PARAM, 'chapter.sourceId'));
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id4', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            const url = urljoin(Url.baseURI, 'document', 'test_user_id3', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer4
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：対象ドキュメントデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_idxxx', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：対象ドキュメントデータが1件より多い', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // テストデータを追加
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.document
                (
                    my_condition_book_id, source_id, doc_identifier,
                    doc_catalog_code, doc_catalog_version,
                    doc_create_at,
                    doc_actor_code, doc_actor_version,
                    wf_catalog_code, wf_catalog_version,
                    wf_role_code, wf_role_version, wf_staff_identifier,
                    app_catalog_code, app_catalog_version,
                    template,
                    attributes, is_disabled, created_by, created_at, updated_by, updated_at)
                VALUES
                (
                    2, '202108-1', 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0',
                    1000008, 1,
                    '2020-02-20 00:00:00',
                    1000004, 1,
                    null, null,
                    null, null, null,
                    1001007, 1,
                    '{"id":{"index":"2_1_1","value":"doc-4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"2_1_2","value":{"_value":1000008,"_ver":1}},"createdAt":{"index":"2_2_1","value":"2020-02-20T00:00:00.000+0900"},"chapter":[{"title":"タイトル１","event":["event-4f75161a-449a-4839-be6a-4cc577b8a8d0"]}]}',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);
            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(id)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // テストデータを削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.document
                SET
                    is_disabled = true
                WHERE
                    doc_identifier = 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                ;
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: 'dummy'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'id'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(code.value._value)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 8888888,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'code'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(code.value._ver)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 899
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'code'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(app.code.value._value)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1771777,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.code'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(app.code.value._ver)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 178
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.code'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(app.app.value._value)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1771771,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.app'));
        });
        test('異常：リクエストデータ、ドキュメントデータの不整合(app.app.value._ver)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000007,
                                    _ver: 111
                                }
                            }
                        },
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.app'));
        });
        test('異常：ドキュメントに追加する対象イベントのCmatrixイベントレコードが存在しない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.cmatrix_event
                    SET
                        is_disabled = true
                    `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：更新対象のCMatrix2(n)データなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ削除
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.cmatrix_2_n
                    SET
                        is_disabled = true
                    `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：更新対象のCMatrix2(n)データが1件より多い', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 対象データ復活
            await common.executeSqlString(`
                    UPDATE pxr_book_operate.cmatrix_2_n
                    SET
                        is_disabled = false
                    `);

            // テストデータを追加
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.cmatrix_2_n
                (
                    _1_1, _1_2_1, _1_2_2,
                    _2_1,
                    _3_1_1, _3_1_2,
                    _3_2_1, _3_2_2,
                    _3_3_1, _3_3_2, _3_4,
                    _3_5_1, _3_5_2,
                    is_disabled, created_by, created_at, updated_by, updated_at)
                VALUES
                (
                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 1000008, 1,
                    '2020-02-21 00:00:00',
                    1000004, 1,
                    1000007, 1,
                    1000005, 1, 'staffId',
                    null, null,
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答400系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 400);

            // 対象データ復活
            await common.executeSqlString(`
            UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = false
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答500系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 500);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答204)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 204);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CTOKEN_POST);
        });
    });
    /**
     * ドキュメント更新
     */
    describe('ドキュメント更新', () => {
        test('正常：アプリケーションの場合', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: null,
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('パラメータ不足：documentId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000117,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'wf01'
                            }
                        },
                        app: null,
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'documentIdentifer'));
        });
        test('異常：対象ドキュメントデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_idxxx', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：対象ドキュメントデータが1件より多い', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // テストデータ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.document
                SET
                    is_disabled = false
                WHERE
                    doc_identifier = 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                ;
            `);
            // テストデータを追加
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.document
                (
                    my_condition_book_id, source_id, doc_identifier,
                    doc_catalog_code, doc_catalog_version,
                    doc_create_at,
                    doc_actor_code, doc_actor_version,
                    wf_catalog_code, wf_catalog_version,
                    wf_role_code, wf_role_version, wf_staff_identifier,
                    app_catalog_code, app_catalog_version,
                    template,
                    attributes, is_disabled, created_by, created_at, updated_by, updated_at)
                VALUES
                (
                    1, '202108-1', 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                    1000008, 1,
                    '2020-02-20 00:00:00',
                    1000004, 1,
                    1000007, 1,
                    1000005, 1, 'staffId',
                    null, null,
                    '{"id":{"index":"2_1_1","value":"doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"2_1_2","value":{"_value":1000008,"_ver":1}},"createdAt":{"index":"2_2_1","value":"2020-02-20T00:00:00.000+0900"},"chapter":[{"title":"タイトル１","event":["event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"]}]}',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '2_1_1',
                            value: documentIdentifer2
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20T00:00:00.000+0900'
                        },
                        sourceId: '202108-1',
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
                        userId: {
                            index: '2_4_1',
                            value: '123456789'
                        },
                        chapter: [
                            {
                                title: 'イベント識別子',
                                event: [
                                    'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                ],
                                sourceId: [
                                    '202108-1-1'
                                ]
                            }
                        ]
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
    });
    /**
    * ソースIDによるドキュメント削除
    */
    describe('ドキュメント削除', () => {
        test('パラメータ異常：documentSourceId、空', async () => {
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'documentSourceId'));
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：対象ドキュメントデータなし', async () => {
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_idxxx', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答400系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 400);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答500系)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 500);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービスエラー応答204)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 204);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：セッション(Local-CTokenサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CTOKEN_POST);
        });
        test('正常：アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id2', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id4', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
    });
    /**
     * ドキュメント削除
     */
    describe('ドキュメント削除', () => {
        test('異常：documentIdが空', async () => {
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'documentIdentifer'));
        });
        test('異常：対象データなし', async () => {
            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_idXXX', documentIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
    });
    test('正常：アプリケーションの場合', async () => {
        _catalogServer = new StubCatalogServer(3001, 1000006, 200);
        _ctokenServer = new StubCTokenServer(3009, 200);

        // テストデータを追加 (蓄積正常系：アプリケーション)
        const testUrl = urljoin(Url.baseURI, 'document', 'test_user_id2');
        const testResponse = await supertest(expressApp).post(testUrl)
            .set({ accept: 'application/json', 'Content-Type': 'application/json' })
            .set({ session: JSON.stringify(Session.application) })
            .send(JSON.stringify({ id: { index: '2_1_1', value: null }, code: { index: '2_1_2', value: { _value: 1000008, _ver: 1 } }, createdAt: { index: '2_2_1', value: '2020-02-20T00:00:00.000+0900' }, sourceId: '202108-1', wf: null, app: { code: { index: '2_3_1', value: { _value: 1000117, _ver: 1 } }, app: { index: '2_3_5', value: { _value: 1000007, _ver: 1 } } }, userId: { index: '2_4_1', value: '123456789' }, chapter: [{ title: 'イベント識別子', event: ['event-4f75161a-449a-4839-be6a-4cc577b8a8d0'], sourceId: ['202108-1-1'] }] }
            ));
        documentIdentifer2 = testResponse.body.id.value;

        // 送信データを生成
        const url = urljoin(Url.baseURI, 'document', 'test_user_id2', documentIdentifer2);

        // 対象APIに送信
        const response = await supertest(expressApp).delete(url)
            .set({ session: JSON.stringify(Session.application) })
            .send();

        // レスポンスチェック
        expect(response.status).toBe(200);
    });
});
