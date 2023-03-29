/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * 待機中共有トリガー
 */
@Entity('share_trigger_waiting')
export default class ShareTriggerWaiting {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * 共有トリガーによる共有状態ID
     */
    @Column({ type: 'bigint', name: 'share_status_id' })
    shareStatusId: number;

    /**
     * 利用者ID
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'user_id' })
    userId: string = '';

    /**
     * 共有トリガーカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_trigger_code' })
    shareTriggerCode: number;

    /**
     * 共有トリガーカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_trigger_version' })
    shareTriggerVersion: number;

    /**
     * 共有定義カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_code' })
    shareCode: number;

    /**
     * 共有定義カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'share_version' })
    shareVersion: number;

    /**
     * 共有元アクターカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'source_actor_code' })
    sourceActorCode: number;

    /**
     * 共有元アクターカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'source_actor_version' })
    sourceActorVersion: number;

    /**
     * 共有元アプリケーションカタログコード
     */
    @Column({ type: 'bigint', name: 'source_app_code' })
    sourceAppCode: number;

    /**
     * 共有元アプリケーションカタログバージョン
     */
    @Column({ type: 'bigint', name: 'source_app_version' })
    sourceAppVersion: number;

    /**
     * 共有元ワークフローカタログコード
     */
    @Column({ type: 'bigint', name: 'source_wf_code' })
    sourceWfCode: number;

    /**
     * 共有元ワークフローカタログバージョン
     */
    @Column({ type: 'bigint', name: 'source_wf_version' })
    sourceWfVersion: number;

    /**
     * 共有先アクターカタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'dest_actor_code' })
    destActorCode: number;

    /**
     * 共有先アクターカタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'dest_actor_version' })
    destActorVersion: number;

    /**
     * 共有先アプリケーションカタログコード
     */
    @Column({ type: 'bigint', name: 'dest_app_code' })
    destAppCode: number;

    /**
     * 共有先アプリケーションカタログバージョン
     */
    @Column({ type: 'bigint', name: 'dest_app_version' })
    destAppVersion: number;

    /**
     * 共有先ワークフローカタログコード
     */
    @Column({ type: 'bigint', name: 'dest_wf_code' })
    destWfCode: number;

    /**
     * 共有先ワークフローカタログバージョン
     */
    @Column({ type: 'bigint', name: 'dest_wf_version' })
    destWfVersion: number;

    /**
     * 処理種別（1：開始, 2：終了）
     */
    @Column({ type: 'smallint', name: 'process_type' })
    processType: number;

    /**
     * 待機終了日時
     */
    @Column({ type: 'timestamp without time zone', name: 'end_of_waiting_at' })
    endOfWaitingAt: Date;

    /**
     * データ識別子
     */
    @Column({ type: 'varchar', length: 255 })
    identifier: string;

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
            const entityName = 'share_trigger_waiting_';
            this.id = entity[entityName + 'id'] ? Number(entity[entityName + 'id']) : 0;
            this.shareStatusId = entity[entityName + 'share_status_id'] ? Number(entity[entityName + 'share_status_id']) : null;
            this.userId = entity[entityName + 'user_id'];
            this.shareTriggerCode = Number(entity[entityName + 'share_trigger_code']);
            this.shareTriggerVersion = Number(entity[entityName + 'share_trigger_version']);
            this.shareCode = Number(entity[entityName + 'share_code']);
            this.shareVersion = Number(entity[entityName + 'share_version']);
            this.sourceActorCode = Number(entity[entityName + 'share_source_actor_code']);
            this.sourceActorVersion = Number(entity[entityName + 'share_source_actor_version']);
            this.sourceAppCode = entity[entityName + 'share_source_app_code'] ? Number(entity[entityName + 'share_source_app_code']) : null;
            this.sourceAppVersion = entity[entityName + 'share_source_app_version'] ? Number(entity[entityName + 'share_source_app_version']) : null;
            this.sourceWfCode = entity[entityName + 'share_source_wf_code'] ? Number(entity[entityName + 'share_source_wf_code']) : null;
            this.sourceWfVersion = entity[entityName + 'share_source_wf_version'] ? Number(entity[entityName + 'share_source_wf_version']) : null;
            this.destActorCode = Number(entity[entityName + 'dest_actor_code']);
            this.destActorVersion = Number(entity[entityName + 'dest_actor_version']);
            this.destAppCode = entity[entityName + 'dest_app_code'] ? Number(entity[entityName + 'dest_app_code']) : null;
            this.destAppVersion = entity[entityName + 'dest_app_version'] ? Number(entity[entityName + 'dest_app_version']) : null;
            this.destWfCode = entity[entityName + 'dest_wf_code'] ? Number(entity[entityName + 'dest_wf_code']) : null;
            this.destWfVersion = entity[entityName + 'dest_wf_version'] ? Number(entity[entityName + 'dest_wf_version']) : null;
            this.endOfWaitingAt = new Date(entity[entityName + 'end_of_waiting_at']);
            this.processType = Number(entity[entityName + 'process_type']);
            this.identifier = entity[entityName + 'identifier'];
            this.isDisabled = entity[entityName + 'is_disabled'] ? Boolean(entity[entityName + 'is_disabled']) : false;
            this.createdBy = entity[entityName + 'created_by'];
            this.createdAt = new Date(entity[entityName + 'created_at']);
            this.updatedBy = entity[entityName + 'updated_by'];
            this.updatedAt = new Date(entity[entityName + 'updated_at']);
        }
    }
}
