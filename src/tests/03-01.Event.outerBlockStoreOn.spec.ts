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

// スタブサーバー（カタログサービス）
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
     * イベント蓄積
     */
    let eventIdentifer2: string = null;
    let eventIdentifer4: string = null;
    describe('イベント蓄積', () => {
        test('正常：アプリケーションの場合', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            eventIdentifer2 = response.body.id.value;
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 2);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id4');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        end: {
                            index: '3_2_2',
                            value: null
                        },
                        location: {
                            index: '3_3_1',
                            value: null
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            eventIdentifer4 = response.body.id.value;
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }

                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }

                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(catalogItemがnull)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 2, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotCreateBook) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：利用者IDがMy-Condition-Bookに存在しない', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_idXXX');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('パラメータ異常：全体が空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ異常：id、null以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: 'dummy'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_INVALID, 'id', 'null'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 'dummy',
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: false,
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 'dummy'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ異常：app.code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 'dummy',
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 'dummy'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.app.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                    _value: 'dummy',
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                    _ver: 'dummy'
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ不足：userId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = Url.eventURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
        });
        test('パラメータ不足：id', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id'));
        });
        test('パラメータ不足：code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code'));
        });
        test('パラメータ不足：code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value'));
        });
        test('パラメータ不足：code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._value'));
        });
        test('パラメータ不足：code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._ver'));
        });
        test('パラメータ不足：start', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21T00:00:00.000+0900'
                        },
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'start'));
        });
        test('パラメータ不足：end', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'end'));
        });
        test('パラメータ不足：location', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'location'));
        });
        test('パラメータ不足：sourceId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'sourceId'));
        });
        test('パラメータ不足：env', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'env'));
        });
        test('パラメータ不足：app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app'));
        });
        test('パラメータエラー：wf', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.IF_WF_HAS_BEEN_SPECIFIED);
        });
        test('パラメータ不足：app.code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code'));
        });
        test('パラメータ不足：app.code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value'));
        });
        test('パラメータ不足：app.code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._value'));
        });
        test('パラメータ不足：app.code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._ver'));
        });
        test('パラメータ不足：app.app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app'));
        });
        test('パラメータ不足：app.app.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                index: '3_5_5'
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value'));
        });
        test('パラメータ不足：app.app.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._value'));
        });
        test('パラメータ不足：app.app.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                    _value: 1000007
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._ver'));
        });
        test('パラメータ不足：thing', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'thing'));
        });
    });

    /**
     * イベント更新
     */
    describe('イベント更新', () => {
        test('正常：アプリケーションの場合、モノデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：アプリケーションの場合、モノデータあり', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：モノデータあり、かつCmatrixデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = true
                WHERE
                    "1_1" = 'test_user_id1'
                AND "3_1_1" = '${eventIdentifer2}'
                ;
            `);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id4', eventIdentifer4);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer4
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
                            value: null
                        },
                        end: {
                            index: '3_2_2',
                            value: null
                        },
                        location: {
                            index: '3_3_1',
                            value: null
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(catalogItemがnull)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 2, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotCreateBook) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：対象イベントデータなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_idXXX', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：リクエストデータ、イベントデータの不整合(id)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: 'dummy'
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
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'id'));
        });
        test('異常：リクエストデータ、イベントデータの不整合(code)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 99999,
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
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'code'));
        });
        test('異常：リクエストデータ、イベントデータの不整合(app.code)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                                    _value: 99999,
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.code'));
        });
        test('異常：リクエストデータ、イベントデータの不整合(app.app)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'app.app'));
        });
        test('パラメータ異常：全体が空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ異常：id、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'id'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 'dummy',
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
                            value: null
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: false,
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
                            value: null
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 'dummy'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ異常：app.code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 'dummy',
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 'dummy'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.app.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _value: 'dummy',
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _ver: 'dummy'
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ不足：userId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = Url.eventURI;

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
        });
        test('パラメータ不足：eventIdentifer', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'eventIdentifer'));
        });
        test('パラメータ不足：id', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id'));
        });
        test('パラメータ不足：code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code'));
        });
        test('パラメータ不足：code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value'));
        });
        test('パラメータ不足：code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._value'));
        });
        test('パラメータ不足：code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._ver'));
        });
        test('パラメータ不足：start', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21T00:00:00.000+0900'
                        },
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'start'));
        });
        test('パラメータ不足：end', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'end'));
        });
        test('パラメータ不足：location', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'location'));
        });
        test('パラメータ不足：sourceId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'sourceId'));
        });
        test('パラメータ不足：env', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'env'));
        });
        test('パラメータ不足：app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app'));
        });
        test('パラメータ不足：app.code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code'));
        });
        test('パラメータ不足：app.code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value'));
        });
        test('パラメータ不足：app.code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._value'));
        });
        test('パラメータ不足：app.code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._ver'));
        });
        test('パラメータ不足：app.app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app'));
        });
        test('パラメータ不足：app.app.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                index: '3_5_5'
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value'));
        });
        test('パラメータ不足：app.app.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._value'));
        });
        test('パラメータ不足：app.app.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _value: 1000007
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._ver'));
        });
        test('パラメータ不足：thing', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'thing'));
        });
    });

    /**
     * ソースIDによるイベント更新
     */
    describe('ソースIDによるイベント更新', () => {
        test('正常：アプリケーションの場合', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id4', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer4
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
                            value: null
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
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(セッション内にアクターコードなし)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(catalogItemがnull)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 2, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotCreateBook) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('パラメータ異常：eventSourceId、空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'eventSourceId'));
        });
        test('パラメータ異常：id、null', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: null
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'id'));
        });
        test('パラメータ異常：code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 'dummy',
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._value'));
        });
        test('パラメータ異常：code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 'dummy'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
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
                                    _value: 99999,
                                    _ver: 1
                                }
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'code.value._ver'));
        });
        test('パラメータ異常：app.code.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 'dummy',
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._value'));
        });
        test('パラメータ異常：app.code.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 'dummy'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.code.value._ver'));
        });
        test('パラメータ異常：app.app.value._value、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _value: 'dummy',
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._value'));
        });
        test('パラメータ異常：app.app.value._ver、数値以外', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _ver: 'dummy'
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NUMBER_INVALID, 'app.app.value._ver'));
        });
        test('パラメータ不足：userId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = Url.eventURI;

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(404);
        });
        test('パラメータ不足：id', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'id'));
        });
        test('パラメータ不足：code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code'));
        });
        test('パラメータ不足：code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2'
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value'));
        });
        test('パラメータ不足：code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._value'));
        });
        test('パラメータ不足：code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'code.value._ver'));
        });
        test('パラメータ不足：start', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000008,
                                _ver: 1
                            }
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21T00:00:00.000+0900'
                        },
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'start'));
        });
        test('パラメータ不足：end', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        location: {
                            index: '3_3_1',
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'end'));
        });
        test('パラメータ不足：location', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'location'));
        });
        test('パラメータ不足：sourceId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'sourceId'));
        });
        test('パラメータ不足：env', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'env'));
        });
        test('パラメータ不足：app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app'));
        });
        test('パラメータ不足：app.code', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code'));
        });
        test('パラメータ不足：app.code.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1'
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value'));
        });
        test('パラメータ不足：app.code.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._value'));
        });
        test('パラメータ不足：app.code.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004
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
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.code.value._ver'));
        });
        test('パラメータ不足：app.app', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app'));
        });
        test('パラメータ不足：app.app.value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                index: '3_5_5'
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value'));
        });
        test('パラメータ不足：app.app.value._value', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _ver: 1
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._value'));
        });
        test('パラメータ不足：app.app.value._ver', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
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
                                    _value: 1000007
                                }
                            }
                        },
                        wf: null,
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        },
                        thing: []
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'app.app.value._ver'));
        });
        test('パラメータ不足：thing', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
                    {
                        id: {
                            index: '3_1_1',
                            value: eventIdentifer2
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
                            value: null
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000004,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 1000005,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '3_5_4',
                                value: 'staffId'
                            }
                        },
                        userId: {
                            index: '3_6_1',
                            value: '123456789'
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'thing'));
        });
    });

    /**
     * イベント削除
     */
    describe('イベント削除', () => {
        test('正常：アプリケーションの場合', async () => {
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.application) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id4', eventIdentifer4);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：対象データなし', async () => {
            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_idXXX', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(catalogItemがnull)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 2, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotCreateBook) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', eventIdentifer2);

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('パラメータ不足：userId', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = Url.eventURI;

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(404);
        });
        test('パラメータ不足：eventIdentifer', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.NO_PARAM, 'eventIdentifer'));
        });
    });

    /**
     * ソースIDによるイベント削除
     */
    describe('ソースIDによるイベント削除', () => {
        test('正常：アプリケーションの場合', async () => {
            _ctokenServer = new StubCTokenServer(3009, 200);

            // テストデータを追加
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.event
                (
                    my_condition_book_id, source_id, event_identifier,
                    event_catalog_code, event_catalog_version,
                    event_start_at, event_end_at, event_outbreak_position,
                    event_actor_code, event_actor_version,
                    wf_catalog_code, wf_catalog_version,
                    wf_role_code, wf_role_version, wf_staff_identifier,
                    app_catalog_code, app_catalog_version,
                    template,
                    attributes, is_disabled, created_by,
                    created_at, updated_by, updated_at
                )
                VALUES
                (
                    2, '20200221-1', '4f75161a-449a-4839-be6a-4cc577b8a8d0',
                    1000008, 1,
                    '2020-02-20 00:00:00', '2020-02-21 00:00:00', null,
                    1000004, 1,
                    null, null,
                    null, null, null,
                    1000007, 1,
                    '{"id":{"index":"3_1_1","value":"4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
                INSERT INTO pxr_book_operate.cmatrix_event
                (
                    "1_1", "1_2", "1_3",
                    "3_1_1", "3_1_2_1", "3_1_2_2",
                    "3_2_1", "3_2_2",
                    "3_3_1",
                    "3_5_1_1", "3_5_1_2", "3_5_2_1", "3_5_2_2", "3_5_3_1", "3_5_3_2", "3_5_4", "3_5_5_1", "3_5_5_2",
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'test_user_id2', null, null,
                    '4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
                    '2020-01-01 00:00:00', '2030-12-31 23:59:59',
                    null,
                    1000004, 1, null, null, null, null, null, 1000007, 1,
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.application) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('正常：Cookie使用, アプリケーション', async () => {
            // テストデータを追加
            await common.executeSqlString(`
                INSERT INTO pxr_book_operate.event
                (
                    my_condition_book_id, source_id, event_identifier,
                    event_catalog_code, event_catalog_version,
                    event_start_at, event_end_at, event_outbreak_position,
                    event_actor_code, event_actor_version,
                    wf_catalog_code, wf_catalog_version,
                    wf_role_code, wf_role_version, wf_staff_identifier,
                    app_catalog_code, app_catalog_version,
                    template,
                    attributes, is_disabled, created_by,
                    created_at, updated_by, updated_at
                )
                VALUES
                (
                    4, '20200221-1', '4f75161a-449a-4839-be6a-4cc577b8a8d0',
                    1000008, 1,
                    '2020-02-20 00:00:00', '2020-02-21 00:00:00', null,
                    1000004, 1,
                    null, null,
                    null, null, null,
                    1000007, 1,
                    '{"id":{"index":"3_1_1","value":"4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
                INSERT INTO pxr_book_operate.cmatrix_event
                (
                    "1_1", "1_2", "1_3",
                    "3_1_1", "3_1_2_1", "3_1_2_2",
                    "3_2_1", "3_2_2",
                    "3_3_1",
                    "3_5_1_1", "3_5_1_2", "3_5_2_1", "3_5_2_2", "3_5_3_1", "3_5_3_2", "3_5_4", "3_5_5_1", "3_5_5_2",
                    is_disabled, created_by, created_at, updated_by, updated_at
                )
                VALUES
                (
                    'test_user_id4', null, null,
                    '4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
                    '2020-01-01 00:00:00', '2030-12-31 23:59:59',
                    null,
                    1000004, 1, null, null, null, null, null, 1000007, 1,
                    false, 'pxr_user', NOW(), 'pxr_user', NOW()
                );
            `);
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 2);
            _ctokenServer = new StubCTokenServer(3009, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id4', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(200);
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 0);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(200, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(204, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(401, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(404, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);
            _operatorServer = new StubOperatorServer(500, 1);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

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
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotActor) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(catalogItemがnull)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 2, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.errorNotCreateBook) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send();

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('パラメータ異常：eventSourceId、空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id1', '?eventSourceId=');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.STRING_INVALID, 'eventSourceId'));
        });
    });
});
