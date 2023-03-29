/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import StubCatalogServer from './StubCatalogServer';
import StubOperatorServer from './StubOperatorServer';
import StubOutsideStoreServer from './StubOutsideStoreServer';

jest.mock('../common/Config', () => ({
    ...jest.requireActual('../common/Config'),
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
let _operatorServer: StubOperatorServer = null;
let _catalogServer: StubCatalogServer = null;
let _outsideStoreServer: StubOutsideStoreServer = null;

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
        await common.executeSqlFile('initialDocumentOnlyData.sql');
        await common.executeSqlFile('initialEventData.sql');
        await common.executeSqlFile('initialDocumentRelationData.sql');
        await common.executeSqlFile('initialThingData.sql');
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
        if (_outsideStoreServer) {
            _outsideStoreServer._server.close();
            _outsideStoreServer = null;
        }
    });

    /**
     * Book参照
     */
    describe('Book参照', () => {
        test('正常：外部蓄積機能使用', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _outsideStoreServer = new StubOutsideStoreServer(200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toMatchObject({
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
                chapter: [
                    {
                        title: 'タイトル１',
                        event: [
                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                        ]
                    }
                ]
            });
        });
        test('正常：外部蓄積機能使用, 対象データなし', async () => {
            // スタブサーバー起動
            _catalogServer = new StubCatalogServer(3001, 9, 200);
            _operatorServer = new StubOperatorServer(200, 1);
            _outsideStoreServer = new StubOutsideStoreServer(200);
            await common.executeSqlFile('initialData.sql');
            await common.executeSqlFile('initialMyConditionData.sql');

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.bookSearchURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + '437a5cbc10da802a887f5e057c88fdc64a927332871ad2a987dfcb7d224e7e00'])
                .send(JSON.stringify(
                    {
                        userId: 'test_user_id1',
                        type: 'document',
                        identifier: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-12-31T00:00:00.000+0900'
                        },
                        _code: [
                            {
                                _value: 1000008,
                                _ver: 1
                            }
                        ],
                        app: null,
                        wf: {
                            _value: 1000007
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(204);
        });
    });
});
