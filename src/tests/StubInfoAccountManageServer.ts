/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import { ResponseCode } from '../common/ResponseCode';

export default class StubInfoAccountManageServer {
    _app: express.Express;
    _server: Server;
    constructor (status: number) {
        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === ResponseCode.OK) {
                const supplyProposalId = Number(req.params.supplyProposalId);
                if (supplyProposalId === 1) {
                    res.status(ResponseCode.OK).json({
                        supplyProposalId: 1,
                        supplyProposalStatus: 0,
                        title: 'test1',
                        description: 'test1の説明です。',
                        dataTrader: {
                            _value: 1000020,
                            _ver: 1
                        },
                        consumer: {
                            _value: 1000447,
                            _ver: 1
                        },
                        recruitmentAt: {
                            start: null,
                            end: null
                        },
                        fulfillmentAt: null,
                        approvalAt: null,
                        conclusionAt: null,
                        cancelAt: null,
                        purpose: null,
                        targetCondition: null,
                        dataType: null,
                        contract: null,
                        consent: null,
                        isDraft: false
                    }).end();
                } else if (supplyProposalId === 2) {
                    res.status(ResponseCode.OK).json({
                        supplyProposalId: 2,
                        supplyProposalStatus: 0,
                        title: 'test2',
                        description: 'test2の説明です。',
                        dataTrader: {
                            _value: 1000020,
                            _ver: 1
                        },
                        consumer: {
                            _value: 1000448,
                            _ver: 1
                        },
                        recruitmentAt: {
                            start: null,
                            end: null
                        },
                        fulfillmentAt: null,
                        approvalAt: null,
                        conclusionAt: null,
                        cancelAt: null,
                        purpose: null,
                        targetCondition: null,
                        dataType: null,
                        contract: null,
                        consent: null,
                        isDraft: false
                    }).end();
                }
                return;
            }
            res.status(status).end();
        };
        const _listener2 = (req: express.Request, res: express.Response) => {
            res.status(status);
            if (status === ResponseCode.OK) {
                res.json({ result: 'success' });
            }
            res.end();
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app = express();
        this._app.get('/info-account-manage/proposal/detail/:supplyProposalId', _listener);
        this._app.post('/info-account-manage/contract/process', _listener2);
        this._server = this._app.listen(3010);
    }
}
