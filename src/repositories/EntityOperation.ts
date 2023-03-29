/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { InsertResult, UpdateResult, EntityManager, getRepository, Brackets, DeleteResult } from 'typeorm';
import { CodeVersionObject, DateStartEndObject, CodeObject } from '../resources/dto/PostGetBookReqDto';
/* eslint-enable */
import { connectDatabase } from '../common/Connection';
import MyConditionBook from './postgres/MyConditionBook';
import Document from './postgres/Document';
import DocumentEventSetRelation from './postgres/DocumentEventSetRelation';
import EventSetEventRelation from './postgres/EventSetEventRelation';
import Event from './postgres/Event';
import Thing from './postgres/Thing';
import BinaryFile from './postgres/BinaryFile';
import CmatrixEvent from './postgres/CmatrixEvent';
import Cmatrix2nRelation from './postgres/Cmatrix2nRelation';
import Cmatrix2n from './postgres/Cmatrix2n';
import CmatrixFloatingColumn from '../repositories/postgres/CmatrixFloatingColumn';
import CmatrixThing from './postgres/CmatrixThing';
import ShareAccessLog from './postgres/ShareAccessLog';
import ShareAccessLogDataType from './postgres/ShareAccessLogDataType';
import CollectionRequestConsent from './postgres/CollectionRequestConsent';
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
     */
    static async getDocumentEventSetRelationRecord (documentId: number, title: string): Promise<DocumentEventSetRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(DocumentEventSetRelation, connection.name);
        let sql = repository
            .createQueryBuilder('document_event_set_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('document_id = :document_id', { document_id: documentId });
        if (title) {
            sql = sql.andWhere('title = :title', { title: title });
        }
        const ret = await sql
            .orderBy('document_id')
            .getRawMany();
        const list: DocumentEventSetRelation[] = [];
        ret.forEach(element => {
            list.push(new DocumentEventSetRelation(element));
        });
        return list;
    }

    /**
     * イベントセットイベントリレーションレコード取得
     * @param eventSetId
     */
    static async getEventSetEventRelationRecord (eventSetId: number, eventId: number): Promise<EventSetEventRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(EventSetEventRelation, connection.name);
        let sql = repository
            .createQueryBuilder('event_set_event_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('event_set_id = :event_set_id', { event_set_id: eventSetId });
        if (eventId) {
            sql = sql.andWhere('event_id = :eventId', { eventId: eventId });
        }
        const ret = await sql
            .orderBy('event_set_id')
            .addOrderBy('event_id')
            .getRawMany();
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
        const sql = repository
            .createQueryBuilder('event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id = :id', { id: id });
        const ret = await sql.getRawOne();
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
            .where('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
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
        const sql = repository
            .createQueryBuilder('thing')
            .select('thing.*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id = :id', { id: id });
        const ret = await sql.getRawOne();
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
        const sql = repository
            .createQueryBuilder('thing')
            .select('thing.*')
            .innerJoin(Event, 'event', 'event.id = thing.event_id')
            .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = event.my_condition_book_id')
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
            .where('thing.is_disabled = :thing_is_disabled', { thing_is_disabled: false })
            .andWhere('my_condition_book.user_id = :user_id', { user_id: userId })
            .andWhere('event.id = :event_id', { event_id: eventId })
            .orderBy('thing.id');
        const ret = await sql.getRawMany();
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
    static async getCMatrixEventRecord (userId: string, eventIdentifier: string, includeDeleted: boolean = false): Promise<CmatrixEvent[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);
        let sql = repository
            .createQueryBuilder('cmatrix_event')
            .select('*');
        if (!includeDeleted) {
            sql.where('is_disabled = :is_disabled', { is_disabled: false });
        }
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
     * CMatrixイベントレコード取得
     * @param userId
     * @param eventIdentifier
     */
    static async getCMatrixEventsByEventIdentifier (userId: string, eventIdentifiers: string[]): Promise<CmatrixEvent[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"1_1" = :userId', { userId: userId })
            .andWhere('"3_1_1" IN (:...eventIdentifiers)', { eventIdentifiers: eventIdentifiers })
            .getRawMany();
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
     * CMatrixモノレコード取得
     * @param cmatrixEventId
     */
    static async getCMatrixThingsByEventIdentifier (userId: string, eventIdentifier: string): Promise<CmatrixThing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixThing, connection.name);
        const sql = repository
            .createQueryBuilder('cmatrix_thing')
            .select('cmatrix_thing.*')
            .innerJoin(CmatrixEvent, 'cmatrix_event', 'cmatrix_event.id = cmatrix_thing.cmatrix_event_id')
            .where('cmatrix_thing.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event."1_1" = :userId', { userId: userId })
            .andWhere('cmatrix_event."3_1_1" = :eventIdentifier', { eventIdentifier: eventIdentifier });
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
     * CMatrixモノレコード取得
     * @param cmatrixEventId
     */
    static async getCMatrixThingsByThingIdentifier (userId: string, eventIdentifier: string, thingIdentifiers: string[]): Promise<CmatrixThing[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixThing, connection.name);
        const sql = repository
            .createQueryBuilder('cmatrix_thing')
            .select('cmatrix_thing.*')
            .innerJoin(CmatrixEvent, 'cmatrix_event', 'cmatrix_event.id = cmatrix_thing.cmatrix_event_id')
            .where('cmatrix_thing.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event.is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_event."1_1" = :userId', { userId: userId })
            .andWhere('cmatrix_event."3_1_1" = :eventIdentifier', { eventIdentifier: eventIdentifier })
            .andWhere('cmatrix_thing."4_1_1" IN (:...thingIdentifiers)', { thingIdentifiers: thingIdentifiers });
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
     * CMatrix2(n)リレーションレコード取得
     * @param n
     * @param cmatrixEventId
     * @param cmatrix2nId
     */
    static async getCMatrix2nRelationRecord (n: number, cmatrixEventId: number, cmatrix2nId: number): Promise<Cmatrix2nRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2nRelation, connection.name);
        let sql = repository
            .createQueryBuilder('cmatrix_2n_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false });
        if (typeof n === 'number') {
            sql = sql.andWhere('n = :n', { n: n });
        }
        if (typeof cmatrixEventId === 'number') {
            sql = sql.andWhere('cmatrix_event_id = :cmatrixEventId', { cmatrixEventId: cmatrixEventId });
        }
        if (typeof cmatrix2nId === 'number') {
            sql = sql.andWhere('cmatrix_2n_id = :cmatrix2nId', { cmatrix2nId: cmatrix2nId });
        }
        const ret = await sql
            .orderBy('id', 'ASC')
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
     * CMatrix2(n)列リレーションレコード取得
     * @param docNs
     */
    static async getCMatrix2nRelationRecordByDocIds (docNs: number[]): Promise<Cmatrix2nRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2nRelation, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_2n_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('n IN (:...docNs)', { docNs: docNs })
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
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(MyConditionBook)
            .values({
                userId: myConditionBook.userId,
                actorCatalogCode: myConditionBook.actorCatalogCode,
                actorCatalogVersion: myConditionBook.actorCatalogVersion,
                appCatalogCode: myConditionBook.appCatalogCode,
                appCatalogVersion: myConditionBook.appCatalogVersion,
                wfCatalogCode: myConditionBook.wfCatalogCode,
                wfCatalogVersion: myConditionBook.wfCatalogVersion,
                openStartAt: myConditionBook.openStartAt,
                identifyCode: myConditionBook.identifyCode,
                createdBy: myConditionBook.createdBy,
                updatedBy: myConditionBook.updatedBy
            })
            .execute();
        return ret;
    }

    /**
     * MyConditionBookを取得する
     */
    static async getMyConditionBooksIncludeDeleted (): Promise<MyConditionBook[]> {
        const connection = await connectDatabase();
        const repository = connection.getRepository(MyConditionBook);
        const entity = await repository.createQueryBuilder('myConditionBook').getMany();
        return entity;
    }

    /**
     * My-Condition-Bookレコード削除
     * @param em
     * @param myConditionBook
     */
    static async deleteCondBookRecord (em: EntityManager, myConditionBook: MyConditionBook, isPhysicalDelete: boolean = false): Promise<DeleteResult | UpdateResult> {
        // SQLを生成及び実行
        let sql;
        if (isPhysicalDelete) {
            // 物理削除
            sql = em
                .createQueryBuilder()
                .delete()
                .from(MyConditionBook);
        } else {
            // 論理削除
            sql = em
                .createQueryBuilder()
                .update(MyConditionBook)
                .set({
                    isDisabled: true,
                    updatedBy: myConditionBook.updatedBy
                });
        }
        sql = sql.where('userId = :userId', { userId: myConditionBook.userId })
            .andWhere('actor_catalog_code = :actor_catalog_code', { actor_catalog_code: myConditionBook.actorCatalogCode });

        if (myConditionBook.regionCatalogCode) {
            sql = sql.andWhere('region_catalog_code = :region_catalog_code', { region_catalog_code: myConditionBook.regionCatalogCode });
        }
        if (myConditionBook.appCatalogCode) {
            sql = sql.andWhere('app_catalog_code = :app_catalog_code', { app_catalog_code: myConditionBook.appCatalogCode });
        }
        const ret = sql.execute();
        return ret;
    }

    /**
     * イベントレコード追加
     * @param em
     * @param entity
     */
    static async insertEventRecord (em: EntityManager, entity: Event): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(Event)
            .values({
                myConditionBookId: entity.getMyConditionBookId(),
                sourceId: entity.getSourceId(),
                eventIdentifier: entity.getEventIdentifier(),
                eventCatalogCode: entity.getEventCatalogCode(),
                eventCatalogVersion: entity.getEventCatalogVersion(),
                eventStartAt: entity.getEventStartAt() || null,
                eventEndAt: entity.getEventEndAt() || null,
                eventOutbreakPosition: entity.getEventOutbreakPosition() || null,
                eventActorCode: entity.getEventActorCode(),
                eventActorVersion: entity.getEventActorVersion(),
                wfCatalogCode: null,
                wfCatalogVersion: null,
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                appCatalogCode: entity.getAppCatalogCode() || null,
                appCatalogVersion: entity.getAppCatalogVersion() || null,
                template: entity.getTemplate(),
                attributes: entity.getAttributes() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * イベントレコード更新
     * @param em
     * @param entity
     */
    static async updateEventRecord (em: EntityManager, eventId: number, entity: Event): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Event)
            .set({
                eventStartAt: entity.getEventStartAt(),
                eventEndAt: entity.getEventEndAt(),
                eventOutbreakPosition: entity.getEventOutbreakPosition() || null,
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                template: entity.getTemplate(),
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: eventId })
            .execute();
        return ret;
    }

    /**
     * イベントレコード削除
     * @param em
     * @param eventId
     * @param register
     */
    static async deleteEventRecord (em: EntityManager, eventId: number, register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Event)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('id = :id', { id: eventId })
            .execute();
        return ret;
    }

    /**
     * イベントレコード削除
     * @param em
     * @param eventId
     * @param register
     */
    static async deleteEvents (em: EntityManager, eventIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Event)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('id IN (:...ids)', { ids: eventIds })
            .execute();
        return ret;
    }

    /**
     * イベントレコード削除
     * @param em
     * @param eventIds
     */
    static async physicalDeleteEvents (em: EntityManager, eventIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(Event)
            .andWhere('id IN (:...ids)', { ids: eventIds })
            .execute();
        return ret;
    }

    /**
     * CMatrixイベントレコード追加
     * @param em
     * @param entity
     */
    static async insertCMatrixEventRecord (em: EntityManager, entity: CmatrixEvent): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(CmatrixEvent)
            .values({
                personIdentifier: entity.getPersonIdentifier(),
                birthAt: entity.getBirthAt() || null,
                eventIdentifier: entity.getEventIdentifier(),
                eventCatalogCode: entity.getEventCatalogCode(),
                eventCatalogVersion: entity.getEventCatalogVersion(),
                eventStartAt: entity.getEventStartAt() || null,
                eventEndAt: entity.getEventEndAt() || null,
                eventOutbreakPosition: entity.getEventOutbreakPosition() || null,
                eventActorCode: entity.getEventActorCode(),
                eventActorVersion: entity.getEventActorVersion(),
                eventWfCatalogCode: null,
                eventWfCatalogVersion: null,
                eventWfRoleCode: null,
                eventWfRoleVersion: null,
                eventWfStaffIdentifier: null,
                eventAppCatalogCode: entity.getEventAppCatalogCode() || null,
                eventAppCatalogVersion: entity.getEventAppCatalogVersion() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * CMatrixイベントレコード更新
     * @param em
     * @param entity
     */
    static async updateCMatrixEventRecord (em: EntityManager, entity: CmatrixEvent): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(CmatrixEvent)
            .set({
                eventStartAt: entity.getEventStartAt(),
                eventEndAt: entity.getEventEndAt(),
                eventOutbreakPosition: entity.getEventOutbreakPosition() || null,
                eventWfRoleCode: null,
                eventWfRoleVersion: null,
                eventWfStaffIdentifier: null,
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: entity.id })
            .execute();
        return ret;
    }

    /**
     * ドキュメントレコード追加
     * @param em
     * @param entity
     */
    static async insertDocumentRecord (em: EntityManager, entity: Document): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(Document)
            .values({
                myConditionBookId: entity.getMyConditionBookId(),
                sourceId: entity.getSourceId(),
                docIdentifier: entity.docIdentifier,
                docCatalogCode: entity.getdocCatalogCode(),
                docCatalogVersion: entity.getdocCatalogVersion(),
                docCreateAt: entity.getdocCreateAt(),
                docActorCode: entity.getdocActorCode(),
                docActorVersion: entity.getdocActorVersion(),
                wfCatalogCode: null,
                wfCatalogVersion: null,
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                appCatalogCode: entity.getAppCatalogCode() || null,
                appCatalogVersion: entity.getAppCatalogVersion() || null,
                template: entity.getTemplate(),
                attributes: entity.getAttributes() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * ドキュメントレコード更新
     * @param em
     * @param documentId
     * @param entity
     */
    static async updateDocumentRecord (em: EntityManager, documentId: number, entity: Document): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Document)
            .set({
                myConditionBookId: entity.getMyConditionBookId(),
                sourceId: entity.getSourceId(),
                docIdentifier: entity.docIdentifier,
                docCatalogCode: entity.getdocCatalogCode(),
                docCatalogVersion: entity.getdocCatalogVersion(),
                docCreateAt: entity.getdocCreateAt(),
                docActorCode: entity.getdocActorCode(),
                docActorVersion: entity.getdocActorVersion(),
                wfCatalogCode: null,
                wfCatalogVersion: null,
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                appCatalogCode: entity.getAppCatalogCode() || null,
                appCatalogVersion: entity.getAppCatalogVersion() || null,
                template: entity.getTemplate(),
                attributes: entity.getAttributes() || null,
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: documentId })
            .execute();
        return ret;
    }

    /**
     * ドキュメントイベントセットリレーションレコード追加
     * @param em
     * @param entity
     */
    static async insertDocumentEventSetRelationRecord (em: EntityManager, entity: DocumentEventSetRelation): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(DocumentEventSetRelation)
            .values({
                documentId: entity.getDocumentId(),
                title: entity.getTitle(),
                attributes: entity.getAttributes() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * ドキュメントイベントセットリレーションレコード更新
     * @param em
     * @param docEventSetId
     * @param entity
     */
    static async updateDocumentEventSetRelationRecord (em: EntityManager, entity: DocumentEventSetRelation): Promise<UpdateResult> {
        const ret = await em
            .createQueryBuilder()
            .update(DocumentEventSetRelation)
            .set({
                documentId: entity.getDocumentId(),
                title: entity.getTitle(),
                attributes: entity.getAttributes() || null,
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: entity.getId() })
            .execute();
        return ret;
    }

    /**
     * イベントセットイベントリレーションレコード追加
     * @param em
     * @param entity
     */
    static async insertEventSetEventRelation (em: EntityManager, entity: EventSetEventRelation): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(EventSetEventRelation)
            .values({
                eventSetId: entity.getEventSetId(),
                eventId: entity.getEventId(),
                sourceIdAtCreated: entity.getSourceIdCreated() || null,
                attributes: entity.getAttributes() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * イベントセットイベントリレーションレコード更新
     * @param em
     * @param id
     * @param entity
     */
    static async updateEventSetEventRelation (em: EntityManager, entity: EventSetEventRelation): Promise<UpdateResult> {
        const ret = await em
            .createQueryBuilder()
            .update(EventSetEventRelation)
            .set({
                eventSetId: entity.getEventSetId(),
                eventId: entity.getEventId(),
                sourceIdAtCreated: entity.getSourceIdCreated() || null,
                attributes: entity.getAttributes() || null,
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: entity.getId() })
            .execute();
        return ret;
    }

    /**
     * CMatrixモノレコード追加
     * @param em
     * @param entity
     */
    static async insertCMatrixThingRecord (em: EntityManager, entity: CmatrixThing): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(CmatrixThing)
            .values({
                cmatrixEventId: entity.getCmatrixEventId(),
                thingIdentifier: entity.getThingIdentifier(),
                thingCatalogCode: entity.getThingCatalogCode(),
                thingCatalogVersion: entity.getThingCatalogVersion(),
                thingActorCode: entity.getThingActorCode(),
                thingActorVersion: entity.getThingActorVersion(),
                thingWfCatalogCode: null,
                thingWfCatalogVersion: null,
                thingWfRoleCode: null,
                thingWfRoleVersion: null,
                thingWfStaffIdentifier: null,
                thingAppCatalogCode: entity.getThingAppCatalogCode() || null,
                thingAppCatalogVersion: entity.getThingAppCatalogVersion() || null,
                rowHash: entity.getRowHash(),
                rowHashCreateAt: entity.getRowHashCreateAt(),
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * CMatrixモノレコード更新
     * @param em
     * @param entity
     */
    static async updateCMatrixThingRecord (em: EntityManager, entity: CmatrixThing): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(CmatrixThing)
            .set({
                cmatrixEventId: entity.getCmatrixEventId(),
                thingIdentifier: entity.getThingIdentifier(),
                thingCatalogCode: entity.getThingCatalogCode(),
                thingCatalogVersion: entity.getThingCatalogVersion(),
                thingActorCode: entity.getThingActorCode(),
                thingActorVersion: entity.getThingActorVersion(),
                thingWfCatalogCode: null,
                thingWfCatalogVersion: null,
                thingWfRoleCode: null,
                thingWfRoleVersion: null,
                thingAppCatalogCode: entity.getThingAppCatalogCode() || null,
                thingAppCatalogVersion: entity.getThingAppCatalogVersion() || null,
                rowHash: entity.getRowHash(),
                rowHashCreateAt: entity.getRowHashCreateAt(),
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: entity.id })
            .execute();
        return ret;
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
        // SQLを生成及び実行
        let sql = em
            .createQueryBuilder()
            .update(CmatrixThing)
            .set({
                isDisabled: true,
                updatedBy: register
            });
        if (cmatrixEventId) {
            sql = sql.andWhere('cmatrix_event_id = :cmatrix_event_id', { cmatrix_event_id: cmatrixEventId });
        }
        if (cmatrixThingId) {
            sql = sql.andWhere('id = :id', { id: cmatrixThingId });
        }
        if (thingIdentifier) {
            sql = sql.andWhere('"4_1_1" = :thing_identifier', { thing_identifier: thingIdentifier });
        }
        const ret = await sql.execute();
        return ret;
    }

    /**
     * Cmatrixモノレコード削除
     * @param em
     * @param cmatrixEventId
     * @param cmatrixThingId
     * @param thingIdentifier
     * @param register
     */
    static async deleteCMatrixThings (em: EntityManager, cmatrixThingIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(CmatrixThing)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('id IN (:...ids)', { ids: cmatrixThingIds })
            .execute();
        return ret;
    }

    /**
     * CmatrixFloatingColumnレコード追加
     * @param em
     * @param entity
     */
    static async insertCmatrixFloatingColumnRecord (em: EntityManager, entity: CmatrixFloatingColumn): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(CmatrixFloatingColumn)
            .values({
                cmatrixThingId: entity.getCmatrixThingId(),
                indexKey: entity.getIndexKey(),
                value: entity.getValue(),
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * CmatrixFloatingColumnレコード削除
     * @param em
     * @param cmatrixThingId
     * @param index
     * @param register
     */
    static async deleteCmatrixFloatingColumnRecord (em: EntityManager, cmatrixThingId: number, index: string, register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        let sql = em
            .createQueryBuilder()
            .update(CmatrixFloatingColumn)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('cmatrix_thing_id = :cmatrix_thing_id', { cmatrix_thing_id: cmatrixThingId });
        if (index) {
            sql = sql.andWhere('index_key like :index', { index: index + '%' });
        }
        const ret = await sql.execute();
        return ret;
    }

    /**
     * CmatrixFloatingColumnレコード削除
     * @param em
     * @param cmatrixThingId
     * @param index
     * @param register
     */
    static async deleteCmatrixFloatingColumns (em: EntityManager, cmatrixThingIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(CmatrixFloatingColumn)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('cmatrix_thing_id IN (:...cmatrixThingIds)', { cmatrixThingIds: cmatrixThingIds })
            .execute();
        return ret;
    }

    /**
     * モノレコード追加
     * @param em
     * @param entity
     */
    static async insertThingRecord (em: EntityManager, entity: Thing): Promise<InsertResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(Thing)
            .values({
                eventId: entity.getEventId(),
                sourceId: entity.getSourceId(),
                thingIdentifier: entity.getThingIdentifier(),
                thingCatalogCode: entity.getThingCatalogCode(),
                thingCatalogVersion: entity.getThingCatalogVersion(),
                thingActorCode: entity.getThingActorCode(),
                thingActorVersion: entity.getThingActorVersion(),
                wfCatalogCode: null,
                wfCatalogVersion: null,
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                appCatalogCode: entity.getAppCatalogCode() || null,
                appCatalogVersion: entity.getAppCatalogVersion() || null,
                template: entity.getTemplate(),
                attributes: entity.getAttributes() || null,
                createdBy: entity.getCreatedBy(),
                updatedBy: entity.getUpdatedBy()
            })
            .execute();
        return ret;
    }

    /**
     * モノレコード更新
     * @param em
     * @param entity
     */
    static async updateThingRecord (em: EntityManager, thingId: number, entity: Thing): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Thing)
            .set({
                wfRoleCode: null,
                wfRoleVersion: null,
                wfStaffIdentifier: null,
                template: entity.getTemplate(),
                updatedBy: entity.getUpdatedBy()
            })
            .where('id = :id', { id: thingId })
            .execute();
        return ret;
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventId
     * @param sourceId
     * @param register
     */
    static async deleteThingRecord (em: EntityManager, eventId: number | number[], sourceId: string, register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        let sql = em
            .createQueryBuilder()
            .update(Thing)
            .set({
                isDisabled: true,
                updatedBy: register
            });
        if (Array.isArray(eventId)) {
            sql = sql.andWhere('event_id IN (:...ids)', { ids: eventId });
        } else {
            sql = sql.where('event_id = :event_id', { event_id: eventId });
        }
        if (sourceId) {
            sql = sql.where('source_id = :source_id', { source_id: sourceId });
        }
        const ret = await sql.execute();
        return ret;
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventId
     * @param sourceId
     * @param register
     */
    static async deleteThings (em: EntityManager, thingIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Thing)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('id IN (:...ids)', { ids: thingIds })
            .execute();
        return ret;
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventId
     * @param sourceId
     * @param register
     */
    static async deleteThingsForEventIds (em: EntityManager, eventIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Thing)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('event_id IN (:...event_ids)', { event_ids: eventIds })
            .execute();
        return ret;
    }

    /**
     * モノレコード削除
     * @param em
     * @param eventIds
     */
    static async physicalDeleteThingsForEventIds (em: EntityManager, eventIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(Thing)
            .andWhere('event_id IN (:...event_ids)', { event_ids: eventIds })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)リレーションレコード削除
     * @param em
     * @param cmatrix2nRelationIds
     * @param register
     */
    static async deleteCMatrix2nRelations (em: EntityManager, cmatrix2nRelationIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Cmatrix2nRelation)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('id IN (:...ids)', { ids: cmatrix2nRelationIds })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)リレーションレコードを登録
     * @param em
     * @param entity
     */
    static async insertCMatrix2nRelationReceord (em: EntityManager, entity: Cmatrix2nRelation): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(Cmatrix2nRelation)
            .values({
                nDocumentNo: entity.nDocumentNo,
                cmatrixEventId: entity.cmatrixEventId,
                cmatrix2nId: entity.cmatrix2nId,
                createdBy: entity.createdBy,
                updatedBy: entity.updatedBy
            })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)リレーションレコードを更新
     * @param em
     * @param entity
     */
    static async updateCMatrix2nRelationReceord (em: EntityManager, entity: Cmatrix2nRelation): Promise<UpdateResult> {
        const ret = await em
            .createQueryBuilder()
            .update(Cmatrix2nRelation)
            .set({
                nDocumentNo: entity.nDocumentNo,
                cmatrixEventId: entity.cmatrixEventId,
                cmatrix2nId: entity.cmatrix2nId,
                updatedBy: entity.updatedBy
            })
            .where('id = :id', { id: entity.id })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)レコード削除
     * @param em
     * @param cmatrix2nId
     * @param register
     */
    static async deleteCMatrix2nRecord (em: EntityManager, cmatrix2nId: number, register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        let sql = em
            .createQueryBuilder()
            .update(Cmatrix2n)
            .set({
                isDisabled: true,
                updatedBy: register
            });
        if (cmatrix2nId) {
            sql = sql.andWhere('id = :id', { id: cmatrix2nId });
        }
        const ret = await sql.execute();
        return ret;
    }

    /**
     * CMatrix2(n)レコード削除
     * @param em
     * @param cmatrix2nId
     * @param register
     */
    static async deleteCMatrix2ns (em: EntityManager, cmatrix2nIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Cmatrix2n)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .where('id IN (:...ids)', { ids: cmatrix2nIds })
            .execute();
        return ret;
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
                .innerJoin(EventSetEventRelation, 'event_set_event_relation', 'event_set_event_relation.event_set_id = document_event_set_relation.id')
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
                                        subQb2.andWhere(`document.doc_catalog_code = :doc_catalog_code${index}`, { [`doc_catalog_code${index}`]: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere(`document.doc_catalog_version = :doc_catalog_version${index}`, { [`doc_catalog_version${index}`]: code[index]._ver });
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
                                        subQb2.andWhere(`event.event_catalog_code = :event_catalog_code${index}`, { [`event_catalog_code${index}`]: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere(`event.event_catalog_version = :event_catalog_version${index}`, { [`event_catalog_version${index}`]: code[index]._ver });
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
                                        subQb2.andWhere(`thing.thing_catalog_code = :thing_catalog_code${index}`, { [`thing_catalog_code${index}`]: code[index]._value });
                                    }
                                    if (code[index]._ver) {
                                        subQb2.andWhere(`thing.thing_catalog_version = :thing_catalog_version${index}`, { [`thing_catalog_version${index}`]: code[index]._ver });
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

    /**
     * BookをuserIdとwfまたはappをもとに取得
     * @param userId
     * @param wfCode
     * @param appCode
     */
    static async getBookByUserIdWithProvider (userId: string, wfCode: number, appCode: number): Promise<MyConditionBook[]> {
        const connection = await connectDatabase();
        const repository = getRepository(MyConditionBook, connection.name);
        let sql = repository
            .createQueryBuilder('my_condition_book')
            .where('user_id = :userId', { userId: userId })
            .andWhere('is_disabled = :is_disabled', { is_disabled: false });

        sql = sql.andWhere('app_catalog_code = :app', { app: appCode });

        sql = sql.orderBy('id', 'ASC');

        const ret = await sql.getRawMany();
        const list: MyConditionBook[] = [];
        ret.forEach(element => {
            list.push(new MyConditionBook(element));
        });
        return list;
    }

    /**
     * 共有アクセスログの登録
     * @param accessLog 共有アクセスログ
     */
    static async insertShareAccessLog (accessLog: ShareAccessLog) {
        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // SQLを生成及び実行
            const ret = await trans
                .createQueryBuilder()
                .insert()
                .into(ShareAccessLog)
                .values({
                    myConditionBookId: accessLog.myConditionBookId,
                    logIdentifier: accessLog.logIdentifier,
                    userName: accessLog.userName,
                    dataType: accessLog.dataType,
                    shareCatalogCode: accessLog.shareCatalogCode,
                    reqActorCatalogCode: accessLog.reqActorCatalogCode,
                    reqActorCatalogVersion: accessLog.reqActorCatalogVersion,
                    reqBlockCatalogCode: accessLog.reqBlockCatalogCode,
                    reqBlockCatalogVersion: accessLog.reqBlockCatalogVersion,
                    accessAt: moment(accessLog.accessAt).utc().format('YYYY-MM-DD HH:mm:ss'),
                    createdBy: accessLog.createdBy,
                    updatedBy: accessLog.updatedBy
                })
                .execute();
            for (const dataType of accessLog.dataTypes) {
                await trans
                    .createQueryBuilder()
                    .insert()
                    .into(ShareAccessLogDataType)
                    .values({
                        shareAccessLogId: Number(ret.identifiers[0].id),
                        dataType: dataType.dataType,
                        dataTypeCatalogCode: dataType.dataTypeCatalogCode,
                        dataTypeCatalogVersion: dataType.dataTypeCatalogVersion,
                        createdBy: dataType.createdBy,
                        updatedBy: dataType.updatedBy
                    })
                    .execute();
            }
        });
    }

    /**
     * 共有アクセスログの取得
     * @param bookId
     * @param start
     * @param end
     * @param code
     */
    static async getShareAccessLog (bookId: number, start: Date, end: Date, documents: CodeVersionObject[], events: CodeVersionObject[], things: CodeVersionObject[]): Promise<ShareAccessLog[]> {
        const connection = await connectDatabase();
        const repository = getRepository(ShareAccessLog, connection.name);

        // 期間指定でログを取得
        let sql = repository
            .createQueryBuilder('shared_access_log')
            .where('my_condition_book_id = :bookId', { bookId: bookId });
        if (start) {
            sql = sql.andWhere('access_at >= :start', { start: moment(start).utc().format('YYYY-MM-DD HH:mm:ss') });
        }
        if (end) {
            sql = sql.andWhere('access_at <= :end', { end: moment(end).utc().format('YYYY-MM-DD HH:mm:ss') });
        }
        sql = sql.orderBy('id', 'ASC');

        const ret1 = await sql.getRawMany();
        const logList: ShareAccessLog[] = [];
        ret1.forEach(element => {
            logList.push(new ShareAccessLog(element));
        });

        // ログに紐づくデータ種を取得
        const resultList: ShareAccessLog[] = [];
        if (logList.length > 0) {
            // 1件も指定がない場合は全件取得
            if (!documents && !events && !things) {
                for (const log of logList) {
                    const dataTypeRepository = getRepository(ShareAccessLogDataType, connection.name);
                    const ret2 = await dataTypeRepository
                        .createQueryBuilder('shared_access_log_data_type')
                        .where('share_access_log_id = :logId', { logId: log.id })
                        .andWhere('is_disabled = :is_disabled', { is_disabled: false })
                        .orderBy('id', 'ASC')
                        .getRawMany();
                    const dataTypeList: ShareAccessLogDataType[] = [];
                    ret2.forEach(element => {
                        dataTypeList.push(new ShareAccessLogDataType(element));
                    });
                    if (dataTypeList.length > 0) {
                        log.dataTypes = dataTypeList;
                        resultList.push(log);
                    }
                }
            } else {
                // 1件でも指定がある場合は指定のデータ種を取得
                const docList: number[] = [];
                const eventList: number[] = [];
                const thingList: number[] = [];

                if (documents && documents.length > 0) {
                    for (const document of documents) {
                        docList.push(document._value);
                    }
                }

                if (events && events.length > 0) {
                    for (const event of events) {
                        eventList.push(event._value);
                    }
                }

                if (things && things.length > 0) {
                    for (const thing of things) {
                        thingList.push(thing._value);
                    }
                }

                for (const log of logList) {
                    const dataTypeRepository2 = getRepository(ShareAccessLogDataType, connection.name);
                    const dataTypeList: ShareAccessLogDataType[] = [];

                    // ドキュメントを取得
                    if (docList.length > 0) {
                        const docResult = await dataTypeRepository2
                            .createQueryBuilder('shared_access_log_data_type')
                            .where('share_access_log_id = :logId', { logId: log.id })
                            .andWhere('data_type = :data_type', { data_type: ShareAccessLogDataType.DATA_TYPE_DOCUMENT })
                            .andWhere('is_disabled = :is_disabled', { is_disabled: false })
                            .andWhere('data_type_catalog_code IN (:...code)', { code: docList })
                            .orderBy('id', 'ASC')
                            .getRawMany();
                        docResult.forEach(element => {
                            dataTypeList.push(new ShareAccessLogDataType(element));
                        });
                    }

                    // イベントを取得
                    if (eventList.length > 0) {
                        const eventResult = await dataTypeRepository2
                            .createQueryBuilder('shared_access_log_data_type')
                            .where('share_access_log_id = :logId', { logId: log.id })
                            .andWhere('data_type = :data_type', { data_type: ShareAccessLogDataType.DATA_TYPE_EVENT })
                            .andWhere('is_disabled = :is_disabled', { is_disabled: false })
                            .andWhere('data_type_catalog_code IN (:...code)', { code: eventList })
                            .orderBy('id', 'ASC')
                            .getRawMany();
                        eventResult.forEach(element => {
                            dataTypeList.push(new ShareAccessLogDataType(element));
                        });
                    }

                    // モノを取得
                    if (thingList.length > 0) {
                        const thingResult = await dataTypeRepository2
                            .createQueryBuilder('shared_access_log_data_type')
                            .where('share_access_log_id = :logId', { logId: log.id })
                            .andWhere('data_type = :data_type', { data_type: ShareAccessLogDataType.DATA_TYPE_THING })
                            .andWhere('is_disabled = :is_disabled', { is_disabled: false })
                            .andWhere('data_type_catalog_code IN (:...code)', { code: thingList })
                            .orderBy('id', 'ASC')
                            .getRawMany();
                        thingResult.forEach(element => {
                            dataTypeList.push(new ShareAccessLogDataType(element));
                        });
                    }

                    if (dataTypeList.length > 0) {
                        log.dataTypes = dataTypeList;
                        resultList.push(log);
                    }
                }
            }
        }

        return resultList;
    }

    /**
     * CMatrixイベントレコード取得
     * @param userId
     * @param dataTypeCode
     * @param dataTypeVersion
     */
    static async getCMatrixEventForGetContract (userId: string, dataTypeCode: number, dataTypeVersion: number, offset: number, limit: number): Promise<CmatrixEvent[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);
        let sql = repository
            .createQueryBuilder('cmatrix_event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"1_1" = :userId', { userId: userId })
            .andWhere('"3_1_2_1" = :dataTypeCode', { dataTypeCode: dataTypeCode })
            .andWhere('"3_1_2_2" = :dataTypeVersion', { dataTypeVersion: dataTypeVersion });
        if (offset && limit) {
            sql = sql.offset(offset).limit(limit);
        }
        const ret = await sql.getRawMany();
        const eventList: CmatrixEvent[] = [];
        if (ret) {
            ret.forEach(element => {
                eventList.push(new CmatrixEvent(element));
            });
        }

        // CMatrixイベントに紐づく対象のCMatrixモノを取得
        for (const event of eventList) {
            const repository2 = getRepository(CmatrixThing, connection.name);
            const sql2 = repository2
                .createQueryBuilder('cmatrix_thing')
                .select('*')
                .where('is_disabled = :is_disabled', { is_disabled: false })
                .andWhere('cmatrix_event_id = :event_id', { event_id: event.id });
            const ret2 = await sql2.getRawMany();
            const thingList: CmatrixThing[] = [];
            if (ret2) {
                ret2.forEach(element => {
                    thingList.push(new CmatrixThing(element));
                });
            }
            event.cmatrixThing = thingList;
        }
        return eventList;
    }

    /**
     * CMatrixイベントレコード取得(documentを含む)
     * @param userId
     * @param dataTypeCode
     * @param dataTypeVersion
     */
    static async getCMatrixDocumentForGetContract (userId: string, dataTypeCode: number, dataTypeVersion: number, offset: number, limit: number): Promise<CmatrixEvent[]> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);

        // 対象のCMatrixイベントを取得
        let sql = repository
            .createQueryBuilder('cmatrix_event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"1_1" = :userId', { userId: userId })
            .andWhere('id IN ' +
                `(
                    SELECT cmatrix_2_n_relation.cmatrix_event_id
                    FROM pxr_book_operate.cmatrix_2_n
                    LEFT JOIN pxr_book_operate.cmatrix_2_n_relation
                    ON cmatrix_2_n.id = cmatrix_2_n_relation.cmatrix_2n_id
                    WHERE cmatrix_2_n.is_disabled = false
                    AND cmatrix_2_n."_1_2_1" = :code
                    AND cmatrix_2_n."_1_2_2" = :ver
                )`
            , { code: dataTypeCode, ver: dataTypeVersion });
        if (offset && limit) {
            sql = sql.offset(offset).limit(limit);
        }
        const ret = await sql.getRawMany();
        const eventList: CmatrixEvent[] = [];
        if (ret) {
            ret.forEach(element => {
                eventList.push(new CmatrixEvent(element));
            });
        }

        for (const event of eventList) {
            // CMatrixイベントに紐づく対象のCMatrixドキュメントを取得
            const repository2 = getRepository(Cmatrix2n, connection.name);
            const sql2 = repository2
                .createQueryBuilder('cmatrix_2_n')
                .select('*')
                .where('is_disabled = :is_disabled', { is_disabled: false })
                .andWhere('"_1_2_1" = :code', { code: dataTypeCode })
                .andWhere('"_1_2_2" = :ver', { ver: dataTypeVersion })
                .andWhere('id IN ' +
                    `(
                        SELECT cmatrix_2_n_relation.cmatrix_2n_id
                        FROM pxr_book_operate.cmatrix_event
                        LEFT JOIN pxr_book_operate.cmatrix_2_n_relation
                        ON cmatrix_event.id = cmatrix_2_n_relation.cmatrix_event_id
                        WHERE cmatrix_event.is_disabled = false
                        AND cmatrix_event.id = :event_id
                    )`
                , { event_id: event.id });
            const ret2 = await sql2.getRawMany();
            const docList: Cmatrix2n[] = [];
            if (ret2) {
                ret2.forEach(element => {
                    docList.push(new Cmatrix2n(element));
                });
            }
            event.cmatrixDoc = docList;

            // CMatrixイベントに紐づくCMatrixモノを取得
            const repository3 = getRepository(CmatrixThing, connection.name);
            const sql3 = repository3
                .createQueryBuilder('cmatrix_thing')
                .select('*')
                .where('is_disabled = :is_disabled', { is_disabled: false })
                .andWhere('cmatrix_event_id = :event_id', { event_id: event.id });
            const ret3 = await sql3.getRawMany();
            const thingList: CmatrixThing[] = [];
            if (ret3) {
                ret3.forEach(element => {
                    thingList.push(new CmatrixThing(element));
                });
            }
            event.cmatrixThing = thingList;
        }

        return eventList;
    }

    /**
     * CMatrixイベントレコード件数取得
     * @param userId
     * @param dataTypeCode
     * @param dataTypeVersion
     */
    static async countCMatrixEventForGetContract (userId: string, dataTypeCode: number, dataTypeVersion: number): Promise<number> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);
        const sql = repository
            .createQueryBuilder('cmatrix_event')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"1_1" = :userId', { userId: userId })
            .andWhere('"3_1_2_1" = :dataTypeCode', { dataTypeCode: dataTypeCode })
            .andWhere('"3_1_2_2" = :dataTypeVersion', { dataTypeVersion: dataTypeVersion });
        const ret = await sql.getCount();
        return ret;
    }

    /**
     * CMatrixイベントレコード件数取得(documentを含む)
     * @param userId
     * @param dataTypeCode
     * @param dataTypeVersion
     */
    static async countCMatrixDocumentForGetContract (userId: string, dataTypeCode: number, dataTypeVersion: number): Promise<number> {
        const connection = await connectDatabase();
        const repository = getRepository(CmatrixEvent, connection.name);

        // 対象のCMatrixイベントを取得
        const sql = repository
            .createQueryBuilder('cmatrix_event')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"1_1" = :userId', { userId: userId })
            .andWhere('id IN ' +
                `(
                    SELECT cmatrix_2_n_relation.cmatrix_event_id
                    FROM pxr_book_operate.cmatrix_2_n
                    LEFT JOIN pxr_book_operate.cmatrix_2_n_relation
                    ON cmatrix_2_n.id = cmatrix_2_n_relation.cmatrix_2n_id
                    WHERE cmatrix_2_n.is_disabled = false
                    AND cmatrix_2_n."_1_2_1" = :code
                    AND cmatrix_2_n."_1_2_2" = :ver
                )`
            , { code: dataTypeCode, ver: dataTypeVersion });
        const ret = await sql.getCount();
        return ret;
    }

    /**
     * 利用者IDによるデータ収集依頼提供同意取得
     */
    static async getCollectionRequestConsentForUserId (collectionRequestId: number, userId: string): Promise<CollectionRequestConsent> {
        const connection = await connectDatabase();
        const repository = getRepository(CollectionRequestConsent, connection.name);
        const ret = await repository
            .createQueryBuilder('collection_request_consent')
            .where('collection_request_id = :collection_request_id', { collection_request_id: collectionRequestId })
            .andWhere('user_id = :user_id', { user_id: userId })
            .andWhere('is_disabled = :is_disabled', { is_disabled: false })
            .getRawOne();
        return ret ? new CollectionRequestConsent(ret) : null;
    }

    /**
     * バイナリファイルレコード削除
     * @param em
     * @param thingIds
     * @param register
     */
    static async deleteBinaryFiles (em: EntityManager, thingIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(BinaryFile)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('thing_id IN (:...ids)', { ids: thingIds })
            .execute();
        return ret;
    }

    /**
     * バイナリファイルレコード削除
     * @param em
     * @param thingIds
     */
    static async physicalDeleteBinaryFiles (em: EntityManager, thingIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(BinaryFile)
            .andWhere('thing_id IN (:...ids)', { ids: thingIds })
            .execute();
        return ret;
    }

    /**
     * ドキュメントレコード取得
     * @param userId
     * @param documentIdentifer
     * @param sourceId
     */
    static async getDocumentRecord (userId: string, documentIdentifer: string, sourceId: string): Promise<Document[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Document, connection.name);
        let sql = repository
            .createQueryBuilder('document')
            .select('document.*')
            .innerJoin(MyConditionBook, 'my_condition_book', 'my_condition_book.id = document.my_condition_book_id')
            .where('document.is_disabled = :document_is_disabled', { document_is_disabled: false })
            .andWhere('my_condition_book.is_disabled = :my_condition_book_is_disabled', { my_condition_book_is_disabled: false })
            .andWhere('my_condition_book.user_id = :user_id', { user_id: userId });
        if (documentIdentifer) {
            sql = sql.andWhere('document.doc_identifier = :doc_identifier', { doc_identifier: documentIdentifer });
        }
        if (sourceId) {
            sql = sql.andWhere('document.source_id = :source_id', { source_id: sourceId });
        }
        sql = sql.orderBy('document.id');
        const ret = await sql.getRawMany();
        const list: Document[] = [];
        ret.forEach(element => {
            list.push(new Document(element));
        });
        return list;
    }

    /**
     * ドキュメントイベントセットリレーションレコード取得
     * @param documentId
     */
    static async getDocumentEventSetRelations (documentIds: number[]): Promise<DocumentEventSetRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(DocumentEventSetRelation, connection.name);
        const ret = await repository
            .createQueryBuilder('document_event_set_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('document_id IN (:...ids)', { ids: documentIds })
            .orderBy('document_id')
            .getRawMany();
        const list: DocumentEventSetRelation[] = [];
        ret.forEach(element => {
            list.push(new DocumentEventSetRelation(element));
        });
        return list;
    }

    /**
     * ドキュメントレコード削除
     * @param em
     * @param documentIds
     * @param register
     */
    static async deleteDocuments (em: EntityManager, documentIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(Document)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('id IN (:...ids)', { ids: documentIds })
            .execute();
        return ret;
    }

    /**
     * ドキュメントレコード削除
     * @param em
     * @param documentIds
     */
    static async physicalDeleteDocuments (em: EntityManager, documentIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(Document)
            .andWhere('id IN (:...ids)', { ids: documentIds })
            .execute();
        return ret;
    }

    /**
     * ドキュメントイベントセットリレーションレコード削除
     * @param em
     * @param documentIds
     * @param register
     */
    static async deleteDocumentEventSetRelations (em: EntityManager, documentIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(DocumentEventSetRelation)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('document_id IN (:...ids)', { ids: documentIds })
            .execute();
        return ret;
    }

    /**
     * イベントセットイベントリレーションレコード削除
     * @param em
     * @param eventSetIds
     * @param register
     */
    static async deleteEventSetEventRelations (em: EntityManager, eventSetIds: number[], register: string): Promise<UpdateResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .update(EventSetEventRelation)
            .set({
                isDisabled: true,
                updatedBy: register
            })
            .andWhere('event_set_id IN (:...ids)', { ids: eventSetIds })
            .execute();
        return ret;
    }

    /**
     * ドキュメントイベントセットリレーションレコード削除
     * @param em
     * @param documentIds
     */
    static async physicalDeleteDocumentEventSetRelations (em: EntityManager, documentIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(DocumentEventSetRelation)
            .andWhere('document_id IN (:...ids)', { ids: documentIds })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)レコード登録
     * @param em
     * @param entity
     */
    static async insertCMatrix2nRecord (em: EntityManager, entity: Cmatrix2n): Promise<InsertResult> {
        const ret = await em
            .createQueryBuilder()
            .insert()
            .into(Cmatrix2n)
            .values({
                docIdentifier: entity.docIdentifier,
                docCatalogCode: entity.docCatalogCode,
                docCatalogVersion: entity.docCatalogVersion,
                docCreateAt: entity.docCreateAt,
                docActorCode: entity.docActorCode,
                docActorVersion: entity.docActorVersion,
                docWfCatalogCode: entity.docWfCatalogCode,
                docWfCatalogVersion: entity.docWfCatalogVersion,
                docWfRoleCode: entity.docWfRoleCode,
                docWfRoleVersion: entity.docWfRoleVersion,
                docWfStaffIdentifier: entity.docWfStaffIdentifier,
                docAppCatalogCode: entity.docAppCatalogCode,
                docAppCatalogVersion: entity.docAppCatalogVersion,
                createdBy: entity.createdBy,
                updatedBy: entity.updatedBy
            })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)レコード更新
     * @param em
     * @param entity
     */
    static async updateCMatrix2nRecord (em: EntityManager, entity: Cmatrix2n): Promise<UpdateResult> {
        const ret = await em
            .createQueryBuilder()
            .update(Cmatrix2n)
            .set({
                docIdentifier: entity.docIdentifier,
                docCatalogCode: entity.docCatalogCode,
                docCatalogVersion: entity.docCatalogVersion,
                docCreateAt: entity.docCreateAt,
                docActorCode: entity.docActorCode,
                docActorVersion: entity.docActorVersion,
                docWfCatalogCode: entity.docWfCatalogCode,
                docWfCatalogVersion: entity.docWfCatalogVersion,
                docWfRoleCode: entity.docWfRoleCode,
                docWfRoleVersion: entity.docWfRoleVersion,
                docWfStaffIdentifier: entity.docWfStaffIdentifier,
                docAppCatalogCode: entity.docAppCatalogCode,
                docAppCatalogVersion: entity.docAppCatalogVersion,
                createdBy: entity.createdBy,
                updatedBy: entity.updatedBy
            })
            .where('id = :id', { id: entity.id })
            .execute();
        return ret;
    }

    /**
     * イベントセットイベントリレーションレコード削除
     * @param em
     * @param eventSetIds
     */
    static async physicalDeleteEventSetEventRelations (em: EntityManager, eventSetIds: number[]): Promise<DeleteResult> {
        // SQLを生成及び実行
        const ret = await em
            .createQueryBuilder()
            .delete()
            .from(EventSetEventRelation)
            .andWhere('event_set_id IN (:...ids)', { ids: eventSetIds })
            .execute();
        return ret;
    }

    /**
     * CMatrix2(n)レコード取得
     * @param docmentIdentifier
     */
    static async getCMatrix2nsByDocumentIdentifier (documentIdentifiers: string[]): Promise<Cmatrix2n[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2n, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_2_n')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('"_1_1" IN (:...documentIdentifiers)', { documentIdentifiers: documentIdentifiers })
            .getRawMany();
        const list: Cmatrix2n[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new Cmatrix2n(element));
            });
        }
        return list;
    }

    /**
     * CMatrix2(n)レコード取得
     * @param docmentIdentifier
     */
    static async getCMatrix2nsByCMatrix2nIds (cMatrix2nIds: number[]): Promise<Cmatrix2n[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2n, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_2_n')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('id IN (:...ids)', { ids: cMatrix2nIds })
            .getRawMany();
        const list: Cmatrix2n[] = [];
        if (ret) {
            ret.forEach(element => {
                list.push(new Cmatrix2n(element));
            });
        }
        return list;
    }

    /**
     * CMatrix2(n)列リレーションレコード取得
     * @param cmatrix2nId
     */
    static async getCMatrix2nRelationRecordByCMatrix2nId (cmatrix2nId: number): Promise<Cmatrix2nRelation[]> {
        const connection = await connectDatabase();
        const repository = getRepository(Cmatrix2nRelation, connection.name);
        const ret = await repository
            .createQueryBuilder('cmatrix_2n_relation')
            .select('*')
            .where('is_disabled = :is_disabled', { is_disabled: false })
            .andWhere('cmatrix_2n_id = :cmatrix2nId', { cmatrix2nId: cmatrix2nId })
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
}
