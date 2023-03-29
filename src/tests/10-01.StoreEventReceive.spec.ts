/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import Config from '../common/Config';
import StubOperatorServer from './StubOperatorServer';
import StubCatalogServer from './StubCatalogServer';
import { sprintf } from 'sprintf-js';
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
let getShareRes: any = null;

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
        if (getShareRes) {
            jest.resetAllMocks();
            getShareRes = null;
        }
    });
    describe('蓄積イベント受信API', () => {
        test('正常：アプリケーション（蓄積イベント）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(200);
        });
        test('パラメータ不足：type', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：type、空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: '',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：type、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: null,
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：type、文字列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: true,
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('type');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ異常：type、store-event、share-trigger以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'dummy',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.message).toBe(sprintf(Message.VALUE_NOT_VALID, 'type'));
        });
        test('パラメータ不足：operate', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('operate');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：operator、空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: '',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('operate');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：operator、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: null,
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('operate');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：operator、文字列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: true,
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('operate');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足：userId', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：userId、空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: '',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：userId、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: null,
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：userId、文字列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: true,
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足：identifier', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('identifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：identifier、空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('identifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNotEmpty);
        });
        test('パラメータ異常：identifier、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: null,
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('identifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：identifier、文字列以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: true,
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('identifier');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ不足：document._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: null,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 'a',
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：document._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: null
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 'a'
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：event._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _value: null,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _value: 'a',
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：event._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _value: 1000132
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _value: 1000132,
                        _ver: null
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    event: {
                        _value: 1000132,
                        _ver: 'a'
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：thing._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _value: null,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _value: 'a',
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：thing._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _value: 1000132
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _value: 1000132,
                        _ver: null
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    thing: {
                        _value: 1000132,
                        _ver: 'a'
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：sourceActor', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('sourceActor');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：sourceActor._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceActor._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: null,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceActor._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 'a',
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：sourceActor._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceActor._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: null
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceActor._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 'a'
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：sourceApp._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceApp._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: null,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceApp._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 'a',
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：sourceApp._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceApp._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: null
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：sourceApp._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 'a'
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：destinationActor', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('destinationActor');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：destinationActor._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationActor._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: null,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationActor._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 'a',
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：destinationActor._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationActor._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: null
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationActor._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 'a'
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：destinationApp._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationApp._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: null,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationApp._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 'a',
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：destinationApp._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000502
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationApp._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000502,
                        _ver: null
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：destinationApp._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'store-thing',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000005,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000502,
                        _ver: 'a'
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：trigger._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：trigger._value、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _value: null,
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：trigger._value、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _value: 'a',
                        _ver: 1
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ不足：trigger._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _value: 1001010
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：trigger._ver、null', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _value: 1001010,
                        _ver: null
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：trigger._ver、数値以外', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify({
                    type: 'share-trigger',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: 'b87b27c1-5da8-37dd-6ee6-2c7831cf6a09',
                    event: {
                        _value: 1000232,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceWf: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationWf: {
                        _value: 1000501,
                        _ver: 1
                    },
                    trigger: {
                        _value: 1001010,
                        _ver: 'a'
                    }
                }));

            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(200, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, 運営メンバー', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(200, 3);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, null, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', null)
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(204, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答401', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(401, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(404, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServer(500, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：セッションなし', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：セッション(オペレータタイプが個人または運営)', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.storeEventReceive)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify({
                    type: 'store-event',
                    operate: 'add',
                    userId: 'test.user.id',
                    identifier: '69db43f2-6643-19e9-117c-4bdece4bddd7',
                    document: {
                        _value: 1000132,
                        _ver: 1
                    },
                    sourceActor: {
                        _value: 1000003,
                        _ver: 1
                    },
                    sourceApp: {
                        _value: 1000004,
                        _ver: 1
                    },
                    destinationActor: {
                        _value: 1000439,
                        _ver: 1
                    },
                    destinationApp: {
                        _value: 1000501,
                        _ver: 1
                    }
                }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
    });
});
