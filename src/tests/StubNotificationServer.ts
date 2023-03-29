/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');

/**
 * 通知サービス
 */
export default class StubNotificationServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number) {
        this._app = express();

        this._app.use(bodyParser.json({ limit: '100mb' }));
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(cookieParser());

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                res.status(status).json({
                    id: 1
                });
                return;
            }
            res.status(status).end();
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.post('/notification', _listener);
        this._server = this._app.listen(3004);
    }
}

export class BaseStubServer {
    constructor (
        private port: number,
        protected app: express.Express = express(),
        private server: Server = null
    ) {
    }

    async start () {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, (...args) => { if (args.length > 0) { reject(args); } resolve(); });
        });
    }

    async stop () {
        return new Promise((resolve, reject) => {
            this.server.close(err => { if (err) { reject(err); } resolve(); });
        });
    }
}

export class NotificationService extends BaseStubServer {
    constructor (status: number) {
        super(3004);
        this.app.get('/notification', (req, res) => {
            res.status(status).json([{
                type: 0,
                title: '利用者作成完了',
                content: '利用者ID123456789の利用者作成および連携が完了しました',
                from: {
                    applicationCode: null,
                    workflowCode: 1000004
                },
                destination: {
                    blockCode: 1000110,
                    operatorType: 3,
                    isSendAll: true,
                    operatorId: null,
                    userId: null
                },
                attribute: {
                    identifyCode: 'not_found'
                },
                category: { _value: 156, _ver: 1 }
            }, {
                type: 0,
                title: '利用者作成完了',
                content: '利用者ID123456789の利用者作成および連携が完了しました',
                from: {
                    applicationCode: null,
                    workflowCode: 1000004
                },
                destination: {
                    blockCode: 1000110,
                    operatorType: 3,
                    isSendAll: true,
                    operatorId: null,
                    userId: null
                },
                attribute: {
                    identifyCode: 'pxr_user'
                },
                category: { _value: 156, _ver: 1 }
            }, {
                type: 0,
                title: '利用者作成完了',
                content: '利用者ID123456789の利用者作成および連携が完了しました',
                from: {
                    applicationCode: null,
                    workflowCode: 1000004
                },
                destination: {
                    blockCode: 1000110,
                    operatorType: 3,
                    isSendAll: true,
                    operatorId: null,
                    userId: null
                },
                attribute: {
                },
                category: { _value: 156, _ver: 1 }
            }]).end();
        });
    }
}
