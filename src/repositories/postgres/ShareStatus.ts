/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 共有トリガーによる共有状態テーブルエンティティ
 */
@Entity('share_status')
export default class ShareStatus {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * 利用者ID
     */
    @Column({ type: 'varchar', length: 255, name: 'user_id' })
    userId: string = '';

    /**
     * 共有トリガーカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_trigger_code' })
    shareTriggerCode: number = 0;

    /**
     * 共有トリガーカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_trigger_version' })
    shareTriggerVersion: number = 0;

    /**
     * 共有定義カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_code' })
    shareCode: number = 0;

    /**
     * 共有定義カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_version' })
    shareVersion: number = 0;

    /**
     * 共有終了方法
     */
    @Column({ type: 'bigint', nullable: false, name: 'end_method' })
    endMethod: number = 0;

    /**
     * 共有開始日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', nullable: true, name: 'start_datetime' })
    startDatetime: Date = null;

    /**
     * 共有終了日時
     */
    @CreateDateColumn({ type: 'timestamp without time zone', nullable: true, name: 'end_datetime' })
    endDatetime: Date = null;

    /**
     * 共有状態
     */
    @Column({ type: 'smallint', nullable: false, name: 'status' })
    status: number = 0;

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
            const entityName = 'share_status_';
            this.id = entity[entityName + 'id'] ? Number(entity[entityName + 'id']) : 0;
            this.userId = entity[entityName + 'user_id'];
            this.shareTriggerCode = entity[entityName + 'share_trigger_code'] ? Number(entity[entityName + 'share_trigger_code']) : 0;
            this.shareTriggerVersion = entity[entityName + 'share_trigger_version'] ? Number(entity[entityName + 'share_trigger_version']) : 0;
            this.shareCode = entity[entityName + 'share_code'] ? Number(entity[entityName + 'share_code']) : 0;
            this.shareVersion = entity[entityName + 'share_version'] ? Number(entity[entityName + 'share_version']) : 0;
            this.endMethod = entity[entityName + 'end_method'] ? Number(entity[entityName + 'end_method']) : 0;
            this.startDatetime = entity[entityName + 'start_datetime'] ? new Date(entity[entityName + 'start_datetime']) : null;
            this.endDatetime = entity[entityName + 'end_datetime'] ? new Date(entity[entityName + 'end_datetime']) : null;
            this.status = entity[entityName + 'status'] ? Number(entity[entityName + 'status']) : 0;
            this.isDisabled = false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = entity[entityName + 'created_at'] ? new Date(entity[entityName + 'created_at']) : null;
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = entity[entityName + 'updated_at'] ? new Date(entity[entityName + 'updated_at']) : null;
        }
    }
}
