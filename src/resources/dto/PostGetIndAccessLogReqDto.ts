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
import { IsString, IsDefined, IsNotEmpty, ValidateNested, IsOptional, IsDate, IsNumber, Contains, Validate, Matches, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { transformToDateTime, transformToNumber } from '../../common/Transform';

/**
 * POST: 個人用共有アクセスログ取得APIのリクエストDTO
 */
export class CodeVersionObject {
    @IsNumber()
    @IsDefined()
    _value: number;

    @IsNumber()
    @IsDefined()
    _ver: number;
}

export class CodeObject {
    @IsNumber()
    @IsDefined()
    _value: number;
}

export class DateStartEndObject {
    @Transform(transformToDateTime)
    @IsDate()
    @IsOptional()
    start: Date;

    @Transform(transformToDateTime)
    @IsDate()
    @IsOptional()
    end: Date;
}

export default class PostGetIndAccessLogReqDto {
    /**
     * 検索開始日時
     */
    @IsOptional()
    @Type(() => DateStartEndObject)
    @ValidateNested()
    accessAt: DateStartEndObject;

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
     * ユーザID
     */
    @IsString()
    @IsDefined()
    userId: string;

    /**
     * ドキュメントオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    document?: CodeVersionObject[];

    /**
     * イベントオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    event?: CodeVersionObject[];

    /**
     * モノオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    thing?: CodeVersionObject[];
}
