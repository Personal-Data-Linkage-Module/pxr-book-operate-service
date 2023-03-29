/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import { ResponseCode } from '../common/ResponseCode';

export default class StubCTokenServer {
    _app: express.Express;
    _server: Server;
    constructor (port: number, status: number) {
        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === ResponseCode.OK) {
                // 正常(pxr-root)
                res.status(ResponseCode.OK).json({
                    status: 'OK'
                });
                return;
            }
            res.status(status).end();
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app = express();
        this._app.post('/local-ctoken', _listener);
        this._server = this._app.listen(port);
    }
}
