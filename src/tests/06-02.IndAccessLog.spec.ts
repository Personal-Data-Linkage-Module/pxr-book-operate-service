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
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServer = null;

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
        await common.executeSqlFile('initialAccessLog.sql');
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
    });

    /**
     * 個人用共有アクセスログ取得
     */
    describe('個人用共有アクセスログ取得', () => {
        test('パラメータ異常：bodyがJSON不正', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send('{ XXXX: }');

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('リクエストボディにエラー、JSONへの変換に失敗しました');
        });
        test('パラメータ異常：bodyが空', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send({});

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ不足：userId', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-02T10:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：accessAt.start（日付型以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: 'a',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('start');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常：accessAt.end（日付型以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: 'a'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('end');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常：app（オブジェクト以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: 'a',
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('app');
            expect(response.body.reasons[0].message).toBe(Message.validation.nestedValidation);
        });
        test('パラメータ不足：app._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: {
                        _ver: 1
                    },
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：wf（オブジェクト以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: 'a',
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('wf');
            expect(response.body.reasons[0].message).toBe(Message.validation.nestedValidation);
        });
        test('パラメータ異常：userId（文字列以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 1,
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('userId');
            expect(response.body.reasons[0].message).toBe(Message.validation.isString);
        });
        test('パラメータ異常：document（配列以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: {
                        _value: 1001117,
                        _ver: 1
                    },
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('document');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：document._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：document._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _ver: 1001117
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document._value（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 'a',
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：document._ver（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 'a'
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event（配列以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: {
                        _value: 1000155,
                        _ver: 1
                    },
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('event');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：event._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _ver: 1000155
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：event._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event._value（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 'a',
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event._ver（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 'a'
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing（配列以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: {
                        _value: 1000335,
                        _ver: 1
                    }
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('thing');
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：thing._value', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _ver: 1000335
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：thing._ver', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing._value（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 'a',
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_value');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing._ver（数字以外）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 'a'
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].property).toBe('_ver');
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：bodyが配列', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send([{
                    accessAt: {
                        start: '2020-08-01T09:00:00.000+0900',
                        end: '2020-08-10T09:00:00.000+0900'
                    },
                    app: null,
                    wf: {
                        _value: 1000120
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                }]);

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.UNEXPECTED_ARRAY_REQUEST);
        });
        test('パラメータ異常：startとendの範囲が正しくない', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-10T09:00:00.000+0900',
                        end: '2020-08-01T09:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'test_user01',
                    document: [
                        {
                            _value: 1001117,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.DATE_SCOPE_INVALID);
        });
        test('正常：APP指定', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-10T00:00:00.000+0900',
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
            expect(response.body[0].thing[0]._code._value).toBe(1001046);
            expect(response.body[0].thing[0].count).toBe(1);
        });
        test('正常：ドキュメントの指定無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-10T00:00:00.000+0900',
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
            expect(response.body[0].thing[0]._code._value).toBe(1001046);
            expect(response.body[0].thing[0].count).toBe(1);
        });
        test('正常：イベントの指定無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-10T00:00:00.000+0900',
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].thing[0]._code._value).toBe(1001046);
            expect(response.body[0].thing[0].count).toBe(1);
        });
        test('正常：モノの指定無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-10T00:00:00.000+0900',
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
        });
        test('正常：該当するデータ種無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002222,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1005555,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1003333,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：startのみ指定', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
        });
        test('正常：endのみ指定', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
        });
        test('正常：accessAtの指定無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
        });
        test('正常：document、event、thingの指定無し', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01'
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
            expect(response.body[0].thing[0]._code._value).toBe(1001046);
            expect(response.body[0].thing[0].count).toBe(1);
        });
        test('正常：対象データ無し（データ種の指定無し）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-09-01T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user03'
                });

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('異常：対象データ無し（データ種レコードが無い）', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-09-01T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user04'
                });

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('異常：運営メンバーでログイン', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：アプリケーションでログイン', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.application) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Bookが存在しない', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.ind) })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user999',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
        test('正常：Cookie,個人', async () => {
            _operatorServer = new StubOperatorServer(200, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-10T00:00:00.000+0900',
                        end: '2020-08-20T00:00:00.000+0900'
                    },
                    app: {
                        _value: 1001120
                    },
                    wf: null,
                    userId: 'app_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1001009,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1001046,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body[0].type).toBe(1);
            expect(response.body[0].request.actor._value).toBe(1001022);
            expect(response.body[0].request.block._value).toBe(1001111);
            expect(response.body[0].document[0]._code._value).toBe(1002120);
            expect(response.body[0].document[0].count).toBe(1);
            expect(response.body[0].event[0]._code._value).toBe(1001009);
            expect(response.body[0].event[0].count).toBe(1);
        });
        test('異常：Cookie,アプリケーション', async () => {
            _operatorServer = new StubOperatorServer(200, 2);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie,運営メンバー', async () => {
            _operatorServer = new StubOperatorServer(200, 3);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：未ログイン', async () => {
            _operatorServer = new StubOperatorServer(200, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：オペレーターサービスからの応答が204', async () => {
            _operatorServer = new StubOperatorServer(204, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：オペレーターサービスからの応答が400', async () => {
            _operatorServer = new StubOperatorServer(400, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：オペレーターサービスからの応答が500', async () => {
            _operatorServer = new StubOperatorServer(500, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：オペレーターサービスとの接続に失敗', async () => {
            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.accessLogURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send({
                    accessAt: {
                        start: '2020-08-01T00:00:00.000+0900',
                        end: '2020-08-10T00:00:00.000+0900'
                    },
                    wf: null,
                    app: {
                        _value: 1000117
                    },
                    userId: 'wf_test_user01',
                    document: [
                        {
                            _value: 1002120,
                            _ver: 1
                        }
                    ],
                    event: [
                        {
                            _value: 1000155,
                            _ver: 1
                        }
                    ],
                    thing: [
                        {
                            _value: 1000335,
                            _ver: 1
                        }
                    ]
                });

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
    });
});
