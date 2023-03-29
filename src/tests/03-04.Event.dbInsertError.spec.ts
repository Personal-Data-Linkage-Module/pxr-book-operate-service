/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import StubCatalogServer from './StubCatalogServer';
import urljoin = require('url-join');

// テストモジュールをインポート
jest.mock('../repositories/EntityOperation');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
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
    });

    /**
     * イベント蓄積
     */
    describe('イベント蓄積', () => {
        test('異常：INSERTエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2');

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
            expect(response.status).toBe(503);
        });
    });

    /**
     * イベント更新
     */
    describe('イベント更新', () => {
        test('異常：UPDATEエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // テストデータを追加
            await common.executeSqlFile('initialEventData.sql');
            await common.executeSqlFile('initialThingData.sql');

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
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
            expect(response.status).toBe(503);
        });
    });

    /**
     * ソースIDによるイベント更新
     */
    describe('ソースIDによるイベント更新', () => {
        test('異常：UPDATEエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).put(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send(JSON.stringify(
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
            expect(response.status).toBe(503);
        });
    });

    /**
     * イベント削除
     */
    describe('イベント削除', () => {
        test('異常：DELETEエラー', async () => {
            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(503);
        });
    });

    /**
     * ソースIDによるイベント削除
     */
    describe('ソースIDによるイベント削除', () => {
        test('異常：DELETEエラー', async () => {
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
                    1, '20200221-1', 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                    1000008, 1,
                    '2020-02-20 00:00:00', '2020-02-21 00:00:00', null,
                    1000004, 1,
                    1000007, 1,
                    1000005, 1, 'staffId',
                    null, null,
                    '{"id":{"index":"3_1_1","value":"fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
                    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
                )
            `);
            // 送信データを生成
            const url = urljoin(Url.eventURI, 'test_user_id2', '?eventSourceId=20200221-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json' })
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(503);
        });
    });
});
