/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Transform, Type } from 'class-transformer';
import { IsDefined, IsNotEmptyObject, IsNumber, IsObject, IsOptional, ValidateNested, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { transformToNumber } from '../common/Transform';
import { CodeVersionObject } from '../resources/dto/PostShareReqDto';
/* eslint-enable */

export class CodeObject {
    @Transform(transformToNumber)
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    _value: number;
}

export class DataType {
    @IsDefined()
    @IsObject()
    @Type(type => CodeVersionObject)
    @ValidateNested()
    code: CodeVersionObject;

    @IsOptional()
    @IsArray()
    @Type(type => CodeVersionObject)
    @ValidateNested()
    thing: CodeVersionObject[];
}

export class Condition {
    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested()
    document: DataType[];

    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested()
    event: DataType[];

    @IsOptional()
    @IsArray()
    @Type(type => CodeVersionObject)
    @ValidateNested()
    thing: CodeVersionObject[];
}
export class ShareObject {
    @IsDefined()
    @IsObject()
    @Type(type => CodeVersionObject)
    @ValidateNested()
    code: CodeVersionObject;
}

export default class {
    id: number;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @Type(type => CodeObject)
    @ValidateNested()
    actor: CodeObject;

    @IsOptional()
    @IsObject()
    @Type(type => CodeObject)
    @ValidateNested()
    app: CodeObject;

    @IsOptional()
    @IsObject()
    @Type(type => CodeObject)
    @ValidateNested()
    wf: CodeObject;

    @IsDefined()
    @IsArray()
    @Type(type => ShareObject)
    @ValidateNested()
    share: ShareObject[];
}
