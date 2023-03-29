/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
import * as express from 'express';
/* eslint-enable */

export default class StubAWSServer {
    _app: express.Express;
    _server: Server;
    constructor (status: number) {
        const _listener = (req: express.Request, res: express.Response) => {
            res.status(status).json({
                executionArn: 'arn:aws:states:ap-northeast-1:xxxxxxxxxxxxx:…'
            }).end();
        };
        const _listener2 = (req: express.Request, res: express.Response) => {
            res.status(status).json({
                executionArn: 'arn:aws:states:ap-northeast-1:xxxxxxxxxxxxx:…',
                input: '{...}',
                output: '{"result": true}',
                startDate: 1625818863472,
                status: 'SUCCEEDED',
                stopDate: 1625819863472
            }).end();
        };
        this._app = express();
        this._app.post('/share-trigger/start', _listener);
        this._app.post('/share-trigger/end', _listener);
        this._app.post('/share-trigger/start/status', _listener2);
        this._app.post('/share-trigger/end/status', _listener2);
        this._server = this._app.listen(5002);
    }
}
