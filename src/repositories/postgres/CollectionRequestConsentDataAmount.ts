/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * データ提供契約収集依頼送付データ件数テーブルエンティティ
 */
@Entity('collection_request_consent_data_amount')
export default class CollectionRequestConsentDataAmount {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number;

    /**
     * データ提供契約収集依頼同意ID
     */
    @Column({ type: 'bigint', nullable: false, name: 'collection_request_consent_id' })
    collectionRequestConsentId: number;

    /**
     * イベントコード
     */
    @Column({ type: 'bigint', name: 'event_code' })
    eventCode: number;

    /**
     * イベントバージョン
     */
    @Column({ type: 'bigint', name: 'event_version' })
    eventVersion: number;

    /**
     * モノコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_code' })
    thingCode: number;

    /**
     * モノバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_version' })
    thingVersion: number;

    /**
     * 件数
     */
    @Column({ type: 'bigint', nullable: false, name: 'amount' })
    amount: number;

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
            const entityName = 'collection_request_consent_data_amount_';
            this.id = entity['id'] ? Number(entity[entityName + 'id']) : 0;
            this.collectionRequestConsentId = Number(entity[entityName + 'collection_request_consent_id']);
            this.eventCode = Number(entity[entityName + 'event_code']);
            this.eventVersion = Number(entity[entityName + 'event_version']);
            this.thingCode = Number(entity[entityName + 'thing_code']);
            this.thingVersion = Number(entity[entityName + 'thing_version']);
            this.amount = Number(entity[entityName + 'amount']);
            this.isDisabled = entity[entityName + 'is_disabled'] ? Boolean(entity[entityName + 'is_disabled']) : false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = entity[entityName + 'created_at'] ? new Date(entity[entityName + 'created_at']) : null;
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = entity[entityName + 'updated_at'] ? new Date(entity[entityName + 'updated_at']) : null;
        }
    }
}
