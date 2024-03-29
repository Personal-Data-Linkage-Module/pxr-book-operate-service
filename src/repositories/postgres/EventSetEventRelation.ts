/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * イベントセットイベントリレーションテーブル
 */
@Entity('event_set_event_relation')
export default class EventSetEventRelation {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * イベントセットID
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_set_id' })
        eventSetId: number = 0;

    /**
     * イベントID
     */
    @Column({ type: 'bigint', nullable: false, name: 'event_id' })
        eventId: number = 0;

    /**
     * 登録時ソースID
     */
    @Column({ type: 'varchar', length: 255, name: 'source_id_at_created' })
        sourceIdAtCreated: string = null;

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
            this.eventSetId = entity['event_set_id'] ? Number(entity['event_set_id']) : 0;
            this.eventId = entity['event_id'] ? Number(entity['event_id']) : 0;
            this.sourceIdAtCreated = entity['source_id_at_created'];
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

    public getEventSetId (): number {
        return this.eventSetId;
    }

    public getEventId (): number {
        return this.eventId;
    }

    public getSourceIdCreated (): string {
        return this.sourceIdAtCreated;
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
