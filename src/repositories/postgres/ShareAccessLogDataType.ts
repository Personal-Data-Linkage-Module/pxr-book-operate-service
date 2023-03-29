/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import ShareAccessLog from './ShareAccessLog';

/**
 * 共有アクセスログデータ種テーブル
 */
@Entity('shared_access_log_data_type')
export default class ShareAccessLogDataType {
    /** データ種：ドキュメント */
    static readonly DATA_TYPE_DOCUMENT = 1;

    /** データ種：イベント */
    static readonly DATA_TYPE_EVENT = 2;

    /** データ種：モノ */
    static readonly DATA_TYPE_THING = 3;

    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * 共有アクセスログID
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_access_log_id' })
    shareAccessLogId: number = 0;

    /**
     * データ種
     */
    @Column({ type: 'smallint', nullable: false, default: false, name: 'data_type' })
    dataType: number = 0;

    /**
     * データ種カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'data_type_catalog_code' })
    dataTypeCatalogCode: number = 0;

    /**
     * データ種カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'data_type_catalog_version' })
    dataTypeCatalogVersion: number = 0;

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

    /** 行列ハッシュテーブルのレコード */
    @ManyToOne(type => ShareAccessLog, shareAccessLog => shareAccessLog.dataTypes)
    @JoinColumn({ name: 'share_access_log_id', referencedColumnName: 'id' })
    shareAccessLog: ShareAccessLog;

    /**
     * コンストラクタ
     * @param entity
     */
    constructor (entity?: {}) {
        if (entity) {
            const entityName = 'shared_access_log_data_type_';
            this.id = Number(entity[entityName + 'id']);
            this.shareAccessLogId = entity[entityName + 'share_access_log_id'];
            this.dataType = Number(entity[entityName + 'data_type']);
            this.dataTypeCatalogCode = Number(entity[entityName + 'data_type_catalog_code']);
            this.dataTypeCatalogVersion = entity[entityName + 'data_type_catalog_version'] ? Number(entity[entityName + 'data_type_catalog_version']) : 0;
            this.attributes = entity[entityName + 'attributes'];
            this.isDisabled = entity[entityName + 'is_disabled'] ? Boolean(entity[entityName + 'is_disabled']) : false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = new Date(entity[entityName + 'created_at']);
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = new Date(entity[entityName + 'updated_at']);
        }
    }
}
