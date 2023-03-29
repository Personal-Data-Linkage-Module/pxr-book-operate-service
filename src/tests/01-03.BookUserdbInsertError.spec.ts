/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import StubCatalogServer from './StubCatalogServer';
import StubBookManageServer from './StubBookManageServer';
import Config from '../common/Config';
import * as express from 'express';
const Message = Config.ReadConfig('./config/message.json');

// テストモジュールをインポート
jest.mock('../common/Connection');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー（オペレータサービス）
class StubOperatorServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number, type: number) {
        this._app = express();

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            res.status(status);
            res.json({
                sessionId: 'sessionId',
                operatorId: 1,
                type: type,
                loginId: 'loginid',
                name: 'test-user',
                mobilePhone: '0311112222',
                auth: {
                    add: true,
                    update: true,
                    delete: true
                },
                lastLoginAt: '2020-01-01T00:00:00.000+0900',
                attributes: {},
                roles: [
                    {
                        _value: 1,
                        _ver: 1
                    }
                ],
                block: {
                    _value: 1000110,
                    _ver: 1
                },
                actor: {
                    _value: 1000001,
                    _ver: 1
                }
            });
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.post('/operator/session', _listener);
        this._app.post('/operator', _listener);
        this._server = this._app.listen(3000);
    }
}

// スタブサーバー（カタログサービス）
let _catalogServer: StubCatalogServer = null;
let _bookManageServer: StubBookManageServer = null;
let _operatorServer: StubOperatorServer = null;

/**
 * book-mange API のユニットテスト
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
     * 各テスト実行の後処理
     */
    afterEach(async () => {
        // スタブサーバー停止
        if (_catalogServer) {
            _catalogServer._server.close();
            _catalogServer = null;
        }
        if (_bookManageServer) {
            _bookManageServer._server.close();
            _bookManageServer = null;
        }
        if (_operatorServer) {
            _operatorServer._server.close();
            _operatorServer = null;
        }
    });

    /**
     * 全テスト実行の後処理
     */
    afterAll(async () => {
        // サーバ停止
        app.stop();
    });

    /**
     * 利用者作成
     */
    describe('利用者作成', () => {
        test('異常：データ登録DBエラー', async () => {
            _catalogServer = new StubCatalogServer(3001, 1000001, 200);
            _bookManageServer = new StubBookManageServer(200, 1);
            _operatorServer = new StubOperatorServer(200, 3);

            // 送信データを生成
            const url = Url.userCreateURI;

            // 対象APIに送信
            const response = await supertest(expressApp).post(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.pxrRoot) })
                .send(JSON.stringify(
                    {
                        identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                        attributes: {},
                        userInformation: {
                            _code: {
                                _value: 1000373,
                                _ver: 1
                            },
                            'item-group': [
                                {
                                    title: '氏名',
                                    item: [
                                        {
                                            title: '姓',
                                            type: {
                                                _value: 30019,
                                                _ver: 1
                                            },
                                            content: 'サンプル'
                                        },
                                        {
                                            title: '名',
                                            type: {
                                                _value: 30020,
                                                _ver: 1
                                            },
                                            content: '太郎'
                                        }
                                    ]
                                },
                                {
                                    title: '性別',
                                    item: [
                                        {
                                            title: '性別',
                                            type: {
                                                _value: 30021,
                                                _ver: 1
                                            },
                                            content: '男'
                                        }
                                    ]
                                },
                                {
                                    title: '生年',
                                    item: [
                                        {
                                            title: '生年',
                                            type: {
                                                _value: 1000372,
                                                _ver: 1
                                            },
                                            content: 2000
                                        }
                                    ]
                                },
                                {
                                    title: '住所（行政区）',
                                    item: [
                                        {
                                            title: '住所（行政区）',
                                            type: {
                                                _value: 1000371,
                                                _ver: 1
                                            },
                                            content: '東京都港区'
                                        }
                                    ]
                                },
                                {
                                    title: '連絡先電話番号',
                                    item: [
                                        {
                                            title: '連絡先電話番号',
                                            type: {
                                                _value: 30036,
                                                _ver: 1
                                            },
                                            content: '080-1234-5678',
                                            'changeable-flag': true
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_DATABASE);
        });
    });
});
