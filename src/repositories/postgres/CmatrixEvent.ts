/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import CmatrixThing from './CmatrixThing';
import Cmatrix2n from './Cmatrix2n';
/* eslint-enable */
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * CMatrixイベントテーブルエンティティ
 */
@Entity('cmatrix_event')
export default class CmatrixEvent {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * 個人識別子
     */
    @Column({ type: 'varchar', length: 255, name: '1_1' })
    personIdentifier: string = '';

    /**
     * 生年月日
     */
    @Column({ type: 'timestamp without time zone', name: '1_2' })
    birthAt: Date = new Date();

    /**
     * 性別
     */
    @Column({ type: 'bigint', nullable: false, name: '1_3' })
    sex: number = 0;

    /**
     * イベント識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '3_1_1' })
    eventIdentifier: string = '';

    /**
     * イベント種別カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '3_1_2_1' })
    eventCatalogCode: number = 0;

    /**
     * イベント種別カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '3_1_2_2' })
    eventCatalogVersion: number = 0;

    /**
     * イベント開始時間
     */
    @Column({ type: 'timestamp without time zone', name: '3_2_1' })
    eventStartAt: Date = new Date();

    /**
     * イベント終了時間
     */
    @Column({ type: 'timestamp without time zone', name: '3_2_2' })
    eventEndAt: Date = new Date();

    /**
     * イベント発生位置
     */
    @Column({ type: 'varchar', length: 255, name: '3_3_1' })
    eventOutbreakPosition: string = '';

    /**
     * イベントを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '3_5_1_1' })
    eventActorCode: number = 0;

    /**
     * イベントを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '3_5_1_2' })
    eventActorVersion: number = 0;

    /**
     * ワークフロー識別子カタログコード
     */
    @Column({ type: 'bigint', name: '3_5_2_1' })
    eventWfCatalogCode: number = 0;

    /**
     * ワークフロー識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '3_5_2_2' })
    eventWfCatalogVersion: number = 0;

    /**
     * ワークフローロール識別子カタログコード
     */
    @Column({ type: 'bigint', name: '3_5_3_1' })
    eventWfRoleCode: number = 0;

    /**
     * ワークフローロール識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '3_5_3_2' })
    eventWfRoleVersion: number = 0;

    /**
     * ワークフロー職員識別子
     */
    @Column({ type: 'varchar', length: 255, name: '3_5_4' })
    eventWfStaffIdentifier: string = '';

    /**
     * アプリケーション識別子カタログコード
     */
    @Column({ type: 'bigint', name: '3_5_5_1' })
    eventAppCatalogCode: number = 0;

    /**
     * アプリケーション識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '3_5_5_2' })
    eventAppCatalogVersion: number = 0;

    /**
     * 削除フラグ
     */
    @Column({ type: 'boolean', nullable: false, default: false, name: 'is_disabled' })
    isDisabled: boolean = false;

    /**
     * 登録者
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'created_by' })
    createdBy: string = '';

    /**
     * 登録日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', nullable: false, default: 'NOW()', name: 'created_at' })
    readonly createdAt: Date = new Date();

    /**
     * 更新者
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'updated_by' })
    updatedBy: string = '';

    /**
     * 更新日時
     */
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: false, default: 'NOW()', name: 'updated_at' })
    readonly updatedAt: Date = new Date();

    cmatrixThing: CmatrixThing[];
    cmatrixDoc: Cmatrix2n[];

    /**
     * コンストラクタ
     * @param entity
     */
    constructor (entity?: {}) {
        if (entity) {
            this.id = entity['id'] ? Number(entity['id']) : 0;
            this.personIdentifier = entity['1_1'];
            this.birthAt = entity['1_2'] ? new Date(entity['1_2']) : null;
            this.sex = entity['1_3'];
            this.eventIdentifier = entity['3_1_1'];
            this.eventCatalogCode = Number(entity['3_1_2_1']);
            this.eventCatalogVersion = Number(entity['3_1_2_2']);
            this.eventStartAt = entity['3_2_1'] ? new Date(entity['3_2_1']) : null;
            this.eventEndAt = entity['3_2_2'] ? new Date(entity['3_2_2']) : null;
            this.eventOutbreakPosition = entity['3_3_1'];
            this.eventActorCode = Number(entity['3_5_1_1']);
            this.eventActorVersion = Number(entity['3_5_1_2']);
            this.eventWfCatalogCode = entity['3_5_2_1'] ? Number(entity['3_5_2_1']) : 0;
            this.eventWfCatalogVersion = entity['3_5_2_2'] ? Number(entity['3_5_2_2']) : 0;
            this.eventWfRoleCode = entity['3_5_3_1'] ? Number(entity['3_5_3_1']) : 0;
            this.eventWfRoleVersion = entity['3_5_3_2'] ? Number(entity['3_5_3_2']) : 0;
            this.eventWfStaffIdentifier = entity['3_5_4'];
            this.eventAppCatalogCode = entity['3_5_5_1'] ? Number(entity['3_5_5_1']) : 0;
            this.eventAppCatalogVersion = entity['3_5_5_2'] ? Number(entity['3_5_5_2']) : 0;
            this.isDisabled = entity['is_disabled'] ? Boolean(entity['is_disabled']) : false;
            this.createdBy = entity['created_by'];
            this.createdAt = entity['created_at'] ? new Date(entity['created_at']) : null;
            this.updatedBy = entity['updated_by'];
            this.updatedAt = entity['updated_at'] ? new Date(entity['updated_at']) : null;
        }
    }

    public getId (): number {
        return this.id;
    }

    public getPersonIdentifier (): string {
        return this.personIdentifier;
    }

    public getBirthAt (): Date {
        return this.birthAt;
    }

    public getSex (): number {
        return this.sex;
    }

    public getEventIdentifier (): string {
        return this.eventIdentifier;
    }

    public getEventCatalogCode (): number {
        return this.eventCatalogCode;
    }

    public getEventCatalogVersion (): number {
        return this.eventCatalogVersion;
    }

    public getEventStartAt (): Date {
        return this.eventStartAt;
    }

    public setEventStartAt (eventStartAt: Date): void {
        this.eventStartAt = eventStartAt;
    }

    public getEventEndAt (): Date {
        return this.eventEndAt;
    }

    public setEventEndAt (eventEndAt: Date): void {
        this.eventEndAt = eventEndAt;
    }

    public getEventOutbreakPosition (): string {
        return this.eventOutbreakPosition;
    }

    public setEventOutbreakPosition (eventOutbreakPosition: string): void {
        this.eventOutbreakPosition = eventOutbreakPosition;
    }

    public getEventActorCode (): number {
        return this.eventActorCode;
    }

    public getEventActorVersion (): number {
        return this.eventActorVersion;
    }

    public getEventWfCatalogCode (): number {
        return this.eventWfCatalogCode;
    }

    public getEventWfCatalogVersion (): number {
        return this.eventWfCatalogVersion;
    }

    public getEventWfRoleCode (): number {
        return this.eventWfRoleCode;
    }

    public setEventWfRoleCode (eventWfRoleCode: number): void {
        this.eventWfRoleCode = eventWfRoleCode;
    }

    public getEventWfRoleVersion (): number {
        return this.eventWfRoleVersion;
    }

    public setEventWfRoleVersion (eventWfRoleVersion: number): void {
        this.eventWfRoleVersion = eventWfRoleVersion;
    }

    public getEventWfStaffIdentifier (): string {
        return this.eventWfStaffIdentifier;
    }

    public setEventWfStaffIdentifier (eventWfStaffIdentifier: string): void {
        this.eventWfStaffIdentifier = eventWfStaffIdentifier;
    }

    public getEventAppCatalogCode (): number {
        return this.eventAppCatalogCode;
    }

    public getEventAppCatalogVersion (): number {
        return this.eventAppCatalogVersion;
    }

    public getCreatedBy (): string {
        return this.createdBy;
    }

    public getUpdatedBy (): string {
        return this.updatedBy;
    }
}
