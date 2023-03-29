/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CodeVersionObject as CodeObject } from '../resources/dto/PostShareReqDto';
/* eslint-enable */

export class DataType {
    @IsOptional()
    @IsArray()
    @Type(type => CodeObject)
    @ValidateNested({ each: true })
    sourceActor: CodeObject[];

    @IsOptional()
    @Type(type => CodeObject)
    @ValidateNested({ each: true })
    code: CodeObject;

    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested({ each: true })
    thing: DataType[];
}

export class ShareCode {
    @IsDefined()
    @IsString()
    id: string;

    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested({ each: true })
    document: DataType[];

    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested({ each: true })
    event: DataType[];

    @IsOptional()
    @IsArray()
    @Type(type => DataType)
    @ValidateNested({ each: true })
    thing: DataType[];
}

export class Template {
    @IsDefined()
    @IsArray()
    @Type(type => ShareCode)
    @ValidateNested({ each: true })
    share: ShareCode[];
}

export default class {
    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(type => Template)
    template: Template;
}
