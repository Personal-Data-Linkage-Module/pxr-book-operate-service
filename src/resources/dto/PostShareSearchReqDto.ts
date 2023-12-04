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
import { IsString, IsDefined, IsNotEmpty, ValidateNested, IsOptional, IsDate, IsNumber, Contains, Validate, Matches, IsArray, IsUUID } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { transformToDateTime, transformToNumber } from '../../common/Transform';

/**
 * POST: データ共有のリクエストDTO
 */
export class CodeVersionObject {
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    _value: number;

    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsDefined()
    _ver: number;
}

export class CodeObject {
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    _value: number;
}

export class DateStartEndObject {
    @Transform(({ value }) => { return transformToDateTime(value); })
    @IsDate()
    @IsNotEmpty()
    @IsDefined()
    start: Date;

    @Transform(({ value }) => { return transformToDateTime(value); })
    @IsDate()
    @IsDefined()
    end: Date;
}

export class Destination {
    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsDefined()
    actor: number;

    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsOptional()
    app: number;

    @Transform(({ value }) => { return transformToNumber(value); })
    @IsNumber()
    @IsOptional()
    wf: number;
}

export default class PostShareSearchReqDto {
    /**
     * ユーザID
     */
    @IsString()
    @IsOptional()
    userId: string;

    /**
     * 共有コード
     */
    @IsString()
    @IsOptional()
    tempShareCode: string;

    /**
     * 識別子
     */
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    identifier: string[];

    /**
     * 識別子
     */
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    logIdentifier: string;

    /**
     * 検索更新日時
     */
    @IsOptional()
    @Type(() => DateStartEndObject)
    @ValidateNested()
    updatedAt: DateStartEndObject;

    /**
     * アプリケーションオブジェクト
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    app?: CodeObject;
    
    /**
     * ワークフローオブジェクト
     */
    @IsOptional()
    @Type(() => CodeObject)
    @ValidateNested()
    wf?: CodeObject;
    
    /**
     * コードオブジェクト
     */
    @IsOptional()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    document?: CodeVersionObject[];

    /**
     * コードオブジェクト
     */
    @IsOptional()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    event?: CodeVersionObject[];
    
    /**
     * コードオブジェクト
     */
    @IsOptional()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    thing?: CodeVersionObject[];

    /**
     * トリガー共有先情報
     */
    @IsOptional()
    @Type(() => Destination)
    @ValidateNested()
    dest?: Destination;
}
