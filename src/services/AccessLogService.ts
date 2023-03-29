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

/* eslint-disable */
import { Service } from 'typedi';
import ShareAccessLog from '../repositories/postgres/ShareAccessLog';
import ShareAccessLogDataType from '../repositories/postgres/ShareAccessLogDataType';
import PostGetIndAccessLogReqDto from '../resources/dto/PostGetIndAccessLogReqDto';
import Operator from '../resources/dto/OperatorReqDto';
/* eslint-enable */
import EntityOperation from '../repositories/EntityOperation';
import { OperatorType } from '../common/Operator';
import { ResponseCode } from '../common/ResponseCode';
import Config from '../common/Config';
import AppError from '../common/AppError';
import moment = require('moment-timezone');
const config = Config.ReadConfig('./config/config.json');
const Message = Config.ReadConfig('./config/message.json');

@Service()
export default class AccessLogService {
    /**
     * 個人用共有アクセスログ取得
     * @param dto
     */
    public async getIndAccessLog (dto: PostGetIndAccessLogReqDto, operator: Operator) {
        // 個人以外ならエラー
        if (operator.getType() !== OperatorType.TYPE_IND) {
            throw new AppError(Message.REQUEST_UNAUTORIZED, ResponseCode.UNAUTHORIZED);
        }

        // BOOKを取得する
        const books = await EntityOperation.getBookByUserIdWithProvider(
            dto.userId,
            null,
            dto.app ? dto.app._value : null
        );
        // BOOKが1件も無い場合エラー
        if (books.length <= 0) {
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NO_CONTENT);
        }

        // ログを取得
        const resultList: ShareAccessLog[] = [];
        for (const book of books) {
            const result = await EntityOperation.getShareAccessLog(
                book.id,
                dto.accessAt && dto.accessAt.start ? dto.accessAt.start : null,
                dto.accessAt && dto.accessAt.end ? dto.accessAt.end : null,
                dto.document ? dto.document : null,
                dto.event ? dto.event : null,
                dto.thing ? dto.thing : null
            );
            resultList.push(...result);
        }

        // 対象レコードがない場合
        if (resultList.length <= 0) {
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NO_CONTENT);
        }

        // レスポンスを生成
        const response = await this.createResponse(resultList);
        return response;
    }

    /**
     * レスポンスを生成
     * @param resultList
     *
     * RefactorDescription:
     *  #3803 : countDataType
     */
    private async createResponse (resultList: ShareAccessLog[]) {
        const response: any[] = [];
        for (const result of resultList) {
            const res: any = {};

            res.bookId = result.myConditionBookId;
            res.logIdentifier = result.logIdentifier;
            res.accessAt = result.accessAt ? moment(result.accessAt).tz(config['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null;
            res.type = result.dataType;
            res.shareCatalogCode = result.shareCatalogCode;
            const requestActor = {
                _value: result.reqActorCatalogCode,
                _ver: result.reqActorCatalogVersion
            };
            const requestBlock = {
                _value: result.reqBlockCatalogCode,
                _ver: result.reqBlockCatalogVersion
            };
            res.request = {};
            res.request.actor = requestActor;
            res.request.block = requestBlock;

            const dataTypeList: any[] = [];
            dataTypeList.push(...result.dataTypes);

            // データ種をカウントする
            const { document, event, thing } = await this.countDataType(dataTypeList);

            res.document = document.length > 0 ? document : undefined;
            res.event = event.length > 0 ? event : undefined;
            res.thing = thing.length > 0 ? thing : undefined;

            response.push(res);
        }

        // レスポンスからbookIdを削除
        for (const res of response) {
            delete res.bookId;
        }

        return response;
    }

    /**
     * データ種をカウント
     */
    private async countDataType (dataTypeList: any[]) {
        const document: any[] = [];
        const event: any[] = [];
        const thing: any[] = [];

        for (const dataType of dataTypeList) {
            let tempDataTypeCodes = null;
            if (dataType.dataType === ShareAccessLogDataType.DATA_TYPE_DOCUMENT) {
                // ドキュメントの場合
                tempDataTypeCodes = document;
            }
            if (dataType.dataType === ShareAccessLogDataType.DATA_TYPE_EVENT) {
                // イベントの場合
                tempDataTypeCodes = event;
            }
            if (dataType.dataType === ShareAccessLogDataType.DATA_TYPE_THING) {
                // モノの場合
                tempDataTypeCodes = thing;
            }
            // 各データ種のコードが既に存在しているならカウント数を追加
            // 存在しないならコードを追加
            if (tempDataTypeCodes.length > 0) {
                let isExist = false;
                for (const tempDataTypeCode of tempDataTypeCodes) {
                    if (tempDataTypeCode._code._value === dataType.dataTypeCatalogCode) {
                        tempDataTypeCode.count++;
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    tempDataTypeCodes.push({
                        _code: {
                            _value: dataType.dataTypeCatalogCode,
                            _ver: dataType.dataTypeCatalogVersion
                        },
                        count: 1
                    });
                }
            } else {
                tempDataTypeCodes.push({
                    _code: {
                        _value: dataType.dataTypeCatalogCode,
                        _ver: dataType.dataTypeCatalogVersion
                    },
                    count: 1
                });
            }
        }
        return { document, event, thing };
    }
}
