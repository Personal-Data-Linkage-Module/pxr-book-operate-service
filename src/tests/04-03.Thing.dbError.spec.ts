/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import { Url } from './Common';
import { Session } from './Session';
import StubCatalogServer from './StubCatalogServer';
import urljoin = require('url-join');

// テストモジュールをインポート
jest.mock('../common/Connection');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;

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
    });
    /**
     * 各テスト実行の前処理
     */
    beforeEach(async () => {
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
        test('異常：DBエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', '1');

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
        test('異常：DBエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', '1', '1');

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
            expect(response.status).toBe(503);
        });
    });

    /**
     * ソースIDによるモノ更新
     */
    describe('ソースIDによるモノ更新', () => {
        test('異常：DBエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);

            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', '1', '?thingSourceId=20200221-1');

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
            expect(response.status).toBe(503);
        });
    });

    /**
     * モノ削除
     */
    describe('モノ削除', () => {
        test('異常：DBエラー', async () => {
            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', '1', '1');

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
        test('異常：DBエラー', async () => {
            // 送信データを生成
            const url = urljoin(Url.thingURI, 'test_user_id1', '1', '?thingSourceId=20200221-1');

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
