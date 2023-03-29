/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import Config from '../common/Config';
import StubCTokenServer from './StubCTokenServer';
import { StubOperatorServerType0 } from './StubOperatorServer';
import urljoin = require('url-join');
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServerType0 = null;
let _cTokenServer: StubCTokenServer = null;

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
        await common.executeSqlFile('initialDocumentDataForShare.sql');
        await common.executeSqlFile('initialDocumentData.sql');
        await common.executeSqlFile('initialEventData.sql');
        await common.executeSqlFile('initialDocumentRelationData.sql');
        await common.executeSqlFile('initialThingData.sql');
        await common.executeSqlFile('initialBinaryFile.sql');
        await common.executeSqlFile('initialCMatrixData.sql');
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
        if (_cTokenServer) {
            _cTokenServer._server.close();
            _cTokenServer = null;
        }
    });

    /**
     * 利用者データ削除
     */
    describe('利用者データ削除', () => {
        test('異常：Cookie使用, 個人', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type0_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookie使用, アプリケーション', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 2);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.REQUEST_UNAUTORIZED);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 1);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + '']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NO_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(204, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答400', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(400, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.IS_NOT_AUTHORIZATION_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(503, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：Cookie使用、オペレータサービス未起動', async () => {
            // スタブサーバー起動
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：Cookie使用、CTokenサービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 204);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：Cookie使用、CTokenサービス応答400', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 400);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：Cookie使用、CTokenサービス応答503', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 503);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CTOKEN_POST);
        });
        test('異常：Cookie使用、CTokenサービス未起動', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_CTOKEN_POST);
        });
        test('異常：ユーザーIDのドキュメントなし', async () => {
            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.document
                SET
                    is_disabled = true
                ;
            `);

            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：ユーザーIDのイベントなし', async () => {
            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.document
                SET
                    is_disabled = false
                ;
            `);
            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.event
                SET
                    is_disabled = true
                ;
            `);

            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：ユーザーIDのモノなし', async () => {
            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.event
                SET
                    is_disabled = false
                ;
            `);
            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.thing
                SET
                    is_disabled = true
                ;
            `);

            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：ユーザーIDのCMatrixイベントなし', async () => {
            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.thing
                SET
                    is_disabled = false
                ;
            `);
            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = true
                ;
            `);

            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('異常：ユーザーIDのCMatrix2nなし', async () => {
            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_event
                SET
                    is_disabled = false
                ;
            `);
            // 対象データ削除
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_2_n
                SET
                    is_disabled = true
                ;
            `);

            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(Message.TARGET_NO_DATA);
        });
        test('正常：論理削除', async () => {
            // 対象データ復活
            await common.executeSqlString(`
                UPDATE pxr_book_operate.cmatrix_2_n
                SET
                    is_disabled = false
                ;
            `);
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id1', '?physicalDelete=false');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ result: 'success' }));
        });
        test('正常：物理削除', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 3);
            _cTokenServer = new StubCTokenServer(3009, 200);

            // 送信データを作成
            const url = urljoin(Url.deleteUserStoreDataURI, 'test_user_id2', '?physicalDelete=true');

            // 対象APIに送信
            const response = await supertest(expressApp).delete(url)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type3_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296']);

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({ result: 'success' }));
        });
    });
});
