/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { InsertResult, UpdateResult, EntityManager, getRepository, Brackets } from 'typeorm';
import { CodeVersionObject, DateStartEndObject, CodeObject } from '../../resources/dto/PostGetBookReqDto';
/* eslint-enable */
import { connectDatabase } from '../../common/Connection';
import MyConditionBook from '../postgres/MyConditionBook';
import Document from '../postgres/Document';
import DocumentEventSetRelation from '../postgres/DocumentEventSetRelation';
import EventSetEventRelation from '../postgres/EventSetEventRelation';
import Event from '../postgres/Event';
import Thing from '../postgres/Thing';
import CmatrixEvent from '../postgres/CmatrixEvent';
import CmatrixFloatingColumn from '../../repositories/postgres/CmatrixFloatingColumn';
import CmatrixThing from '../postgres/CmatrixThing';
import Cmatrix2nRelation from '../postgres/Cmatrix2nRelation';
import AppError from '../../common/AppError';
import { ResponseCode } from '../../common/ResponseCode';
import moment = require('moment-timezone');

/**
 * 各エンティティ操作クラス
 */
export default class EntityOperation {
    /**
     * My-Condition-BookをuserId、開設日時をもとに取得
     * @param userIdList
     * @param openAtStart
     * @param openAtEnd
     */
    static async getRecordFromUserIdOpenAt (userIdList: Array<string>, openAtStart: Date, openAtEnd: Date): Promise<MyConditionBook[]> {
        const connection = await connectDatabase();
        const repository = getRepository(MyConditionBook, connection.name);
        let sql = repository
            .createQueryBuilder('my_condition_book')
            .where('is_disabled = :is_disabled', { is_disabled: false });
        if (userIdList) {
            sql = sql.andWhere('user_id IN (:...ids)', { ids: userIdList });
        }
        if (openAtStart) {
            sql = sql.andWhere('open_start_at >= :start', { start: openAtStart });
        }
        if (openAtEnd) {
            sql = sql.andWhere('open_start_at <= :end', { end: openAtEnd });
        }
        const ret = await sql.getRawMany();
        const list: MyConditionBook[] = [];
        ret.forEach(element => {
            list.push(new MyConditionBook(element));
        });
        return list;
    }

    /**
     * My-Condition-BookをuserIdをもとに取得
     * @param userId
     */
    static async getContBookRecordFromUserId (userId: string): Promise<MyConditionBook> {
        const connection = await connectDatabase();
        const repository = getRepository(MyConditionBook, connection.name);
        const ret = await repository
            .createQueryBuilder('my_condition_book')
            .where('user_id = :userId', { userId: userId })
            .andWhere('is_disabled = :is_disabled', { is_disabled: false })
            .getRawOne();
        return ret ? new MyConditionBook(ret) : null;
    }

    /**
     * ドキュメントイベントセットリレーションレコード取得
     * @param documentId
     * @param eventSetId
     */
    static async getDocumentEventSetRelationRecord (documentId: number, eventSetId: number): Promise<DocumentEventSetRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(DocumentEventSetRelation, connection.name);
        let sql = repository
            .createQueryBuilder('document_event_set_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false });
        if (documentId) {
            sql = sql.andWhere('document_id = :document_id', { document_id: documentId });
        }
        if (eventSetId) {
            sql = sql.andWhere('event_set_id = :event_set_id', { event_set_id: eventSetId });
        }
        sql = sql.orderBy('document_id');
        sql = sql.addOrderBy('event_set_id');
        const ret = await sql.getRawMany();
        const list: DocumentEventSetRelation[] = [];
        ret.forEach(element => {
            list.push(new DocumentEventSetRelation(element));
        });
        return list;
    }

    /**
     * ドキュメントイベントセットリレーションレコード取得
     * @param eventSetId
     * @param eventId
     */
    static async getEventSetEventRelationRecord (eventSetId: number, eventId: number): Promise<EventSetEventRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(EventSetEventRelation, connection.name);
        let sql = repository
            .createQueryBuilder('event_set_event_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false });
        if (eventSetId) {
            sql = sql.andWhere('event_set_id = :event_set_id', { event_set_id: eventSetId });
        }
        if (eventId) {
            sql = sql.andWhere('event_id = :event_id', { event_id: eventId });
        }
        sql = sql.orderBy('event_set_id');
        sql = sql.addOrderBy('event_id');
        const ret = await sql.getRawMany();
        const list: EventSetEventRelation[] = [];
        ret.forEach(element => {
            list.push(new EventSetEventRelation(element));
        });
        return list;
    }

    /**
     * ドキュメントレコード取得
     * @param id
     */
    static async getDocumentRecordById (id: number): Promise<Document> {
        const connection = await connectDatabase();
        const repository = getRepository(Document, connection.name);
        const ret = await repository
            .createQueryBuilder('document')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id = :id', { id: id })
            .getRawOne();
        return ret ? new Document(ret) : null;
    }

    /**
     * イベントレコード取得
     * @param userId
     * @param eventIdentifer
     * @param sourceId
     */
    static async getEventRecord (userId: string, eventIdentifer: string, sourceId: string): Promise<Event[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Event, connection.name);
        let sql = repository
            .createQueryBuilder('event')
            .select('event.*')
            .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
            .where('event.is_disabled = :event_is_disabled', { event_is_disabled: false })
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
            .andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
        if (eventIdentifer) {
            sql = sql.andWhere('event.event_identifier = :event_identifier', { event_identifier: eventIdentifer });
        }
        if (sourceId) {
            sql = sql.andWhere('event.source_id = :source_id', { source_id: sourceId });
        }
        sql = sql.orderBy('event.id');
        const ret = await sql.getRawMany();
        const list: Event[] = [];
        ret.forEach(element => {
            list.push(new Event(element));
        });
        return list;
    }

    /**
     * イベントレコード取得
     * @param id
     */
    static async getEventRecordById (id: number): Promise<Event> {
        const connection = await connectDatabase();
        const repository = getRepository(Event, connection.name);
        const ret = await repository
            .createQueryBuilder('event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id = :id', { id: id })
            .getRawOne();
        return ret ? new Event(ret) : null;
    }

    /**
     * モノレコード取得
     * @param userId
     * @param eventIdentifer
     * @param thingIdentifer
     * @param sourceId
     */
    static async getThingRecord (userId: string, eventIdentifer: string, thingIdentifer: string, sourceId: string): Promise<Thing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Thing, connection.name);
        let sql = repository
            .createQueryBuilder('thing')
            .select('thing.*')
            .innerJoin(Event, 'event', 'event.id = thing.event_id')
            .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
            .where('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
            .andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
        if (eventIdentifer) {
            sql = sql.andWhere('event.event_identifier = :event_identifier', { event_identifier: eventIdentifer });
        }
        if (thingIdentifer) {
            sql = sql.andWhere('thing.thing_identifier = :thing_identifier', { thing_identifier: thingIdentifer });
        }
        if (sourceId) {
            sql = sql.andWhere('thing.source_id = :source_id', { source_id: sourceId });
        }
        sql = sql.orderBy('thing.id');
        const ret = await sql.getRawMany();
        const list: Thing[] = [];
        ret.forEach(element => {
            list.push(new Thing(element));
        });
        return list;
    }

    /**
     * モノレコード取得
     * @param id
     */
    static async getThingRecordById (id: number): Promise<Thing> {
        const connection = await connectDatabase();
        const repository = getRepository(Thing, connection.name);
        const ret = await repository
            .createQueryBuilder('thing')
            .select('thing.*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id = :id', { id: id })
            .getRawOne();
        return ret ? new Thing(ret) : null;
    }

    /**
     * イベントに紐づくモノレコード取得
     * @param userId
     * @param eventId
     */
    static async getThingRecordByEventId (userId: string, eventId: number): Promise<Thing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Thing, connection.name);
        const ret = await repository
            .createQueryBuilder('thing')
            .select('thing.*')
            .innerJoin(Event, 'event', 'event.id = thing.event_id')
            .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
            .where('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
            .andWhere('my_condition_book.user_id = :user_id', { user_id: userId })
            .andWhere('event.id = :event_id', { event_id: eventId })
            .orderBy('thing.id')
            .getRawMany();
        const list: Thing[] = [];
        ret.forEach(element => {
            list.push(new Thing(element));
        });
        return list;
    }

    /**
     * CMatrixイベントレコード取得
     * @param userId
     * @param eventIdentifier
     */
    static async getCMatrixEventRecord (userId: string, eventIdentifier: string): Promise<CmatrixEvent[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);
        let sql = repository
            .createQueryBuilder('cmatrix_event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false });
        if (userId) {
            sql = sql.andWhere('"1_1" = :userId', { userId: userId });
        }
        if (eventIdentifier) {
            sql = sql.andWhere('"3_1_1" = :eventIdentifier', { eventIdentifier: eventIdentifier });
        }
        const ret = await sql.getRawMany();
        const list: CmatrixEvent[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new CmatrixEvent(element));
            });
        }
        return list;
    }

    /**
     * CMatrixモノレコード取得
     * @param cmatrixEventId
     */
    static async getCMatrixThingRecordByCMatrixEventId (cmatrixEventId: number): Promise<CmatrixThing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixThing, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_thing')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event_id = :cmatrixEventId', { cmatrixEventId: cmatrixEventId })
            .getRawMany();
        const list: CmatrixThing[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new CmatrixThing(element));
            });
        }
        return list;
    }

    /**
     * CMatrixモノレコード取得
     * @param cmatrixEventId
     */
    static async getCMatrixThingRecordByThingIdentifer (cmatrixEventId: number, thingIdentifer: string): Promise<CmatrixThing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixThing, connection.name);
        let sql = repository
            .createQueryBuilder('cmatrix_thing')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event_id = :cmatrixEventId', { cmatrixEventId: cmatrixEventId });
        if (thingIdentifer) {
            sql = sql.andWhere('"4_1_1" = :thingIdentifer', { thingIdentifer: thingIdentifer });
        }
        const ret = await sql.getRawMany();
        const list: CmatrixThing[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new CmatrixThing(element));
            });
        }
        return list;
    }

    /**
     * CMatrix変動列リレーションレコード取得
     * @param cmatrixThingId
     */
    static async getCMatrixFloatingColumnRecordByCMatrixEventId (cmatrixThingId: number): Promise<CmatrixFloatingColumn[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixFloatingColumn, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_floating_column')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_thins_id = :cmatrixThingId', { cmatrixThingId: cmatrixThingId })
            .orderBy('id', 'ASC')
            .getRawMany();
        const list: CmatrixFloatingColumn[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new CmatrixFloatingColumn(element));
            });
        }
        return list;
    }

    /**
     * CMatrix2(n)列リレーションレコード取得
     * @param cmatrixEventId
     */
    static async getCMatrix2nRelationRecordByCMatrixEventId (cmatrixEventId: number): Promise<Cmatrix2nRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2nRelation, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_2n_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event_id = :cmatrixEventId', { cmatrixEventId: cmatrixEventId })
            .orderBy('n', 'ASC')
            .getRawMany();
        const list: Cmatrix2nRelation[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new Cmatrix2nRelation(element));
            });
        }
        return list;
    }

    /**
     * My-Condition-Bookレコード追加
     * @param em
     * @param myConditionBook
     */
    static async insertCondBookRecord (em: EntityManager, myConditionBook: MyConditionBook): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * My-Condition-Bookレコード削除
     * @param em
     * @param myConditionBook
     */
    static async deleteCondBookRecord (em: EntityManager, myConditionBook: MyConditionBook): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * イベントレコード追加
     * @param em
     * @param entity
     */
    static async insertEventRecord (em: EntityManager, entity: Event): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * イベントレコード更新
     * @param em
     * @param entity
     */
    static async updateEventRecord (em: EntityManager, eventId: number, entity: Event): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * イベントレコード削除
     * @param em
     * @param eventId
     * @param register
     */
    static async deleteEventRecord (em: EntityManager, eventId: number, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrixイベントレコード追加
     * @param em
     * @param entity
     */
    static async insertCMatrixEventRecord (em: EntityManager, entity: CmatrixEvent): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrixイベントレコード更新
     * @param em
     * @param entity
     */
    static async updateCMatrixEventRecord (em: EntityManager, entity: CmatrixEvent): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * Cmatrixイベントレコード削除
     * @param em
     * @param cmatrixEventId
     * @param eventIdentifier
     * @param register
     */
    static async deleteCMatrixEventRecord (em: EntityManager, cmatrixEventId: number, eventIdentifier: string, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrixモノレコード追加
     * @param em
     * @param entity
     */
    static async insertCMatrixThingRecord (em: EntityManager, entity: CmatrixThing): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrixモノレコード更新
     * @param em
     * @param entity
     */
    static async updateCMatrixThingRecord (em: EntityManager, entity: CmatrixThing): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * Cmatrixモノレコード削除
     * @param em
     * @param cmatrixEventId
     * @param cmatrixThingId
     * @param thingIdentifier
     * @param register
     */
    static async deleteCMatrixThingRecord (em: EntityManager, cmatrixEventId: number, cmatrixThingId: number, thingIdentifier: string, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CmatrixFloatingColumnレコード追加
     * @param em
     * @param entity
     */
    static async insertCmatrixFloatingColumnRecord (em: EntityManager, entity: CmatrixFloatingColumn): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CmatrixFloatingColumnレコード削除
     * @param em
     * @param cmatrixThingId
     * @param index
     * @param register
     */
    static async deleteCmatrixFloatingColumnRecord (em: EntityManager, cmatrixThingId: number, index: string, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * モノレコード追加
     * @param em
     * @param entity
     */
    static async insertThingRecord (em: EntityManager, entity: Thing): Promise<InsertResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * モノレコード更新
     * @param em
     * @param entity
     */
    static async updateThingRecord (em: EntityManager, thingId: number, entity: Thing): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventId
     * @param sourceId
     * @param register
     */
    static async deleteThingRecord (em: EntityManager, eventId: number | number[], sourceId: string, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventId
     * @param sourceId
     * @param register
     */
    static async deleteThingsForEventIds (em: EntityManager, eventIds: number[], register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrix2(n)リレーションレコード削除
     * @param em
     * @param cmatrix2nId
     * @param register
     */
    static async deleteCMatrix2nRelationRecord (em: EntityManager, nDocumentNo: number, cmatrixEventId: number, cmatrix2nId: number, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * CMatrix2(n)レコード削除
     * @param em
     * @param cmatrix2nId
     * @param register
     */
    static async deleteCMatrix2nRecord (em: EntityManager, cmatrix2nId: number, register: string): Promise<UpdateResult> {
        throw new AppError('Unit Test Insert Error', ResponseCode.SERVICE_UNAVAILABLE);
    }

    /**
     * Book検索
     * @param type
     * @param userId
     * @param identifier
     * @param updatedAt
     * @param code
     * @param wf
     * @param app
     */
    static async getBook (type: string, userId: string, identifier: string[], updatedAt: DateStartEndObject, code: CodeVersionObject[], wf: CodeObject, app: CodeObject): Promise<number[]> {
        const connection = await connectDatabase();
        let sql = null;

        // 各タイプ毎の処理
        if (type === 'document') {
            // ドキュメント指定の場合
            sql = connection
                .createQueryBuilder()
                .from(Document, 'document')
                .select('document.id')
                .innerJoin(DocumentEventSetRelation, 'document_event_set_relation', 'document_event_set_relation.document_id = document.id')
                .innerJoin(EventSetEventRelation, 'event_set_event_relation', 'event_set_event_relation.id = document_event_set_relation.event_set_id')
                .innerJoin(Event, 'event', 'event.id = event_set_event_relation.event_id')
                .innerJoin(Thing, 'thing', 'thing.event_id = event.id')
                .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = document.my_condition_book_id')
                .where('document.is_disabled = :document_is_disabled', { document_is_disabled: false })
                .andWhere('document_event_set_relation.is_disabled = :document_event_set_relation_is_disabled', { document_event_set_relation_is_disabled: false })
                .andWhere('event_set_event_relation.is_disabled = :event_set_event_relation_is_disabled', { event_set_event_relation_is_disabled: false })
                .andWhere('event.is_disabled = :event_is_disabled', { event_is_disabled: false })
                .andWhere('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
                .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false });
            if (userId) {
                sql = sql.andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
            }
            if (identifier && identifier.length > 0) {
                sql = sql.andWhere('document.doc_identifier IN (:...doc_identifier)', { doc_identifier: identifier });
            }
            if (updatedAt && updatedAt.start) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        subQb.orWhere('document.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('event.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('thing.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
                    })
                );
            }
            if (updatedAt && updatedAt.end) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        subQb.orWhere('document.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('event.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('thing.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
                    })
                );
            }
            if (code && code.length > 0) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        for (let index = 0; index < code.length; index++) {
                            subQb.orWhere(
                                new Brackets(subQb2 => {
                                    if (code[index]._value) {
                                        subQb2.andWhere('document.doc_catalog_code = :doc_catalog_code', { doc_catalog_code: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere('document.doc_catalog_version = :doc_catalog_version', { doc_catalog_version: code[index]._ver });
                                    }
                                })
                            );
                        }
                    })
                );
            }
            if (app && app._value) {
                sql = sql.andWhere('document.app_catalog_code = :app_catalog_code', { app_catalog_code: app._value });
            }
            sql = sql.groupBy('document.id');
            sql = sql.orderBy('document.id', 'ASC');
        } else if (type === 'event') {
            // イベント指定の場合
            sql = connection
                .createQueryBuilder()
                .from(Event, 'event')
                .select('event.id')
                .innerJoin(Thing, 'thing', 'thing.event_id = event.id')
                .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
                .where('event.is_disabled = :event_is_disabled', { event_is_disabled: false })
                .andWhere('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
                .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false });
            if (userId) {
                sql = sql.andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
            }
            if (identifier && identifier.length > 0) {
                sql = sql.andWhere('event.event_identifier IN (:...event_identifier)', { event_identifier: identifier });
            }
            if (updatedAt && updatedAt.start) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        subQb.orWhere('event.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('thing.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
                    })
                );
            }
            if (updatedAt && updatedAt.end) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        subQb.orWhere('event.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
                        subQb.orWhere('thing.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
                    })
                );
            }
            if (code && code.length > 0) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        for (let index = 0; index < code.length; index++) {
                            subQb.orWhere(
                                new Brackets(subQb2 => {
                                    if (code[index]._value) {
                                        subQb2.andWhere('event.event_catalog_code = :event_catalog_code', { event_catalog_code: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere('event.event_catalog_version = :event_catalog_version', { event_catalog_version: code[index]._ver });
                                    }
                                })
                            );
                        }
                    })
                );
            }
            if (app && app._value) {
                sql = sql.andWhere('event.app_catalog_code = :app_catalog_code', { app_catalog_code: app._value });
            }
            sql = sql.groupBy('event.id');
            sql = sql.orderBy('event.id', 'ASC');
        } else if (type === 'thing') {
            // モノ指定の場合
            sql = connection
                .createQueryBuilder()
                .from(Thing, 'thing')
                .select('thing.id')
                .innerJoin(Event, 'event', 'event.id = thing.event_id')
                .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
                .where('event.is_disabled = :event_is_disabled', { event_is_disabled: false })
                .andWhere('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
                .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false });
            if (userId) {
                sql = sql.andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
            }
            if (identifier && identifier.length > 0) {
                sql = sql.andWhere('thing.thing_identifier IN (:...thing_identifier)', { thing_identifier: identifier });
            }
            if (updatedAt && updatedAt.start) {
                sql = sql.andWhere('thing.updated_at >= :start', { start: moment(updatedAt.start).utc().format('YYYY-MM-DD HH:mm:ss') });
            }
            if (updatedAt && updatedAt.end) {
                sql = sql.andWhere('thing.updated_at <= :end', { end: moment(updatedAt.end).utc().format('YYYY-MM-DD HH:mm:ss') });
            }
            if (code && code.length > 0) {
                sql = sql.andWhere(
                    new Brackets(subQb => {
                        for (let index = 0; index < code.length; index++) {
                            subQb.orWhere(
                                new Brackets(subQb2 => {
                                    if (code[index]._value) {
                                        subQb2.andWhere('thing.thing_catalog_code = :thing_catalog_code', { thing_catalog_code: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere('thing.thing_catalog_version = :thing_catalog_version', { thing_catalog_version: code[index]._ver });
                                    }
                                })
                            );
                        }
                    })
                );
            }
            if (app && app._value) {
                sql = sql.andWhere('thing.app_catalog_code = :app_catalog_code', { app_catalog_code: app._value });
            }
            sql = sql.groupBy('thing.id');
            sql = sql.orderBy('thing.id', 'ASC');
        }
        const ret = await sql.getRawMany();
        const list: number[] = [];
        ret.forEach(element => {
            list.push(element);
        });
        return list;
    }
}
