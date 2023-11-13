/* eslint-disable */
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
/* eslint-enable */
import AppError from '../../common/AppError';
import Config from '../../common/Config';

@Middleware({ type: 'before' })
export default class DeleteStoreDelRequestValidator implements ExpressMiddlewareInterface {
    async use (request: Request, response: Response, next: NextFunction): Promise<void> {
        const message = Config.ReadConfig('./config/message.json');
        // リクエストデータを取得
        const requestQuery = request.query;

        // appが設定されていない場合はエラー
        if (!requestQuery.app) {
            throw new AppError(message.EMPTY_APP, 400);
        }
        // wfに値が定義されている場合
        if (requestQuery.wf) {
            // エラーレスポンスを返す
            throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, 400);
        }

        next();
    }
}
