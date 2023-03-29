/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * CMatrix_2_nリレーションテーブルエンティティ
 */
@Entity('cmatrix_2_n_relation')
export default class Cmatrix2nRelation {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * ドキュメント連番
     */
    @Column({ type: 'bigint', nullable: false, name: 'n' })
    nDocumentNo: number = 0;

    /**
     * CMatrixイベントID
     */
    @Column({ type: 'bigint', nullable: false, name: 'cmatrix_event_id' })
    cmatrixEventId: number = 0;

    /**
     * CMatrix2(n)ID
     */
    @Column({ type: 'bigint', nullable: false, name: 'cmatrix_2n_id' })
    cmatrix2nId: number = 0;

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
            this.nDocumentNo = entity['n'] ? Number(entity['n']) : 0;
            this.cmatrixEventId = entity['cmatrix_event_id'] ? Number(entity['cmatrix_event_id']) : 0;
            this.cmatrix2nId = entity['cmatrix_2n_id'] ? Number(entity['cmatrix_2n_id']) : 0;
            this.isDisabled = entity['is_disabled'] ? Boolean(entity['is_disabled']) : false;
            this.createdBy = entity['created_by'];
            this.createdAt = entity['created_at'] ? new Date(entity['created_at']) : null;
            this.updatedBy = entity['updated_by'];
            this.updatedAt = entity['updated_at'] ? new Date(entity['updated_at']) : null;
        }
    }
}
