/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * My-Condition-Bookテーブル
 */
@Entity('my_condition_book')
export default class MyConditionBook {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * 利用者ID
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'user_id' })
    userId: string = '';

    /**
     * アクターカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'actor_catalog_code' })
    actorCatalogCode: number = 0;

    /**
     * アクターカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'actor_catalog_version' })
    actorCatalogVersion: number = 0;

    /**
     * リージョンカタログコード
     */
    @Column({ type: 'bigint', name: 'region_catalog_code' })
    regionCatalogCode: number = 0;

    /**
     * リージョンカタログバージョン
     */
    @Column({ type: 'bigint', name: 'region_catalog_version' })
    regionCatalogVersion: number = 0;

    /**
     * アプリケーションカタログコード
     */
    @Column({ type: 'bigint', name: 'app_catalog_code' })
    appCatalogCode: number = 0;

    /**
     * アプリケーションカタログバージョン
     */
    @Column({ type: 'bigint', name: 'app_catalog_version' })
    appCatalogVersion: number = 0;

    /**
     * ワークフローカタログコード
     */
    @Column({ type: 'bigint', name: 'wf_catalog_code' })
    wfCatalogCode: number = 0;

    /**
     * ワークフローカタログバージョン
     */
    @Column({ type: 'bigint', name: 'wf_catalog_version' })
    wfCatalogVersion: number = 0;

    /**
     * 開設日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'open_start_at' })
    openStartAt: Date = new Date();

    /**
     * 本人性確認コード
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'identify_code' })
    identifyCode: string = '';

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
            const entityName = 'my_condition_book_';
            this.id = Number(entity[entityName + 'id']);
            this.userId = entity[entityName + 'user_id'];
            this.actorCatalogCode = Number(entity[entityName + 'actor_catalog_code']);
            this.actorCatalogVersion = Number(entity[entityName + 'actor_catalog_version']);
            this.regionCatalogCode = entity[entityName + 'region_catalog_code'] ? Number(entity[entityName + 'region_catalog_code']) : 0;
            this.regionCatalogVersion = entity[entityName + 'region_catalog_version'] ? Number(entity[entityName + 'region_catalog_version']) : 0;
            this.appCatalogCode = entity[entityName + 'app_catalog_code'] ? Number(entity[entityName + 'app_catalog_code']) : 0;
            this.appCatalogVersion = entity[entityName + 'app_catalog_version'] ? Number(entity[entityName + 'app_catalog_version']) : 0;
            this.wfCatalogCode = entity[entityName + 'wf_catalog_code'] ? Number(entity[entityName + 'wf_catalog_code']) : 0;
            this.wfCatalogVersion = entity[entityName + 'wf_catalog_version'] ? Number(entity[entityName + 'wf_catalog_version']) : 0;
            this.openStartAt = new Date(entity[entityName + 'open_start_at']);
            this.identifyCode = entity[entityName + 'identify_code'];
            this.attributes = entity[entityName + 'attributes'];
            this.isDisabled = false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = new Date(entity[entityName + 'created_at']);
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = new Date(entity[entityName + 'updated_at']);
        }
    }
}
