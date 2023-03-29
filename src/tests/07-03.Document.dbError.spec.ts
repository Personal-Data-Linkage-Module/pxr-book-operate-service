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
     * ドキュメント蓄積
     */
    describe('ドキュメント蓄積', () => {
        test('異常：DBエラー', async () => {
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
                                    'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
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
        });
    });
    describe('ドキュメントIDによるイベント更新', () => {
        test('異常：DBエラー', async () => {
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
                                    'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
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
        });
    });
    /**
     * ソースIDによるドキュメント削除
     */
    describe('イベント削除', () => {
        test('異常：DBエラー', async () => {
            // 送信データを生成
            const url = urljoin(Url.baseURI, 'document', 'test_user_id1', '?documentSourceId=202108-1');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ session: JSON.stringify(Session.wrorkFlow) })
                .send();

            // レスポンスチェック
            expect(response.status).toBe(503);
        });
    });
});
