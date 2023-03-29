/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * ドキュメントテーブル
 */
@Entity('document')
export default class Document {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * my-condition-bookID
     */
    @Column({ type: 'bigint', nullable: false, name: 'my_condition_book_id' })
    myConditionBookId: number = 0;

    /**
     * ソースID
     */
    @Column({ type: 'varchar', length: 255, name: 'source_id' })
    sourceId: string = '';

    /**
     * ドキュメント識別子
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'doc_identifier' })
    docIdentifier: string = '';

    /**
     * ドキュメント種別カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'doc_catalog_code' })
    docCatalogCode: number = 0;

    /**
     * ドキュメント種別カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'doc_catalog_version' })
    docCatalogVersion: number = 0;

    /**
     * ドキュメント生成時間
     */
    @CreateDateColumn({ type: 'timestamp without time zone', name: 'doc_create_at' })
    docCreateAt: Date = new Date();

    /**
     * ドキュメントを発生させたアクター識別子カタログコード
     */
    @Column({ type: 'bigint', nullable: false, name: 'doc_actor_code' })
    docActorCode: number = 0;

    /**
     * ドキュメントを発生させたアクター識別子カタログバージョン
     */
    @Column({ type: 'bigint', nullable: false, name: 'doc_actor_version' })
    docActorVersion: number = 0;

    /**
     * ワークフロー識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'wf_catalog_code' })
    wfCatalogCode: number = 0;

    /**
     * ワークフロー識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'wf_catalog_version' })
    wfCatalogVersion: number = 0;

    /**
     * ワークフローロール識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'wf_role_code' })
    wfRoleCode: number = 0;

    /**
     * ワークフローロール識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'wf_role_version' })
    wfRoleVersion: number = 0;

    /**
     * ワークフロー職員識別子
     */
    @Column({ type: 'varchar', length: 255, name: 'wf_staff_identifier' })
    wfStaffIdentifier: string = '';

    /**
     * アプリケーション識別子カタログコード
     */
    @Column({ type: 'bigint', name: 'app_catalog_code' })
    appCatalogCode: number = 0;

    /**
     * アプリケーション識別子カタログバージョン
     */
    @Column({ type: 'bigint', name: 'app_catalog_version' })
    appCatalogVersion: number = 0;

    /**
     * テンプレート
     */
    @Column({ type: 'text' })
    template: string = '';

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
            this.myConditionBookId = entity['my_condition_book_id'] ? Number(entity['my_condition_book_id']) : 0;
            this.sourceId = entity['source_id'];
            this.docIdentifier = entity['doc_identifier'];
            this.docCatalogCode = entity['doc_catalog_code'] ? Number(entity['doc_catalog_code']) : 0;
            this.docCatalogVersion = entity['doc_catalog_version'] ? Number(entity['doc_catalog_version']) : 0;
            this.docCreateAt = entity['doc_create_at'] ? new Date(entity['doc_create_at']) : null;
            this.docActorCode = entity['doc_actor_code'] ? Number(entity['doc_actor_code']) : 0;
            this.docActorVersion = entity['doc_actor_version'] ? Number(entity['doc_actor_version']) : 0;
            this.wfCatalogCode = entity['wf_catalog_code'] ? Number(entity['wf_catalog_code']) : 0;
            this.wfCatalogVersion = entity['wf_catalog_version'] ? Number(entity['wf_catalog_version']) : 0;
            this.wfRoleCode = entity['wf_role_code'] ? Number(entity['wf_role_code']) : 0;
            this.wfRoleVersion = entity['wf_role_version'] ? Number(entity['wf_role_version']) : 0;
            this.wfStaffIdentifier = entity['wf_staff_identifier'];
            this.appCatalogCode = entity['app_catalog_code'] ? Number(entity['app_catalog_code']) : 0;
            this.appCatalogVersion = entity['app_catalog_version'] ? Number(entity['app_catalog_version']) : 0;
            this.template = entity['template'];
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

    public getMyConditionBookId (): number {
        return this.myConditionBookId;
    }

    public getSourceId (): string {
        return this.sourceId;
    }

    public getdocIdentifier (): string {
        return this.docIdentifier;
    }

    public getdocCatalogCode (): number {
        return this.docCatalogCode;
    }

    public getdocCatalogVersion (): number {
        return this.docCatalogVersion;
    }

    public getdocCreateAt (): Date {
        return this.docCreateAt;
    }

    public getdocActorCode (): number {
        return this.docActorCode;
    }

    public getdocActorVersion (): number {
        return this.docActorVersion;
    }

    public getWfCatalogCode (): number {
        return this.wfCatalogCode;
    }

    public getWfCatalogVersion (): number {
        return this.wfCatalogVersion;
    }

    public getWfRoleCode (): number {
        return this.wfRoleCode;
    }

    public getWfRoleVersion (): number {
        return this.wfRoleVersion;
    }

    public getWfStaffIdentifier (): string {
        return this.wfStaffIdentifier;
    }

    public getAppCatalogCode (): number {
        return this.appCatalogCode;
    }

    public getAppCatalogVersion (): number {
        return this.appCatalogVersion;
    }

    public getTemplate (): string {
        return this.template;
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
