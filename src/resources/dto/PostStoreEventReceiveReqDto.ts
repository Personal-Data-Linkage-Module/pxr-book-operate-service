/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 *
 *
 *
 * $Date$
 * $Revision$
 * $Author$
 *
 * TEMPLATE VERSION :  76463
 */

// SDE-IMPL-REQUIRED 本ファイルをコピーしコントローラーに定義した各 REST API のリクエスト・レスポンスごとにDTOを作成します。

/* eslint-disable */
import { IsString, IsDefined, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { transformToDateTime, transformToNumber } from '../../common/Transform';

/**
 * POST: データ共有のリクエストDTO
 */
export class CodeObject {
    @Transform(transformToNumber)
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    _value: number;

    @Transform(transformToNumber)
    @IsNumber()
    @IsDefined()
    _ver: number;
}

export default class PostStoreEventReceiveReqDto {
    /**
     * 送信種別
     */
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    type: string;

    /**
     * 処理種別
     */
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    operate: string;

    /**
     * 利用者ID
     */
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    userId: string;

    /**
     * データID
     */
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    identifier: string;

    /**
     * ドキュメント種別カタログコード
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    document: CodeObject;

    /**
     * イベント種別カタログコード
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    event: CodeObject;

    /**
     * モノ種別カタログコード
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    thing: CodeObject;

    /**
     * 共有元アクター
     */
    @IsDefined()
    @Type(() => CodeObject)
    @ValidateNested()
    sourceActor: CodeObject;

    /**
     * 共有元アプリケーション
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    sourceApp: CodeObject;

    /**
     * 共有元ワークフロー
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    sourceWf: CodeObject;

    /**
     * 共有先アクター
     */
    @IsDefined()
    @Type(() => CodeObject)
    @ValidateNested()
    destinationActor: CodeObject;

    /**
     * 共有先アプリケーション
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    destinationApp: CodeObject;

    /**
     * 共有先ワークフロー
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    destinationWf: CodeObject;

    /**
     * 共有トリガー定義カタログコード
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    trigger: CodeObject;
}
