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
     * モノ追加
     */
    describe('モノ追加', () => {
        test('異常：INSERTエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000006, 200);

            // テストデータ作成
            await common.executeSqlFile('initialEventData.sql');

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6');

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
                        wf: null
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(503);
        });
    });

    /**
     * モノ更新
     */
    describe('モノ更新', () => {
        test('異常：UPDATEエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6');

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
                        wf: null
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
        });
    });

    /**
     * ソースIDによるモノ更新
     */
    describe('ソースIDによるモノ更新', () => {
        test('異常：UPDATEエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000005, 200);

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', '?thingSourceId=20200221-1');

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
                        wf: null
                    }
                ));
            // レスポンスチェック
            expect(response.status).toBe(404);
        });
    });

    /**
     * モノ削除
     */
    describe('モノ削除', () => {
        test('異常：DELETEエラー', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialEventData.sql');
            await common.executeSqlFile('initialThingData.sql');

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6');

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
     * ソースIDによるモノ削除
     */
    describe('ソースIDによるモノ削除', () => {
        test('異常：DELETEエラー', async () => {
            // テストデータ作成
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');
            await common.executeSqlFile('initialEventData.sql');
            await common.executeSqlFile('initialThingData.sql');

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', '?thingSourceId=20200221-1');

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
