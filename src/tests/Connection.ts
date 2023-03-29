/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import AppError from '../common/AppError';
/* eslint-disable */
import { Connection, createConnection, getConnectionManager, getConnection } from 'typeorm';
/* eslint-enable */
import Config from '../common/Config';
import MyConditionBook from '../repositories/postgres/MyConditionBook';
import Event from '../repositories/postgres/Event';
import Thing from '../repositories/postgres/Thing';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import Cmatrix2n from '../repositories/postgres/Cmatrix2n';
import CmatrixFloatingColumn from '../repositories/postgres/CmatrixFloatingColumn';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
import Cmatrix2nRelation from '../repositories/postgres/Cmatrix2nRelation';
import Document from '../repositories/postgres/Document';
import DocumentEventSetRelation from '../repositories/postgres/DocumentEventSetRelation';
import EventSetEventRelation from '../repositories/postgres/EventSetEventRelation';
import ShareAccessLog from '../repositories/postgres/ShareAccessLog';
import ShareAccessLogDataType from '../repositories/postgres/ShareAccessLogDataType';
import ShareStatus from '../repositories/postgres/ShareStatus';
import ShareTriggerWaiting from '../repositories/postgres/ShareTriggerWaiting';
import CollectionRequestDataType from '../repositories/postgres/CollectionRequestDataType';
import CollectionRequestConsent from '../repositories/postgres/CollectionRequestConsent';
import CollectionRequestConsentDataAmount from '../repositories/postgres/CollectionRequestConsentDataAmount';
import BinaryFile from '../repositories/postgres/BinaryFile';
import CollectionRequest from '../repositories/postgres/CollectionRequest';
import fs = require('fs');
const Message = Config.ReadConfig('./config/message.json');

const connectOption = JSON.parse(fs.readFileSync('./config/ormconfig.json', 'utf-8'));
// エンティティを設定
connectOption['entities'] = [
    MyConditionBook,
    Document,
    DocumentEventSetRelation,
    EventSetEventRelation,
    MyConditionBook,
    Event,
    Thing,
    CmatrixEvent,
    CmatrixThing,
    Cmatrix2n,
    Cmatrix2nRelation,
    CmatrixFloatingColumn,
    ShareAccessLog,
    ShareAccessLogDataType,
    CollectionRequest,
    CollectionRequestConsent,
    CollectionRequestConsentDataAmount,
    CollectionRequestDataType,
    ShareStatus,
    ShareTriggerWaiting,
    BinaryFile
];

/**
 * コネクションの生成
 */
export async function connectDatabase (): Promise<Connection> {
    let connection = null;
    try {
        // データベースに接続
        connection = await createConnection(connectOption);
    } catch (err) {
        if (err.name === 'AlreadyHasActiveConnectionError') {
            // すでにコネクションが張られている場合には、流用する
            connection = getConnectionManager().get('postgres');
        } else {
            // エラーが発生した場合は、アプリケーション例外に内包してスローする
            throw new AppError(
                Message.FAILED_CONNECT_TO_DATABASE, 500, err);
        }
    }
    // 接続したコネクションを返却
    return connection;
}
