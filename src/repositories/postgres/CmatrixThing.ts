/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * CMatrixモノテーブルエンティティ
 */
@Entity('cmatrix_thing')
export default class CmatrixThing {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * CMatrixイベントID
     */
    @Column({ type: 'bigint', nullable: false, name: 'cmatrix_event_id' })
    cmatrixEventId: number = 0;

    /**
     * モノ識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '4_1_1' })
    thingIdentifier: string = '';

    /**
     * モノ識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '4_1_2_1' })
    thingCatalogCode: number = 0;

    /**
     * モノ識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '4_1_2_2' })
    thingCatalogVersion: number = 0;

    /**
     * モノを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '4_4_1_1' })
    thingActorCode: number = 0;

    /**
     * モノを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '4_4_1_2' })
    thingActorVersion: number = 0;

    /**
     * ワークフロー識別子カタログコード
     */
    @Column({ type: 'bigint', name: '4_4_2_1' })
    thingWfCatalogCode: number = 0;

    /**
     * ワークフロー識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '4_4_2_2' })
    thingWfCatalogVersion: number = 0;

    /**
     * ワークフローロール識別子カタログコード
     */
    @Column({ type: 'bigint', name: '4_4_3_1' })
    thingWfRoleCode: number = 0;

    /**
     * ワークフローロール識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '4_4_3_2' })
    thingWfRoleVersion: number = 0;

    /**
     * ワークフロー職員識別子
     */
    @Column({ type: 'varchar', length: 255, name: '4_4_4' })
    thingWfStaffIdentifier: string = '';

    /**
     * アプリケーション識別子カタログコード
     */
    @Column({ type: 'bigint', name: '4_4_5_1' })
    thingAppCatalogCode: number = 0;

    /**
     * アプリケーション識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '4_4_5_2' })
    thingAppCatalogVersion: number = 0;

    /**
     * 行ハッシュ
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'row_hash' })
    rowHash: string = '';

    /**
     * 行ハッシュ生成時間
     */
    @Column({ type: 'timestamp without time zone', nullable: false, name: 'row_hash_create_at' })
    rowHashCreateAt: Date = new Date();

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
            this.cmatrixEventId = entity['cmatrix_event_id'] ? Number(entity['cmatrix_event_id']) : 0;
            this.thingIdentifier = entity['4_1_1'];
            this.thingCatalogCode = Number(entity['4_1_2_1']);
            this.thingCatalogVersion = Number(entity['4_1_2_2']);
            this.thingActorCode = Number(entity['4_4_1_1']);
            this.thingActorVersion = Number(entity['4_4_1_2']);
            this.thingWfCatalogCode = entity['4_4_2_1'] ? Number(entity['4_4_2_1']) : 0;
            this.thingWfCatalogVersion = entity['4_4_2_2'] ? Number(entity['4_4_2_2']) : 0;
            this.thingWfRoleCode = entity['4_4_3_1'] ? Number(entity['4_4_3_1']) : 0;
            this.thingWfRoleVersion = entity['4_4_3_2'] ? Number(entity['4_4_3_2']) : 0;
            this.thingWfStaffIdentifier = entity['4_4_4'];
            this.thingAppCatalogCode = entity['4_4_5_1'] ? Number(entity['4_4_5_1']) : 0;
            this.thingAppCatalogVersion = entity['4_4_5_2'] ? Number(entity['4_4_5_2']) : 0;
            this.rowHash = entity['row_hash'];
            this.rowHashCreateAt = new Date(entity['row_hash_create_at']);
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

    public getCmatrixEventId (): number {
        return this.cmatrixEventId;
    }

    public getThingIdentifier (): string {
        return this.thingIdentifier;
    }

    public setThingIdentifier (thingIdentifier: string) {
        this.thingIdentifier = thingIdentifier;
    }

    public getThingCatalogCode (): number {
        return this.thingCatalogCode;
    }

    public setThingCatalogCode (thingCatalogCode: number) {
        this.thingCatalogCode = thingCatalogCode;
    }

    public getThingCatalogVersion (): number {
        return this.thingCatalogVersion;
    }

    public setThingCatalogVersion (thingCatalogVersion: number) {
        this.thingCatalogVersion = thingCatalogVersion;
    }

    public getThingActorCode (): number {
        return this.thingActorCode;
    }

    public setThingActorCode (thingActorCode: number) {
        this.thingActorCode = thingActorCode;
    }

    public getThingActorVersion (): number {
        return this.thingActorVersion;
    }

    public setThingActorVersion (thingActorVersion: number) {
        this.thingActorVersion = thingActorVersion;
    }

    public getThingWfCatalogCode (): number {
        return this.thingWfCatalogCode;
    }

    public setThingWfCatalogCode (thingWfCatalogCode: number) {
        this.thingWfCatalogCode = thingWfCatalogCode;
    }

    public getThingWfCatalogVersion (): number {
        return this.thingWfCatalogVersion;
    }

    public setThingWfCatalogVersion (thingWfCatalogVersion: number) {
        this.thingWfCatalogVersion = thingWfCatalogVersion;
    }

    public getThingWfRoleCode (): number {
        return this.thingWfRoleCode;
    }

    public setThingWfRoleCode (thingWfRoleCode: number) {
        this.thingWfRoleCode = thingWfRoleCode;
    }

    public getThingWfRoleVersion (): number {
        return this.thingWfRoleVersion;
    }

    public setThingWfRoleVersion (thingWfRoleVersion: number) {
        this.thingWfRoleVersion = thingWfRoleVersion;
    }

    public getThingWfStaffIdentifier (): string {
        return this.thingWfStaffIdentifier;
    }

    public setThingWfStaffIdentifier (thingWfStaffIdentifier: string) {
        this.thingWfStaffIdentifier = thingWfStaffIdentifier;
    }

    public getThingAppCatalogCode (): number {
        return this.thingAppCatalogCode;
    }

    public setThingAppCatalogCode (thingAppCatalogCode: number) {
        this.thingAppCatalogCode = thingAppCatalogCode;
    }

    public getThingAppCatalogVersion (): number {
        return this.thingAppCatalogVersion;
    }

    public setThingAppCatalogVersion (thingAppCatalogVersion: number) {
        this.thingAppCatalogVersion = thingAppCatalogVersion;
    }

    public getRowHash (): string {
        return this.rowHash;
    }

    public setRowHash (rowHash: string): void {
        this.rowHash = rowHash;
    }

    public getRowHashCreateAt (): Date {
        return this.rowHashCreateAt;
    }

    public setRowHashCreateAt (rowHashCreateAt: Date): void {
        this.rowHashCreateAt = rowHashCreateAt;
    }

    public getCreatedBy (): string {
        return this.createdBy;
    }

    public getUpdatedBy (): string {
        return this.updatedBy;
    }
}
