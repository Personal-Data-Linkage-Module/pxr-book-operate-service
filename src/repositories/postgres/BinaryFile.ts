/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * バイナリファイルテーブルエンティティ
 */
@Entity('binary_file')
export default class BinaryFile {
    /**
     * ID
     */
    @PrimaryGeneratedColumn({ type: 'bigint' })
    readonly id: number = 0;

    /**
     * モノID
     */
    @Column({ type: 'bigint', nullable: false, name: 'thing_id' })
    thingId: number = 0;

    /**
     * ファイルパス
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'file_path' })
    filePath: string = '';

    /**
     * MIMEタイプ
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'mime_type' })
    mimeType: string = '';

    /**
     * ファイルサイズ
     */
    @Column({ type: 'bigint', nullable: false, name: 'file_size' })
    fileSize: number = 0;

    /**
     * ファイルハッシュ
     */
    @Column({ type: 'varchar', length: 255, nullable: false, name: 'file_hash' })
    fileHash: string = '';

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
            this.thingId = entity['thing_id'] ? Number(entity['thing_id']) : 0;
            this.filePath = entity['file_path'];
            this.mimeType = entity['mime_type'];
            this.fileSize = entity['file_size'] ? Number(entity['file_size']) : 0;
            this.fileHash = entity['file_hash'];
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

    public getThingId (): number {
        return this.thingId;
    }

    public getFilePath (): string {
        return this.filePath;
    }

    public getMimeType (): string {
        return this.mimeType;
    }

    public getFileSize (): number {
        return this.fileSize;
    }

    public getFileHash (): string {
        return this.fileHash;
    }

    public getCreatedBy (): string {
        return this.createdBy;
    }

    public getUpdatedBy (): string {
        return this.updatedBy;
    }
}
