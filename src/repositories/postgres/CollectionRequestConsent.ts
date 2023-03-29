/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * データ提供契約収集依頼同意テーブルエンティティ
 */
@Entity('collection_request_consent')
export default class CollectionRequestConsent {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /**
     * データ提供契約収集依頼ID
     */
    @Column({ type: 'bigint', nullable: false, name: 'collection_request_id' })
    collectionRequestId: number;

    /**
     * ステータス
     */
    @Column({ type: 'smallint', nullable: false, default: 0, name: 'status' })
    status: number = 0;

    /**
     * 利用者ID
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'user_id' })
    userId: string;

    /**
     * マスクID
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'mask_id' })
    maskId: string;

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
            const entityName = 'collection_request_consent_';
            this.id = entity[entityName + 'id'] ? Number(entity[entityName + 'id']) : 0;
            this.collectionRequestId = Number(entity[entityName + 'collection_request_id']);
            this.status = Number(entity[entityName + 'status']);
            this.userId = entity[entityName + 'user_id'];
            this.maskId = entity[entityName + 'mask_id'];
            this.isDisabled = entity[entityName + 'is_disabled'] ? Boolean(entity[entityName + 'is_disabled']) : false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = entity[entityName + 'created_at'] ? new Date(entity[entityName + 'created_at']) : null;
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = entity[entityName + 'updated_at'] ? new Date(entity[entityName + 'updated_at']) : null;
        }
    }
}
