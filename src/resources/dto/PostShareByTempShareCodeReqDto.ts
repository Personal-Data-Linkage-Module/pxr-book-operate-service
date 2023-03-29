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
import Config from '../../common/Config';
import moment = require('moment-timezone');
const configure = Config.ReadConfig('./config/config.json');

/**
 * POST: データ共有によるデータ取得のリクエストDTO
 */
export class CodeVersionObject {
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

export class DateStartEndObject {
    @Transform(transformToDateTime)
    @IsDate()
    @IsNotEmpty()
    @IsDefined()
    start: Date;

    @Transform(transformToDateTime)
    @IsDate()
    @IsDefined()
    end: Date;
}

export default class PostShareByTempShareCodeReqDto {
    /**
     * 一時的データ共有APIコード
     */
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    @IsDefined()
    tempShareCode: string;

    /**
     * 識別子
     */
    @IsOptional()
    @IsArray()
    @IsNotEmpty()
    identifier: string[];

    /**
     * 検索更新日時
     */
    @IsOptional()
    @Type(() => DateStartEndObject)
    @ValidateNested()
    updatedAt: DateStartEndObject;

    /**
     * コードオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    document?: CodeVersionObject[];

    /**
     * コードオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    event?: CodeVersionObject[];
    
    /**
     * コードオブジェクト
     */
    @IsOptional()
    @IsArray()
    @Type(() => CodeVersionObject)
    @ValidateNested({ each: true })
    thing?: CodeVersionObject[];

    /**
     * データ構造取得(JSON用連想配列)
     */
    public getAsJson (): {} {
        const documentList: {}[] = [];
        if (this.document) {
            for (let index = 0; index < this.document.length; index++) {
                documentList.push({
                    _value: this.document[index]._value ? this.document[index]._value : null,
                    _ver: this.document[index]._ver ? this.document[index]._ver : null
                });
            }
        }
        const eventList: {}[] = [];
        if (this.event) {
            for (let index = 0; index < this.event.length; index++) {
                eventList.push({
                    _value: this.event[index]._value ? this.event[index]._value : null,
                    _ver: this.event[index]._ver ? this.event[index]._ver : null
                });
            }
        }
        const thingList: {}[] = [];
        if (this.thing) {
            for (let index = 0; index < this.thing.length; index++) {
                thingList.push({
                    _value: this.thing[index]._value ? this.thing[index]._value : null,
                    _ver: this.thing[index]._ver ? this.thing[index]._ver : null
                });
            }
        }
        return {
            tempShareCode: this.tempShareCode,
            identifier: this.identifier && this.identifier.length > 0 ? this.identifier : null,
            updatedAt: this.updatedAt ? {
                start: this.updatedAt.start ? moment(this.updatedAt.start).tz(configure['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null,
                end: this.updatedAt.end ? moment(this.updatedAt.end).tz(configure['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null
            } : null,
            document: documentList.length > 0 ? documentList : null,
            event: eventList.length > 0 ? eventList : null,
            thing: thingList.length > 0 ? thingList : null
        };
    }
}

