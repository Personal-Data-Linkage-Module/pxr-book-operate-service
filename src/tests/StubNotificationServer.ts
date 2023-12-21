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

        this._app.use(bodyParser.json({ limit: '100mb' }) as express.RequestHandler);
        this._app.use(bodyParser.urlencoded({ extended: false }) as express.RequestHandler);
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
            this.server = this.app.listen(this.port, (...args) => { if (args.length > 0) { reject(args); } resolve(null); });
        });
    }

    async stop () {
        return new Promise((resolve, reject) => {
            this.server.close(err => { if (err) { reject(err); } resolve(null); });
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

export class NotificationServiceForDuplicateUserId extends BaseStubServer {
    constructor (status: number, service: string, expire: boolean = false) {
        super(3004);
        this.app.get('/notification', (req, res) => {
            let sendAt = '2030-10-25T15:05:52.215+0900';
            if (expire) {
                sendAt = '2020-10-25T15:05:52.215+0900';
            }
            if (service === 'wf') {
                res.status(status).json([{
                    type: 0,
                    title: '連携用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000007,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000007'
                    },
                    category: { _value: 145, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000047,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000047'
                    },
                    category: { _value: 145, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000047,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000017'
                    },
                    category: { _value: 145, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000017,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000017Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000027,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000027Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: 1000037,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeWf1000037Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                }]).end();
            } else if (service === 'app') {
                res.status(status).json([{
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: 1000012,
                        workflowCode: null,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeApp1000012Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携要求がきました',
                    from: {
                        applicationCode: 1000042,
                        workflowCode: null,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeApp1000042'
                    },
                    category: { _value: 145, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: 1000022,
                        workflowCode: null,
                        regionCode: null
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeApp1000022Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                }]).end();
            } else if (service === 'region') {
                res.status(status).json([{
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: null,
                        regionCode: 1000013
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeRegion1000013Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: null,
                        regionCode: 1000043
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeRegion1000043'
                    },
                    category: { _value: 145, _ver: 1 },
                    sendAt: sendAt
                },
                {
                    type: 0,
                    title: '連携解除用本人性確認コード発行',
                    content: '個人から利用者ID連携の連携解除要求がきました',
                    from: {
                        applicationCode: null,
                        workflowCode: null,
                        regionCode: 1000023
                    },
                    destination: {
                        blockCode: 1000110,
                        operatorType: 3,
                        isSendAll: true,
                        operatorId: null,
                        userId: null
                    },
                    attribute: {
                        identifyCode: 'identifyCodeRegion1000023Release'
                    },
                    category: { _value: 181, _ver: 1 },
                    sendAt: sendAt
                }
                ]).end();
            } else {
                res.status(status).json([{}]).end();
            }
        });
    }
}
