/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * イベントテーブル
 */
@Entity('event')
export default class Event {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * my-condition-bookID
     */
    @Column({ type: 'bigint', nullable: false, name: 'my_condition_book_id' })
    myConditionBookId: number = 0;

    /**
     * ソースID
     */
    @Column({ type: 'varchar', length: 255, name: 'source_id' })
    sourceId: string = '';

    /**
     * イベント識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'event_identifier' })
    eventIdentifier: string = '';

    /**
     * イベント種別カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_catalog_code' })
    eventCatalogCode: number = 0;

    /**
     * イベント種別カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_catalog_version' })
    eventCatalogVersion: number = 0;

    /**
     * イベント開始時間
     */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'event_start_at' })
    eventStartAt: Date = new Date();

    /**
     * イベント終了時間
     */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'event_end_at' })
    eventEndAt: Date = new Date();

    /**
     * イベント発生位置
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_outbreak_position' })
    eventOutbreakPosition: number = 0;

    /**
     * イベントを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_actor_code' })
    eventActorCode: number = 0;

    /**
     * イベントを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_actor_version' })
    eventActorVersion: number = 0;

    /**
     * ワークフロー識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'wf_catalog_code' })
    wfCatalogCode: number = 0;

    /**
     * ワークフロー識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'wf_catalog_version' })
    wfCatalogVersion: number = 0;

    /**
     * ワークフローロール識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'wf_role_code' })
    wfRoleCode: number = 0;

    /**
     * ワークフローロール識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'wf_role_version' })
    wfRoleVersion: number = 0;

    /**
     * ワークフロー職員識別子
     */
    @Column({ type: 'varchar', length: 255, name: 'wf_staff_identifier' })
    wfStaffIdentifier: string = '';

    /**
     * アプリケーション識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'app_catalog_code' })
    appCatalogCode: number = 0;

    /**
     * アプリケーション識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'app_catalog_version' })
    appCatalogVersion: number = 0;

    /**
     * テンプレート
     */
    @Column({ type: 'text' })
    template: string = '';

    /**
     * 属性
     */
    @Column({ type: 'text' })
    attributes: string = '';

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

    /**
     * コンストラクタ
     * @param entity
     */
    constructor (entity?: {}) {
        if (entity) {
            this.id = entity['id'] ? Number(entity['id']) : 0;
            this.myConditionBookId = entity['my_condition_book_id'] ? Number(entity['my_condition_book_id']) : 0;
            this.sourceId = entity['source_id'];
            this.eventIdentifier = entity['event_identifier'];
            this.eventCatalogCode = entity['event_catalog_code'] ? Number(entity['event_catalog_code']) : 0;
            this.eventCatalogVersion = entity['event_catalog_version'] ? Number(entity['event_catalog_version']) : 0;
            this.eventStartAt = entity['event_start_at'] ? new Date(entity['event_start_at']) : null;
            this.eventEndAt = entity['event_end_at'] ? new Date(entity['event_end_at']) : null;
            this.eventOutbreakPosition = entity['event_outbreak_position'];
            this.eventActorCode = entity['event_actor_code'] ? Number(entity['event_actor_code']) : 0;
            this.eventActorVersion = entity['event_actor_version'] ? Number(entity['event_actor_version']) : 0;
            this.wfCatalogCode = entity['wf_catalog_code'] ? Number(entity['wf_catalog_code']) : 0;
            this.wfCatalogVersion = entity['wf_catalog_version'] ? Number(entity['wf_catalog_version']) : 0;
            this.wfRoleCode = entity['wf_role_code'] ? Number(entity['wf_role_code']) : 0;
            this.wfRoleVersion = entity['wf_role_version'] ? Number(entity['wf_role_version']) : 0;
            this.wfStaffIdentifier = entity['wf_staff_identifier'];
            this.appCatalogCode = entity['app_catalog_code'] ? Number(entity['app_catalog_code']) : 0;
            this.appCatalogVersion = entity['app_catalog_version'] ? Number(entity['app_catalog_version']) : 0;
            this.template = entity['template'];
            this.attributes = entity['attributes'];
            this.isDisabled = false;
            this.createdBy = entity['created_by'];
            this.createdAt = entity['created_at'] ? new Date(entity['created_at']) : null;
            this.updatedBy = entity['updated_by'];
            this.updatedAt = entity['updated_at'] ? new Date(entity['updated_at']) : null;
        }
    }

    public getId (): number {
        return this.id;
    }

    public getMyConditionBookId (): number {
        return this.myConditionBookId;
    }

    public getSourceId (): string {
        return this.sourceId;
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

    public getEventEndAt (): Date {
        return this.eventEndAt;
    }

    public getEventOutbreakPosition (): number {
        return this.eventOutbreakPosition;
    }

    public getEventActorCode (): number {
        return this.eventActorCode;
    }

    public getEventActorVersion (): number {
        return this.eventActorVersion;
    }

    public getWfCatalogCode (): number {
        return this.wfCatalogCode;
    }

    public getWfCatalogVersion (): number {
        return this.wfCatalogVersion;
    }

    public getWfRoleCode (): number {
        return this.wfRoleCode;
    }

    public getWfRoleVersion (): number {
        return this.wfRoleVersion;
    }

    public getWfStaffIdentifier (): string {
        return this.wfStaffIdentifier;
    }

    public getAppCatalogCode (): number {
        return this.appCatalogCode;
    }

    public getAppCatalogVersion (): number {
        return this.appCatalogVersion;
    }

    public getTemplate (): string {
        return this.template;
    }

    public getAttributes (): string {
        return this.attributes;
    }

    public getCreatedBy (): string {
        return this.createdBy;
    }

    public getUpdatedBy (): string {
        return this.updatedBy;
    }
}
