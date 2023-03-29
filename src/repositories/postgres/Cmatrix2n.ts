/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * CMatrix_2_nテーブルエンティティ
 */
@Entity('cmatrix_2_n')
export default class Cmatrix2n {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * ドキュメント識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: '_1_1' })
    docIdentifier: string = '';

    /**
     * ドキュメント種別カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '_1_2_1' })
    docCatalogCode: number = 0;

    /**
     * ドキュメント種別カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '_1_2_2' })
    docCatalogVersion: number = 0;

    /**
     * ドキュメント作成時間
     */
    @Column({ type: 'timestamp without time zone', nullable: false, name: '_2_1' })
    docCreateAt: Date = new Date();

    /**
     * ドキュメントを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: '_3_1_1' })
    docActorCode: number = 0;

    /**
     * ドキュメントを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: '_3_1_2' })
    docActorVersion: number = 0;

    /**
     * ワークフロー識別子カタログコード
     */
    @Column({ type: 'bigint', name: '_3_2_1' })
    docWfCatalogCode: number = 0;

    /**
     * ワークフロー識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '_3_2_2' })
    docWfCatalogVersion: number = 0;

    /**
     * ワークフローロール識別子カタログコード
     */
    @Column({ type: 'bigint', name: '_3_3_1' })
    docWfRoleCode: number = 0;

    /**
     * ワークフローロール識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '_3_3_2' })
    docWfRoleVersion: number = 0;

    /**
     * ワークフロー職員識別子
     */
    @Column({ type: 'varchar', length: 255, name: '_3_4' })
    docWfStaffIdentifier: string = '';

    /**
     * アプリケーション識別子カタログコード
     */
    @Column({ type: 'bigint', name: '_3_5_1' })
    docAppCatalogCode: number = 0;

    /**
     * アプリケーション識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: '_3_5_2' })
    docAppCatalogVersion: number = 0;

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
            this.docIdentifier = entity['_1_1'];
            this.docCatalogCode = Number(entity['_1_2_1']);
            this.docCatalogVersion = Number(entity['_1_2_2']);
            this.docCreateAt = entity['_2_1'] ? new Date(entity['_2_1']) : null;
            this.docActorCode = Number(entity['_3_1_1']);
            this.docActorVersion = Number(entity['_3_1_2']);
            this.docWfCatalogCode = entity['_3_2_1'] ? Number(entity['_3_2_1']) : 0;
            this.docWfCatalogVersion = entity['_3_2_2'] ? Number(entity['_3_2_2']) : 0;
            this.docWfRoleCode = entity['_3_3_1'] ? Number(entity['_3_3_1']) : 0;
            this.docWfRoleVersion = entity['_3_3_2'] ? Number(entity['_3_3_2']) : 0;
            this.docWfStaffIdentifier = entity['_3_4'];
            this.docAppCatalogCode = entity['_3_5_1'] ? Number(entity['_3_5_1']) : 0;
            this.docAppCatalogVersion = entity['_3_5_2'] ? Number(entity['_3_5_2']) : 0;
            this.isDisabled = entity['is_disabled'] ? Boolean(entity['is_disabled']) : false;
            this.createdBy = entity['created_by'];
            this.createdAt = entity['created_at'] ? new Date(entity['created_at']) : null;
            this.updatedBy = entity['updated_by'];
            this.updatedAt = entity['updated_at'] ? new Date(entity['updated_at']) : null;
        }
    }
}
