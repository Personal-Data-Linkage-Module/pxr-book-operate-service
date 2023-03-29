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
import BookDto from './dto/BookDto';
import Document from '../repositories/postgres/Document';
import Event from '../repositories/postgres/Event';
import Thing from '../repositories/postgres/Thing';
/* eslint-enable */
import PostGetBookResDto from '../resources/dto/PostGetBookResDto';
import EntityOperation from '../repositories/EntityOperation';
import { ResponseCode } from '../common/ResponseCode';
import Config from '../common/Config';
import AppError from '../common/AppError';
import { DateTimeFormatString } from '../common/Transform';
import moment = require('moment-timezone');
const config = Config.ReadConfig('./config/config.json');
const Message = Config.ReadConfig('./config/message.json');

@Service()
export default class BookService {
    /**
     * BOOK参照
     * @param dto
     */
    public async getBook (dto: BookDto): Promise<PostGetBookResDto> {
        // 対象IDデータを宣言
        let responseList: {}[] = [];
        const documentList: string[] = [];
        const eventList: string[] = [];
        const thingList: string[] = [];

        // 各タイプ毎の処理
        if (dto.getType() === 'document') {
            // ドキュメントを取得
            responseList = await this.getDocumentBook(dto);
            documentList.push(...responseList.map((ele: any) => ele.id ? ele.id.value : null));
        } else if (dto.getType() === 'event') {
            // イベントを取得
            responseList = await this.getEventBook(dto);
            eventList.push(...responseList.map((ele: any) => ele.id ? ele.id.value : null));
        } else if (dto.getType() === 'thing') {
            // モノを取得
            responseList = await this.getThingBook(dto);
            thingList.push(...responseList.map((ele: any) => ele.id ? ele.id.value : null));
        } else {
            // ドキュメントを取得
            let result = await this.getDocumentBook(dto);
            responseList = responseList.concat(result);
            documentList.push(...result.map((ele: any) => ele.id ? ele.id.value : null));

            // イベントを取得
            result = await this.getEventBook(dto);
            responseList = responseList.concat(result);
            eventList.push(...result.map((ele: any) => ele.id ? ele.id.value : null));

            // モノを取得
            result = await this.getThingBook(dto);
            responseList = responseList.concat(result);
            thingList.push(...result.map((ele: any) => ele.id ? ele.id.value : null));
        }
        // 対象データがない場合はエラーを返す
        if (!responseList || responseList.length <= 0) {
            throw new AppError(Message.TARGET_NO_DATA, ResponseCode.NO_CONTENT);
        }
        // レスポンスを生成
        const response: PostGetBookResDto = new PostGetBookResDto();
        response.setFromJson(responseList);

        // レスポンスを返す
        return response;
    }

    /**
     * Book取得(ドキュメント)
     * @param dto
     */
    public async getDocumentBook (dto: BookDto): Promise<{}[]> {
        // 対象Book検索(ID取得)
        const result = await EntityOperation.getBook('document', dto.getUserId(), dto.getIdentifier(), dto.getUpdatedAt(), dto.getCode(), null, dto.getApp());
        if (!result || result.length <= 0) {
            // 対象データがない場合は空配列を返す
            return [];
        }
        // 対象IDデータを取得
        const responseList: {}[] = [];

        // ドキュメント指定の場合
        for (const doc of result) {
            // 対象ドキュメントデータを取得
            const docInfo = await EntityOperation.getDocumentRecordById(doc['document_id']);

            // 対象ドキュメントイベントセットリレーションデータを取得
            const eventSetRelationList = await EntityOperation.getDocumentEventSetRelationRecord(docInfo['id'], null);

            const chapterList: {}[] = [];
            const eventIdentifierList: string[] = [];
            const sourceIdList: string[] = [];
            for (const eventSetRelation of eventSetRelationList) {
                // 対象イベントセットイベントリレーションデータを取得
                const eventRelationList = await EntityOperation.getEventSetEventRelationRecord(eventSetRelation['id'], null);
                for (const eventRelation of eventRelationList) {
                    // 対象イベントデータを取得
                    const eventInfo = await EntityOperation.getEventRecordById(eventRelation['eventId']);
                    eventIdentifierList.push(eventInfo.eventIdentifier);
                    sourceIdList.push(eventInfo.sourceId);
                }
                // チャプターにタイトル、イベント識別子、ソースIDを設定
                chapterList.push({
                    title: eventSetRelation['title'],
                    event: eventIdentifierList.length > 0 ? eventIdentifierList : null,
                    sourceId: sourceIdList.length > 0 ? sourceIdList : null
                });
            }
            // ドキュメントオブジェクトをレスポンスに設定
            responseList.push(this.createDocumentObject(docInfo, chapterList));
        }
        // レスポンスを返す
        return responseList;
    }

    /**
     * Book取得(イベント)
     * @param dto
     */
    public async getEventBook (dto: BookDto): Promise<{}[]> {
        // 対象Book検索(ID取得)
        const result = await EntityOperation.getBook('event', dto.getUserId(), dto.getIdentifier(), dto.getUpdatedAt(), dto.getCode(), null, dto.getApp());
        if (!result || result.length <= 0) {
            // 対象データがない場合は空配列を返す
            return [];
        }
        // 対象IDデータを取得
        const responseList: {}[] = [];

        // イベント指定の場合
        for (const event of result) {
            // 対象イベントデータを取得
            const eventInfo = await EntityOperation.getEventRecordById(event['event_id']);

            // 対象モノデータを取得
            const thingList = await EntityOperation.getThingRecordByEventId(dto.getUserId(), eventInfo['id']);

            // モノオブジェクトを設定
            const eventObject: {} = this.createEventObject(eventInfo);
            const thingObjectList: {}[] = [];
            for (const thing of thingList) {
                thingObjectList.push(this.createThingObject(thing));
            }
            // イベント、モノオブジェクトをレスポンスに設定
            eventObject['thing'] = thingObjectList.length > 0 ? thingObjectList : null;
            responseList.push(eventObject);
        }
        // レスポンスを返す
        return responseList;
    }

    /**
     * Book取得(モノ)
     * @param dto
     */
    public async getThingBook (dto: BookDto): Promise<{}[]> {
        // 対象Book検索(ID取得)
        const result = await EntityOperation.getBook('thing', dto.getUserId(), dto.getIdentifier(), dto.getUpdatedAt(), dto.getCode(), null, dto.getApp());
        if (!result || result.length <= 0) {
            // 対象データがない場合は空配列を返す
            return [];
        }
        // 対象IDデータを取得
        const responseList: {}[] = [];

        // モノ指定の場合
        for (const thing of result) {
            // 対象モノデータを取得
            const thingInfo = await EntityOperation.getThingRecordById(thing['thing_id']);

            // モノオブジェクトをレスポンスに設定
            responseList.push(this.createThingObject(thingInfo));
        }
        // レスポンスを返す
        return responseList;
    }

    /**
     * ドキュメントオブジェクト生成
     * @param dto
     * @param chapterList
     */
    private createDocumentObject (dto: Document, chapterList: {}[]): {} {
        return {
            id: {
                index: '2_1_1',
                value: dto.docIdentifier ? dto.docIdentifier : null
            },
            code: {
                index: '2_1_2',
                value: {
                    _value: dto.docCatalogCode ? Number(dto.docCatalogCode) : null,
                    _ver: dto.docCatalogVersion ? Number(dto.docCatalogVersion) : null
                }
            },
            createAt: {
                index: '2_2_1',
                value: dto.docCreateAt ? moment(dto.docCreateAt).tz(config['timezone']).format(DateTimeFormatString) : null
            },
            sourceId: dto.sourceId ? dto.sourceId : null,
            app: dto.appCatalogCode ? {
                code: {
                    index: '2_3_1',
                    value: {
                        _value: dto.docActorCode ? Number(dto.docActorCode) : null,
                        _ver: dto.docActorVersion ? Number(dto.docActorVersion) : null
                    }
                },
                app: {
                    index: '2_3_5',
                    value: {
                        _value: dto.appCatalogCode ? Number(dto.appCatalogCode) : null,
                        _ver: dto.appCatalogVersion ? Number(dto.appCatalogVersion) : null
                    }
                }
            } : null,
            wf: dto.wfCatalogCode ? {
                code: {
                    index: '2_3_1',
                    value: {
                        _value: null,
                        _ver: null
                    }
                },
                wf: {
                    index: '2_3_2',
                    value: {
                        _value: null,
                        _ver: null
                    }
                },
                role: {
                    index: '2_3_3',
                    value: {
                        _value: null,
                        _ver: null
                    }
                },
                staffId: {
                    index: '2_3_4',
                    value: null
                }
            } : null,
            chapter: chapterList.length > 0 ? chapterList : null
        };
    }

    /**
     * イベントオブジェクト生成
     * @param dto
     */
    private createEventObject (dto: Event): {} {
        const template = JSON.parse(dto.template);
        return {
            id: {
                index: '3_1_1',
                value: dto.eventIdentifier ? dto.eventIdentifier : null
            },
            code: {
                index: '3_1_2',
                value: {
                    _value: dto.eventCatalogCode ? Number(dto.eventCatalogCode) : null,
                    _ver: dto.eventCatalogVersion ? Number(dto.eventCatalogVersion) : null
                }
            },
            start: {
                index: '3_2_1',
                value: dto.eventStartAt ? moment(dto.eventStartAt).tz(config['timezone']).format(DateTimeFormatString) : null
            },
            end: {
                index: '3_2_2',
                value: dto.eventEndAt ? moment(dto.eventEndAt).tz(config['timezone']).format(DateTimeFormatString) : null
            },
            location: {
                index: '3_3_1',
                value: dto.eventOutbreakPosition ? dto.eventOutbreakPosition : null
            },
            sourceId: dto.sourceId ? dto.sourceId : null,
            env: template && template['env'] ? template['env'] : null,
            app: dto.appCatalogCode ? {
                code: {
                    index: '3_5_1',
                    value: {
                        _value: dto.eventActorCode ? Number(dto.eventActorCode) : null,
                        _ver: dto.eventActorVersion ? Number(dto.eventActorVersion) : null
                    }
                },
                app: {
                    index: '3_5_5',
                    value: {
                        _value: dto.appCatalogCode ? Number(dto.appCatalogCode) : null,
                        _ver: dto.appCatalogVersion ? Number(dto.appCatalogVersion) : null
                    }
                }
            } : null,
            wf: dto.wfCatalogCode ? {
                code: {
                    index: '3_5_1',
                    value: {
                        _value: null,
                        _ver: null
                    }
                },
                wf: {
                    index: '3_5_2',
                    value: {
                        _value: null,
                        _ver: null
                    }
                },
                role: {
                    index: '3_5_3',
                    value: {
                        _value: null,
                        _ver: null
                    }
                }
            } : null
        };
    }

    /**
     * モノオブジェクト生成
     * @param dto
     */
    private createThingObject (dto: Thing): {} {
        if (!dto.template) {
            return {
                id: {
                    value: dto.thingIdentifier ? dto.thingIdentifier : null
                }
            };
        }
        const template = JSON.parse(dto.template);
        template['id'] = {
            index: '4_1_1',
            value: dto.thingIdentifier ? dto.thingIdentifier : null
        };
        template['code'] = {
            index: '4_1_2',
            value: {
                _value: dto.thingCatalogCode ? Number(dto.thingCatalogCode) : null,
                _ver: dto.thingCatalogVersion ? Number(dto.thingCatalogVersion) : null
            }
        };
        template['sourceId'] = dto.sourceId ? dto.sourceId : null;
        delete template['_code'];
        return template;
    }
}
