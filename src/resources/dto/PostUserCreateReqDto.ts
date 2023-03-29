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
import { IsString, IsDefined, IsNotEmpty, ValidateNested, IsOptional, IsNotEmptyObject } from 'class-validator';
import { Type } from 'class-transformer';
import UserInformationDto from './UserInformationDto';

export default class PostUserCreateReqDto {
    /** identifyCode */
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    identifyCode: string;

    /** attributes */
    @ValidateNested()
    @IsOptional()
    attributes: any = {};

    @ValidateNested()
    @IsOptional()
    @Type(() => UserInformationDto)
    @IsNotEmptyObject()
    userInformation: UserInformationDto | undefined;
}
