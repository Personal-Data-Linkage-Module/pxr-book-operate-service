/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import ShareAccessLogDataType from './ShareAccessLogDataType';

/**
 * 共有アクセスログテーブル
 */
@Entity('shared_access_log')
export default class ShareAccessLog {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * My-Condition-Book_ID
     */
    @Column({ type: 'bigint', nullable: false, name: 'my_condition_book_id' })
    myConditionBookId: number = 0;

    /**
     * 共有ログ識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'log_identifier' })
    logIdentifier: string = '';

    /**
     * ユーザ名
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'user_name' })
    userName: string = '';

    /**
     * データ共有タイプ
     */
    @Column({ type: 'smallint', nullable: false, default: false, name: 'data_type' })
    dataType: number = 0;

    /**
     * 状態共有機能カタログコード
     */
    @Column({ type: 'bigint', default: false, name: 'share_catalog_code' })
    shareCatalogCode: number = 0;

    /**
     * 要求アクターカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'req_actor_catalog_code' })
    reqActorCatalogCode: number = 0;

    /**
     * 要求アクターカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'req_actor_catalog_version' })
    reqActorCatalogVersion: number = 0;

    /**
     * 要求ブロックカタログコード
     */
    @Column({ type: 'bigint', name: 'req_block_catalog_code' })
    reqBlockCatalogCode: number = 0;

    /**
     * 要求ブロックカタログバージョン
     */
    @Column({ type: 'bigint', name: 'req_block_catalog_version' })
    reqBlockCatalogVersion: number = 0;

    /**
     * アクセス日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'access_at' })
    accessAt: Date = new Date();

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
    @OneToMany(type => ShareAccessLogDataType, shareAccessLogDataType => shareAccessLogDataType.shareAccessLog)
    @JoinColumn({ name: 'id', referencedColumnName: 'shareAccessLogId' })
    dataTypes: ShareAccessLogDataType[];

    /**
     * コンストラクタ
     * @param entity
     */
    constructor (entity?: {}) {
        if (entity) {
            const entityName = 'shared_access_log_';
            this.id = Number(entity[entityName + 'id']);
            this.myConditionBookId = Number(entity[entityName + 'my_condition_book_id']);
            this.logIdentifier = entity[entityName + 'log_identifier'];
            this.userName = entity[entityName + 'user_name'];
            this.dataType = Number(entity[entityName + 'data_type']);
            this.shareCatalogCode = Number(entity[entityName + 'share_catalog_code']);
            this.reqActorCatalogCode = Number(entity[entityName + 'req_actor_catalog_code']);
            this.reqActorCatalogVersion = entity[entityName + 'req_actor_catalog_version'] ? Number(entity[entityName + 'req_actor_catalog_version']) : 0;
            this.reqBlockCatalogCode = Number(entity[entityName + 'req_block_catalog_code']);
            this.reqBlockCatalogVersion = entity[entityName + 'req_block_catalog_version'] ? Number(entity[entityName + 'req_block_catalog_version']) : 0;
            this.accessAt = new Date(entity[entityName + 'access_at']);
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = new Date(entity[entityName + 'created_at']);
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = new Date(entity[entityName + 'updated_at']);
        }
    }
}
