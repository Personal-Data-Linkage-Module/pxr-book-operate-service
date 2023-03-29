/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import MyConditionBook from '../../repositories/postgres/MyConditionBook';
import Event from '../../repositories/postgres/Event';
import Thing from '../../repositories/postgres/Thing';
import CmatrixEvent from '../../repositories/postgres/CmatrixEvent';
import Cmatrix2n from '../../repositories/postgres/Cmatrix2n';
import CmatrixFloatingColumn from '../../repositories/postgres/CmatrixFloatingColumn';
import CmatrixThing from '../../repositories/postgres/CmatrixThing';
import Cmatrix2nRelation from '../../repositories/postgres/Cmatrix2nRelation';
import Document from '../../repositories/postgres/Document';
import DocumentEventSetRelation from '../../repositories/postgres/DocumentEventSetRelation';
import EventSetEventRelation from '../../repositories/postgres/EventSetEventRelation';
/* eslint-disable */
import { Connection } from 'typeorm';
/* eslint-enable */
import AppError from '../../common/AppError';
import Config from '../../common/Config';
const Message = Config.ReadConfig('./config/message.json');
const connectOption = Config.ReadConfig('./config/ormconfig.json');
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
    CmatrixFloatingColumn
];

/**
 * コネクションの生成
 */
export async function connectDatabase (): Promise<Connection> {
    throw new AppError(Message.FAILED_CONNECT_TO_DATABASE, 503);
}
