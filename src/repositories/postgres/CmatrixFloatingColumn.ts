/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * CMatrix変動列テーブルエンティティ
 */
@Entity('cmatrix_floating_column')
export default class CmatrixFloatingColumn {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * CMatrixモノID
     */
    @Column({ type: 'bigint', nullable: false, name: 'cmatrix_thing_id' })
    cmatrixThingId: number = 0;

    /**
     * インデックス
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'index_key' })
    indexKey: string = '';

    /**
     * 値
     */
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'value' })
    value: string = '';

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
            this.cmatrixThingId = entity['cmatrix_thing_id'] ? Number(entity['cmatrix_thing_id']) : 0;
            this.indexKey = entity['index_key'];
            this.value = entity['value'];
            this.isDisabled = entity['is_disabled'] ? Boolean(entity['is_disabled']) : false;
            this.createdBy = entity['created_by'];
            this.createdAt = entity['created_at'] ? new Date(entity['created_at']) : null;
            this.updatedBy = entity['updated_by'];
            this.updatedAt = entity['updated_at'] ? new Date(entity['updated_at']) : null;
        }
    }

    public getCmatrixThingId (): number {
        return this.cmatrixThingId;
    }

    public getIndexKey (): string {
        return this.indexKey;
    }

    public getValue (): string {
        return this.value;
    }

    public getCreatedBy (): string {
        return this.createdBy;
    }

    public getUpdatedBy (): string {
        return this.updatedBy;
    }
}
