/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * モノテーブルエンティティ
 */
@Entity('thing')
export default class Thing {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * イベントID
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_id' })
    eventId: number = 0;

    /**
     * ソースID
     */
    @Column({ type: 'varchar', length: 255, name: 'source_id' })
    sourceId: string = '';

    /**
     * モノ識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'thing_identifier' })
    thingIdentifier: string = '';

    /**
     * モノ種別カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_catalog_code' })
    thingCatalogCode: number = 0;

    /**
     * モノ種別カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_catalog_version' })
    thingCatalogVersion: number = 0;

    /**
     * モノを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_actor_code' })
    thingActorCode: number = 0;

    /**
     * モノを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_actor_version' })
    thingActorVersion: number = 0;

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
            this.eventId = entity['event_id'] ? Number(entity['event_id']) : 0;
            this.sourceId = entity['source_id'];
            this.thingIdentifier = entity['thing_identifier'];
            this.thingCatalogCode = entity['thing_catalog_code'] ? Number(entity['thing_catalog_code']) : 0;
            this.thingCatalogVersion = entity['thing_catalog_version'] ? Number(entity['thing_catalog_version']) : 0;
            this.thingActorCode = entity['thing_actor_code'] ? Number(entity['thing_actor_code']) : 0;
            this.thingActorVersion = entity['thing_actor_version'] ? Number(entity['thing_actor_version']) : 0;
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

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const obj: {} = {
            _code: {
                _value: this.thingCatalogCode,
                _ver: this.thingCatalogVersion
            },
            acquired_time: {
                index: '4_2_2_4',
                value: null
            },
            code: {
                index: '4_1_2',
                value: {
                    _value: this.thingCatalogCode,
                    _ver: this.thingCatalogVersion
                }
            },
            env: {
                id: '',
                code: {
                    _value: 1000058,
                    _ver: 1
                }
            },
            id: {
                index: '4_1_1',
                value: null
            },
            sourceId: this.getSourceId(),
            'x-axis': {
                index: '4_2_2_1',
                value: null
            },
            'y-axis': {
                index: '4_2_2_2',
                value: null
            },
            'z-axis': {
                index: '4_2_2_3',
                value: null
            }
        };
        return obj;
    }

    public getId (): number {
        return this.id;
    }

    public getEventId (): number {
        return this.eventId;
    }

    public getSourceId (): string {
        return this.sourceId;
    }

    public getThingIdentifier (): string {
        return this.thingIdentifier;
    }

    public getThingCatalogCode (): number {
        return this.thingCatalogCode;
    }

    public getThingCatalogVersion (): number {
        return this.thingCatalogVersion;
    }

    public getThingActorCode (): number {
        return this.thingActorCode;
    }

    public getThingActorVersion (): number {
        return this.thingActorVersion;
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
