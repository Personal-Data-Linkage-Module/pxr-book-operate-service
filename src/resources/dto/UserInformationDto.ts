/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import {
    IsNumber,
    IsDefined,
    IsString,
    ValidateNested,
    IsNotEmptyObject,
    IsArray,
    IsNotEmpty,
    IsBoolean,
    IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotObject } from '../../common/Transform';

export class CodeObject {
    @IsDefined()
    @IsNumber()
    _value: number;

    @IsDefined()
    @IsNumber()
    _ver: number;
}

export class Item {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsDefined()
    @Type(() => CodeObject)
    @ValidateNested()
    @IsNotEmptyObject()
    type: CodeObject;

    @IsOptional()
    @IsNotObject()
    content: string | boolean | number | undefined | null;

    @IsBoolean()
    @IsOptional()
    'changeable-flag': boolean;
}

export class ItemGroup {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsDefined()
    @IsArray()
    @Type(() => Item)
    @ValidateNested({ each: true })
    item: Item[]
}

export default class {
    @IsDefined()
    @Type(() => CodeObject)
    @ValidateNested()
    @IsNotEmptyObject()
    _code: CodeObject;

    @IsDefined()
    @IsArray()
    @Type(() => ItemGroup)
    @ValidateNested({ each: true })
    'item-group': ItemGroup[];
}
