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
import ShareDto from './dto/ShareDto';
import Operator from '../resources/dto/OperatorReqDto';
import PostShareReqDto, { CodeVersionObject, Destination } from '../resources/dto/PostShareReqDto';
import PostShareByTempShareCodeReqDto from '../resources/dto/PostShareByTempShareCodeReqDto';
import ShareAccessLog from '../repositories/postgres/ShareAccessLog';
import EntityOperation from '../repositories/EntityOperation';
import ShareAccessLogDataType from '../repositories/postgres/ShareAccessLogDataType';
import { OperatorType } from '../common/Operator';
import CatalogDto from './dto/CatalogDto';
import CatalogService from './CatalogService';
import { transformAndValidate } from 'class-transformer-validator';
import SharingCatalog, { DataType, ShareCode } from '../domains/SharingCatalog';
import SharingDataDefinition, { Condition, DataType as TriggerDataType } from '../domains/SharingDataDefinition';
import { sprintf } from 'sprintf-js';
import { ResponseCode } from '../common/ResponseCode';
import AppError from '../common/AppError';
import PostShareResDto from '../resources/dto/PostShareResDto';
import PostShareByTempShareCodeResDto from '../resources/dto/PostShareByTempShareCodeResDto';
import PostShareSearchResDto from '../resources/dto/PostShareSearchResDto';
import BookOperateService from './BookOperateService';
import BookService from './BookService';
import BookDto from './dto/BookDto';
import BookManageDto from './dto/BookManageDto';
import BookManageService from './BookManageService';
import Config from '../common/Config';
import { applicationLogger } from '../common/logging';
import urljoin = require('url-join');
/* eslint-enable */
const configure = Config.ReadConfig('./config/config.json');
const message = Config.ReadConfig('./config/message.json');

@Service()
export default class ShareService {
    /**
     * データ共有によるデータ取得
     * @param dto
     *
     * RefactorDescription:
     *  #3803 : getWorkflowCatalogCode
     */
    public async getShare (dto: PostShareReqDto, operator: Operator, accessToken: string, targetActor?: number, targetApp?: number, targetWf?: number): Promise<PostShareResDto> {
        let app = null;
        // セッション情報からapp,wfコードの取得
        const data = JSON.parse(decodeURIComponent(operator.getEncodeData()));
        app = operator.getType() === OperatorType.TYPE_APP ? parseInt(data['roles'][0]['_value']) : null;

        // 共有定義の取得
        const bookManageService: BookManageService = new BookManageService();
        const bookManageDto: BookManageDto = new BookManageDto();
        let settingShareUrl;
        const baseUrl = configure['bookManageUrl'];
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            settingShareUrl = urljoin(baseUrl, '/setting/share');
        } else {
            settingShareUrl = baseUrl + encodeURIComponent('/setting/share');
        }
        bookManageDto.setUrl(settingShareUrl);
        bookManageDto.setUserId(dto.userId);
        bookManageDto.setActor(null);
        bookManageDto.setApplication(app);
        bookManageDto.setWorkflow(null);
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(message);
        const sharingDefs = await bookManageService.getDataShareDefined(bookManageDto);
        // データ種ごとに共有元の特定
        const { requests, targetShares, targetConditions } = await this.checkAllowedDataDefinitionAndCreateReq(sharingDefs, operator, dto);
        // 特定した共有元を指定してProxyサービス経由でデータ共有を呼出してデータを取得
        const results = [];
        applicationLogger.info('requests: ' + JSON.stringify(requests));
        for (const req of requests) {
            // Proxyサービス経由でデータ共有を呼出してデータを取得
            const result = await BookOperateService.doLinkingGetShareSearch(operator.getBlockCode(), req, operator, accessToken);
            applicationLogger.info('result: ' + JSON.stringify(result));
            results.push(result);
        }

        // 取得したイベントにモノが含まれる場合、共有定義に定義されているモノのみになるようにフィルタする
        if (results && results.length > 0) {
            // resultのイベント内のthingについてフィルタを行う
            for (const res of results) {
                if (!res.event || res.event.length < 1) {
                    continue;
                }
                this.filterEveThing(res, dto, targetShares, targetConditions);
            }
        }

        // レスポンスを生成
        const response: PostShareResDto = new PostShareResDto();
        response.setFromJson(results);
        // レスポンスを返す
        return response;
    }

    /**
     * 取得したイベントにモノが含まれる場合、共有定義に定義されているモノのみになるようにフィルタする
     * @param res
     * @param dto
     * @param targetShares
     * @param targetConditions
     */
    private filterEveThing (res: any, dto: PostShareReqDto, targetShares: ShareCode[], targetConditions: Condition[]) {
        for (const eve of res.event) {
            if (eve.thing && eve.thing.length > 0) {
                const filteredThing = [];
                for (const thi of eve.thing) {
                    let exisits = false;
                    if (!dto.dest) {
                        // 共有トリガー以外からの呼出の場合
                        for (const share of targetShares) {
                            if (share.event && share.event.length > 0) {
                                for (const eveDefs of share.event) {
                                    if (eveDefs.code._value === Number(eve.code.value._value) && eveDefs.code._ver === Number(eve.code.value._ver)) {
                                        if (!eveDefs.thing || eveDefs.thing.length <= 0) {
                                            exisits = true;
                                            break;
                                        } else if (eveDefs.thing.some(elem => elem.code._value === Number(thi.code.value._value) && elem.code._ver === Number(thi.code.value._ver))) {
                                            exisits = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (exisits) {
                                break;
                            }
                        }
                    }

                    if (exisits) {
                        filteredThing.push(thi);
                    }
                }
                eve.thing = filteredThing;
            }
        }
    }

    /**
     * 一時的データ共有コードによるデータ取得
     * @param dto
     *
     * RefactorDescription:
     *  #3803 : getDataTypeIdList
     */
    public async getShareByTempShareCode (dto: PostShareByTempShareCodeReqDto, operator: Operator, accessToken: string): Promise<PostShareByTempShareCodeResDto> {
        const bookManageDto = new BookManageDto();
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(message);
        let url;
        const baseUrl = configure['bookManageUrl'];
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            url = urljoin(baseUrl, '/share/temp/collation');
        } else {
            url = baseUrl + encodeURIComponent('/share/temp/collation');
        }
        bookManageDto.setUrl(url);
        bookManageDto.setTempShareCode(dto.tempShareCode);
        const tempShareCode = await new BookManageService().getCollationTempShareCode(bookManageDto);

        // Proxyサービス経由でデータ共有を呼出してデータを取得
        const result = await BookOperateService.doLinkingGetShareSearch(operator.getBlockCode(), dto.getAsJson(), operator, accessToken);

        let filteredRes: any = {};
        if (tempShareCode.identifier && tempShareCode.identifier.length > 0) {
            // 対象データ種識別子格納用
            result.document = result.document || [];
            result.event = result.event || [];
            result.thing = result.thing || [];
            const { targetDocList, targetEveList, targetThiList } = await this.getDataTypeIdList(tempShareCode, result);

            // 各データを共有条件でフィルタリング（eventはevent内の各thingについてもフィルタリング）
            const filteredDocument = result.document ? result.document.filter((doc: any) => targetDocList.includes(doc.id.value)) : [];
            const filteredEvent = result.event ? result.event.filter((eve: any) => targetEveList.includes(eve.id.value)) : [];
            if (filteredEvent.length > 0) {
                for (const event of filteredEvent) {
                    event['thing'] = event['thing'].filter((thi: any) => targetThiList.includes(thi.id.value));
                }
            }
            const filteredThing = result.thing ? result.thing.filter((thi: any) => targetThiList.includes(thi.id.value)) : [];

            filteredRes = {
                document: filteredDocument,
                event: filteredEvent,
                thing: filteredThing
            };
        } else {
            filteredRes = result;
        }

        // レスポンスを生成
        const response: PostShareByTempShareCodeResDto = new PostShareByTempShareCodeResDto();
        response.setFromJson(filteredRes);

        // レスポンスを返す
        return response;
    }

    /**
     * 対象データ種識別子取得
     * @param tempShareCode
     * @param result
     * @returns
     */
    private async getDataTypeIdList (tempShareCode: any, result: any) {
        let targetDocList: string[] = [];
        let targetEveList: string[] = [];
        let targetThiList: string[] = [];
        for (const identifier of tempShareCode.identifier) {
            if (identifier.document) {
                if (result.document.length === 0) {
                    continue;
                }
                // "document" に値が設定されている場合
                targetDocList.push(identifier.document);
                // ドキュメントから配下イベントの識別子、ソースIDを取得
                let eventIds: string[] = [];
                const eventSourceIds: string[] = [];
                result.document
                    .filter((doc: any) => doc.id.value === identifier.document)
                    .reduce((chapters: any, _doc: any) => chapters.concat(_doc.chapter), [])
                    .forEach((chap: any) => {
                        eventIds.push(...(chap.event || []));
                        eventSourceIds.push(...(chap.sourceId || []));
                    });
                if (identifier.event && identifier.event.length > 0) {
                    // "event" 指定の場合、ドキュメント配下のイベントのうち、対象のイベント、モノのみ共有
                    // 対象のイベントを取得
                    eventIds = result.event
                        .filter((eve: any) =>
                            (eventSourceIds.includes(eve.sourceId) || eventIds.includes(eve.id.value)) &&
                            identifier.event.includes(eve.id.value)
                        )
                        .map((_eve: any) => _eve.id.value);
                    targetEveList.push(...eventIds);
                    if (identifier.thing && identifier.thing.length > 0) {
                        // "thing" 指定の場合、対象のモノのみを取得
                        targetThiList.push(...identifier.thing);
                    } else {
                        // 指定が無い場合、イベント配下のモノを全て取得
                        targetThiList.push(...result.event
                            .filter((eve: any) => eventIds.includes(eve.id.value))
                            .reduce((things: any, eve: any) => things.concat(eve.thing), [])
                            .map((thi: any) => thi.id.value)
                        );
                    }
                } else {
                    // "event", "thing"が指定されていない場合、対象ドキュメント配下のイベント、モノすべてを共有対象とする
                    // 対象のイベントを取得
                    eventIds = result.event
                        .filter((eve: any) => eventSourceIds.includes(eve.sourceId) || eventIds.includes(eve.id.value))
                        .map((_eve: any) => _eve.id.value);
                    targetEveList.push(...eventIds);
                    // 対象のモノを取得
                    targetThiList.push(...result.event
                        .filter((eve: any) => eventIds.includes(eve.id.value))
                        .reduce((things: any, _eve: any) => things.concat(_eve.thing), [])
                        .map((thi: any) => thi.id.value)
                    );
                }
            } else if (!identifier.document && identifier.event && typeof identifier.event === 'string') {
                if (result.event.length === 0) {
                    continue;
                }
                // "document" に値が設定されていないかつ "event" に単一の string が設定されている場合
                targetEveList.push(identifier.event);
                const thingIds: string[] = [];
                // 対象のイベント配下のモノも含めて共有対象とする
                thingIds.push(...result.event
                    .filter((eve: any) => eve.id.value === identifier.event)
                    .reduce((newArr: any, eve: any) => newArr.concat(eve.thing), [])
                    .map((thi: any) => thi.id.value)
                );
                if (identifier.thing && identifier.thing.length > 0) {
                    // "thing" が指定されている場合、対象イベント配下のうち指定されたモノのみを共有対象とする
                    targetThiList.push(...thingIds.filter((id: string) => identifier.thing.includes(id)));
                } else {
                    // "thing" が指定されていない場合、対象イベント配下のモノすべてを共有対象とする
                    targetThiList.push(...thingIds);
                }
            } else if (!identifier.document && !identifier.event && identifier.thing && identifier.thing.length > 0) {
                if (result.thing.length === 0) {
                    continue;
                }
                // "document" および "event" に値が設定されていない場合で "thing" に値が設定されている場合
                targetThiList.push(...identifier.thing);
            }
        }
        // 識別子重複削除
        targetDocList = Array.from(new Set(targetDocList));
        targetEveList = Array.from(new Set(targetEveList));
        targetThiList = Array.from(new Set(targetThiList));
        return { targetDocList, targetEveList, targetThiList };
    }

    /**
     * データ共有
     * @param dto
     *
     * RefactorDescription:
     *  #3803 : getDataTypaList
     */
    public async getShareSearch (dto: ShareDto): Promise<PostShareSearchResDto> {
        // userIdを取得
        let pxrId;
        let targetCoop;
        const bookManageService: BookManageService = new BookManageService();
        if (dto.getTempShareCode()) {
            const bookManageDto: BookManageDto = new BookManageDto();
            bookManageDto.setTempShareCode(dto.getTempShareCode());
            let url;
            const baseUrl = configure['bookManageUrl'];
            if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
                url = urljoin(baseUrl, '/share/temp/collation');
            } else {
                url = baseUrl + encodeURIComponent('/share/temp/collation');
            }
            bookManageDto.setUrl(url);
            bookManageDto.setOperator(dto.getOperator());
            bookManageDto.setMessage(message);
            const searchTemp = await bookManageService.getCollationTempShareCode(bookManageDto);
            pxrId = searchTemp['pxrId'];
        } else {
            const bookSearchUser: BookManageDto = new BookManageDto();
            bookSearchUser.setUserId(dto.getUserId());
            let url;
            const baseUrl = configure['bookManageUrl'];
            if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
                url = urljoin(baseUrl, '/search/user');
            } else {
                url = baseUrl + encodeURIComponent('/search/user');
            }
            bookSearchUser.setUrl(url);
            bookSearchUser.setOperator(dto.getOperator());
            bookSearchUser.setMessage(message);
            if (dto.getActorCode()) {
                bookSearchUser.setActor(dto.getActorCode());
            }
            const searchUser = await bookManageService.searchUser(bookSearchUser);
            pxrId = searchUser['pxrId'];
        }
        const bookSearch: BookManageDto = new BookManageDto();
        let bookSearchUrl;
        const baseUrl = configure['bookManageUrl'];
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            bookSearchUrl = urljoin(baseUrl, '/search');
        } else {
            bookSearchUrl = baseUrl + encodeURIComponent('/search');
        }
        bookSearch.setUrl(bookSearchUrl);
        bookSearch.setOperator(dto.getOperator());
        bookSearch.setMessage(message);
        const book = await bookManageService.getCoopList(bookSearch, pxrId);
        if (book && Array.isArray(book)) {
            targetCoop = book[0]['cooperation'];
        } else {
            throw new AppError('bookが存在しません', ResponseCode.INTERNAL_SERVER_ERROR);
        }

        // ドキュメント、イベント、モノを取得
        const { documentList, eventList, thingList } = await this.getDataTypaList(targetCoop, dto);

        // レスポンスを生成
        const response: PostShareSearchResDto = new PostShareSearchResDto();
        response.documentList = documentList;
        response.eventList = eventList;
        response.thingList = thingList;

        // レスポンスを返す
        return response;
    }

    /**
     * ドキュメント/イベント/モノを取得
     * @param targetCoop
     * @param dto
     * @returns
     *
     * RefactorDescription:
     *  #3803 : getShareCatalogCode
     *  #3803 : createDataTypes
     */
    private async getDataTypaList (targetCoop: any, dto: ShareDto) {
        let documentList: {}[] = [];
        let eventList: {}[] = [];
        let thingList: {}[] = [];
        for (const coop of targetCoop) {
            const book2 = await EntityOperation.getContBookRecordFromUserId(coop['userId']);
            if (!book2) {
                continue;
            }

            const bookDto = new BookDto();
            const bookService = new BookService();
            bookDto.setUserId(coop['userId']);
            bookDto.setIdentifier(dto.getIdentifier());
            bookDto.setUpdatedAt(dto.getUpdatedAt());
            bookDto.setWf(dto.getWf());
            bookDto.setApp(dto.getApp());
            // ドキュメントを取得
            if ((dto.getIdentifier() && dto.getIdentifier().length > 0) || (dto.getDocumentList() && dto.getDocumentList().length > 0)) {
                bookDto.setCode(dto.getDocumentList());
                const docResult = await bookService.getDocumentBook(bookDto);
                documentList = docResult;
            }
            // イベントを取得
            if ((dto.getIdentifier() && dto.getIdentifier().length > 0) || (dto.getEventList() && dto.getEventList().length > 0)) {
                bookDto.setCode(dto.getEventList());
                const eventResult = await bookService.getEventBook(bookDto);
                eventList = eventResult;
            }
            // モノを取得
            if ((dto.getIdentifier() && dto.getIdentifier().length > 0) || (dto.getThingList() && dto.getThingList().length > 0)) {
                bookDto.setCode(dto.getThingList());
                const thingResult = await bookService.getThingBook(bookDto);
                thingList = thingResult;
            }

            if (documentList.length === 0 && eventList.length === 0 && thingList.length === 0) {
                continue;
            }

            // 共有定義カタログコードとアクターカタログを取得
            const { shareCatalogCode, actorCatalog } = await this.getShareCatalogCode(dto, documentList, eventList, thingList);

            // リクエスト.dest.actorが設定されている場合、ブロックコードを取得
            const destActorCode = dto.getActorCode() ? Number(actorCatalog['catalogItem']['_code']['_value']) : null;
            const destActorVersion = dto.getActorCode() ? Number(actorCatalog['catalogItem']['_code']['_ver']) : null;
            const blockCode = dto.getActorCode() ? Number(actorCatalog['template']['main-block']['_value']) : null;
            const blockVersion = dto.getActorCode() ? Number(actorCatalog['template']['main-block']['_ver']) : null;

            // 取得したデータ種とカタログコード、バージョンを共有アクセスログ、共有アクセスログデータ種へ追加
            const accessLog = new ShareAccessLog();
            const share = 1;
            const temp = 2;
            accessLog.myConditionBookId = book2.id;
            accessLog.logIdentifier = dto.getLogIdentifier();
            accessLog.userName = dto.getOperator().getLoginId();
            accessLog.dataType = dto.getTempShareCode() ? temp : share;
            accessLog.shareCatalogCode = shareCatalogCode;
            accessLog.reqActorCatalogCode = destActorCode || dto.getOperator().getActorCode();
            accessLog.reqActorCatalogVersion = destActorVersion || dto.getOperator().getActorVersion();
            accessLog.reqBlockCatalogCode = blockCode || dto.getOperator().getBlockCode();
            accessLog.reqBlockCatalogVersion = blockVersion || dto.getOperator().getBlockVersion();
            accessLog.accessAt = new Date();
            accessLog.createdBy = dto.getOperator().getLoginId();
            accessLog.updatedBy = dto.getOperator().getLoginId();
            const dataTypes: ShareAccessLogDataType[] = this.createDataTypes(documentList, dto, eventList, thingList);
            accessLog.dataTypes = dataTypes;
            await EntityOperation.insertShareAccessLog(accessLog);
            break;
        }
        return { documentList, eventList, thingList };
    }

    /**
     * 共有定義カタログコードを取得
     * @param dto
     * @param documentList
     * @param eventList
     * @param thingList
     * @returns
     */
    private async getShareCatalogCode (dto: ShareDto, documentList: {}[], eventList: {}[], thingList: {}[]) {
        // ext_nameの取得
        const catalogService: CatalogService = new CatalogService();
        const catalogDto = new CatalogDto();
        catalogDto.setUrl(configure['catalogUrl']);
        catalogDto.setMessage(message);
        catalogDto.setOperator(dto.getOperator());
        const extName = await catalogService.getExtName(catalogDto);
        // リクエスト.dest.actor または ログイン情報からアクターコードを取得
        const actorCode = dto.getActorCode() ? dto.getActorCode() : dto.getOperator().getActorCode();
        // アクターカタログを取得し、末尾のapp/wfを取得
        catalogDto.setCode(actorCode);
        const actorCatalog = await catalogService.getCatalogInfo(catalogDto);
        let appWf = null;
        if (actorCatalog) {
            const actorNs: string = actorCatalog['catalogItem']['ns'];
            appWf = actorNs.substring(actorNs.lastIndexOf('/') + 1, actorNs.length);
        } else {
            throw new AppError(message.FAILED_CATALOG_GET, ResponseCode.BAD_REQUEST);
        }
        if (appWf === 'wf') {
            throw new AppError(message.IF_WF_HAS_BEEN_SPECIFIED, ResponseCode.BAD_REQUEST);
        }
        if (appWf !== 'app') {
            throw new AppError(message.ACTOR_CATALOG_INVALID, ResponseCode.BAD_REQUEST);
        }
        const shareCatalogNs = 'catalog/ext/' + extName + '/actor/' + appWf + '/actor_' + actorCode + '/share';
        applicationLogger.info('ns:' + shareCatalogNs);
        // 共有定義カタログを取得
        catalogDto.setNs(shareCatalogNs);
        const shareCatalogs = await catalogService.getNs(catalogDto);
        let shareCatalogCode = null;
        // 取得したデータ種のカタログコードが全て設定されている共有定義カタログコードを取得
        if (shareCatalogs && shareCatalogs.length > 0) {
            for (const shareCatalog of shareCatalogs) {
                applicationLogger.info('shareCatalog:' + JSON.stringify(shareCatalog));
                const flag = await this.checkAllowedDataShareCatalog(shareCatalog, documentList, eventList, thingList);
                if (flag) {
                    shareCatalogCode = Number(shareCatalog['catalogItem']['_code']['_value']);
                    break;
                }
            }
        }
        return { shareCatalogCode, actorCatalog };
    }

    /**
     * 共有アクセスログのデータ種を生成
     * @param documentList
     * @param dto
     * @param eventList
     * @param thingList
     * @returns
     */
    private createDataTypes (documentList: {}[], dto: ShareDto, eventList: {}[], thingList: {}[]) {
        const dataTypes: ShareAccessLogDataType[] = [];
        for (const document of documentList) {
            const dataType = new ShareAccessLogDataType();
            dataType.dataType = ShareAccessLogDataType.DATA_TYPE_DOCUMENT;
            dataType.dataTypeCatalogCode = document['code']['value']['_value'];
            dataType.dataTypeCatalogVersion = document['code']['value']['_ver'];
            dataType.createdBy = dto.getOperator().getLoginId();
            dataType.updatedBy = dto.getOperator().getLoginId();
            dataTypes.push(dataType);
        }
        for (const event of eventList) {
            const dataType = new ShareAccessLogDataType();
            dataType.dataType = ShareAccessLogDataType.DATA_TYPE_EVENT;
            dataType.dataTypeCatalogCode = event['code']['value']['_value'];
            dataType.dataTypeCatalogVersion = event['code']['value']['_ver'];
            dataType.createdBy = dto.getOperator().getLoginId();
            dataType.updatedBy = dto.getOperator().getLoginId();
            dataTypes.push(dataType);
        }
        for (const thing of thingList) {
            const dataType = new ShareAccessLogDataType();
            dataType.dataType = ShareAccessLogDataType.DATA_TYPE_THING;
            dataType.dataTypeCatalogCode = thing['code']['value']['_value'];
            dataType.dataTypeCatalogVersion = thing['code']['value']['_ver'];
            dataType.createdBy = dto.getOperator().getLoginId();
            dataType.updatedBy = dto.getOperator().getLoginId();
            dataTypes.push(dataType);
        }
        return dataTypes;
    }

    /**
     * リクエストされたデータ種配列は、定義上許可されているものかを確認する
     * @param sharingCodes 状態共有機能が定義されたカタログコード配列
     * @param operator
     * @param dto
     *
     * RefactorDescription:
     *  #3803 : getTargetSharesAndConditions
     *  #3803 : createDataShareReq
     */
    private async checkAllowedDataDefinitionAndCreateReq (sharingDefs: SharingDataDefinition[], operator: Operator, dto: PostShareReqDto) {
        const document = dto.document;
        const event = dto.event;
        const thing = dto.thing;
        // 対象の状態共有機能定義を取得
        const { targetShares, targetConditions } = await this.getTargetSharesAndConditions(sharingDefs, operator, dto);

        // データ共有定義から共有元のアクターを特定する
        const tempReqDto: PostShareReqDto = Object.assign(JSON.parse(JSON.stringify(dto)));
        tempReqDto.document = [];
        tempReqDto.event = [];
        tempReqDto.thing = [];
        const nonActorRequest: PostShareReqDto = Object.assign(JSON.parse(JSON.stringify(tempReqDto)));
        const requests: PostShareReqDto[] = [];
        for (const sharingObject of targetShares) {
            if (sharingObject.document && document) {
                this.createDataShareReq(sharingObject, nonActorRequest, requests, tempReqDto, document, 'document');
            }
            if (sharingObject.event && event) {
                this.createDataShareReq(sharingObject, nonActorRequest, requests, tempReqDto, event, 'event');
            }
            if ((sharingObject.thing || sharingObject.event) && thing) {
                this.createDataShareReq(sharingObject, nonActorRequest, requests, tempReqDto, thing, 'thing');
            }
        }

        if (targetConditions.length > 0) {
            const req: PostShareReqDto = Object.assign(JSON.parse(JSON.stringify(tempReqDto)));
            if (document) {
                for (const codeObject of document) {
                    if (!req.document.some(elem => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                        req.document.push(codeObject);
                    }
                }
            }
            if (event) {
                for (const codeObject of event) {
                    if (!req.event.some(elem => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                        req.event.push(codeObject);
                    }
                }
            }
            if (thing) {
                for (const codeObject of thing) {
                    if (!req.thing.some(elem => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                        req.thing.push(codeObject);
                    }
                }
            }
            req.actor = {
                _value: operator.getActorCode(),
                _ver: operator.getActorVersion()
            };
            requests.push(req);
        }

        if (nonActorRequest.document.length > 0 || nonActorRequest.event.length > 0 || nonActorRequest.thing.length > 0) {
            requests.push(nonActorRequest);
        }
        return { requests, targetShares, targetConditions };
    }

    /**
     * 状態共有機能定義取得
     * @param sharingDefs
     * @param operator
     * @param dto
     * @returns
     */
    private async getTargetSharesAndConditions (sharingDefs: SharingDataDefinition[], operator: Operator, dto: PostShareReqDto) {
        const document = dto.document;
        const event = dto.event;
        const thing = dto.thing;
        const targetShares: ShareCode[] = [];
        const targetConditions: Condition[] = [];
        const catalogService: CatalogService = new CatalogService();
        const catalogDto = new CatalogDto();
        catalogDto.setUrl(configure['catalogUrl']);
        catalogDto.setMessage(message);
        catalogDto.setOperator(operator);
        for (const def of sharingDefs) {
            applicationLogger.info('sharingDef: ' + JSON.stringify(def));
            // shareのカタログコードからカタログを取得 (論理削除済データ取得フラグ=true)
            catalogDto.setCode(def.share[0].code._value);
            catalogDto.setVersion(def.share[0].code._ver);
            const result = await catalogService.getCatalogInfo(catalogDto, true);
            let sharingCatalog;
            try {
                sharingCatalog = await transformAndValidate(SharingCatalog, result) as SharingCatalog;
            } catch (err) {
                const str = sprintf('カタログサービスにて取得したカタログを状態共有機能への変換に失敗しました(コード値: %s)', def.share[0].code._value);
                throw new AppError(str, 500, err);
            }
            // リクエストのdocument, event, thingをすべて含むデータ共有定義を特定
            applicationLogger.info('sharingCatalog: ' + JSON.stringify(sharingCatalog));
            applicationLogger.info('request: ' + JSON.stringify(dto));
            if (!dto.dest) {
                for (const sharingObject of sharingCatalog.template.share) {
                    const documentChecksFlag = this.checkAllowedData(document, sharingObject.document);
                    const eventChecksFlag = this.checkAllowedData(event, sharingObject.event);
                    let thingChecksFlag = this.checkAllowedData(thing, sharingObject.thing);
                    if (!thingChecksFlag && sharingObject.event) {
                        for (const eveThing of sharingObject.event) {
                            if (eveThing.thing) {
                                thingChecksFlag = this.checkAllowedData(thing, eveThing.thing);
                            }
                            if (thingChecksFlag) {
                                break;
                            }
                        }
                    }
                    if (documentChecksFlag && eventChecksFlag && thingChecksFlag) {
                        targetShares.push(sharingObject);
                    }
                }
            }
        }
        // リクエストのdocument, event, thingをすべて含むデータ共有定義がない場合エラー
        if ((!targetShares || targetShares.length < 1) && (!targetConditions || targetConditions.length < 1)) {
            throw new AppError('いずれの状態共有機能定義においても、リクエストされたデータ種を共有できるように許可されていません', 400);
        }
        return { targetShares, targetConditions };
    }

    /**
     * データ共有定義に基づくデータ共有リクエストの作成
     * @param sharingObject
     * @param nonActorRequest
     * @param requests
     * @param tempReqDto
     * @param dataTypes
     * @param type
     */
    private createDataShareReq (sharingObject: ShareCode, nonActorRequest: PostShareReqDto, requests: PostShareReqDto[], tempReqDto: PostShareReqDto, dataTypes: CodeVersionObject[], type: string) {
        for (const codeObject of dataTypes) {
            // データ共有定義からカタログコード、バージョンが一致する定義を取り出す
            const dataTypeDefs = sharingObject[type] ? sharingObject[type].filter((elem: { code: { _value: number; _ver: number; }; }) => elem.code._value === codeObject._value && elem.code._ver === codeObject._ver) : [];
            if (type === 'thing') {
                if (sharingObject.event && sharingObject.event.length > 0) {
                    for (const eveDefs of sharingObject.event) {
                        if (eveDefs.thing && eveDefs.thing.length > 0) {
                            dataTypeDefs.push(...(eveDefs.thing.filter(elem => elem.code._value === codeObject._value && elem.code._ver === codeObject._ver)));
                        }
                    }
                }
            }
            // 定義に設定された共有元単位にリクエストを作成する
            for (const def of dataTypeDefs) {
                if (!def.sourceActor || def.sourceActor.length < 1) {
                    // 共有元が指定されていない場合
                    if (!nonActorRequest[type].some((elem: { _value: number; _ver: number; }) => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                        nonActorRequest[type].push(codeObject);
                    }
                } else {
                    // 共有元が指定されている場合
                    for (const actor of def.sourceActor) {
                        if (requests.length < 1 || !requests.some(elem => elem.actor._value === actor._value)) {
                            // requestリストに同じ共有元が設定されていない場合は新しくrequestオブジェクトを生成してdocumentにコードをPush
                            const req: PostShareReqDto = Object.assign(JSON.parse(JSON.stringify(tempReqDto)));
                            req[type].push(codeObject);
                            req.actor = actor;
                            requests.push(req);
                        } else {
                            for (const request of requests) {
                                if (request.actor._value === actor._value) {
                                    // requestリストに同じ共有元が設定されている場合はrequestオブジェクトのdocumentに同じコードが設定されていない場合、コードをPush
                                    if (!request[type].some((elem: { _value: number; _ver: number; }) => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                                        request[type].push(codeObject);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 共有定義カタログ判定
     */
    private async checkAllowedDataShareCatalog (shareCatalog: {}, documentList: {}[], eventList: {}[], thingList: {}[]) {
        let ret = false;
        // データ種を判定用に変換する
        const documentCodes = await this.createCheckCodes(documentList);
        const eventCodes = await this.createCheckCodes(eventList);
        const thingCodes = await this.createCheckCodes(thingList);
        if (shareCatalog['template']['share'] && shareCatalog['template']['share'].length > 0) {
            for (const share of shareCatalog['template']['share']) {
                const shareDocumentCodes = [];
                const shareEventCodes = [];
                const shareThingCodes = [];
                // 共有定義のデータ種を判定用に変換する
                if (share['document'] && share['document'].length > 0) {
                    for (const document of share['document']) {
                        shareDocumentCodes.push(document['code']);
                    }
                }
                if (share['event'] && share['event'].length > 0) {
                    for (const event of share['event']) {
                        shareEventCodes.push(event['code']);
                    }
                }
                if (share['thing'] && share['thing'].length > 0) {
                    for (const thing of share['thing']) {
                        shareThingCodes.push(thing['code']);
                    }
                }
                const docFlag = this.checkAllowedDataByCodeVersionObjects(documentCodes, shareDocumentCodes);
                const eventFlag = this.checkAllowedDataByCodeVersionObjects(eventCodes, shareEventCodes);
                const thingFlag = this.checkAllowedDataByCodeVersionObjects(thingCodes, shareThingCodes);
                // 全てのデータ種のコードが設定されている共有定義が存在する場合trueを返す
                if (docFlag && eventFlag && thingFlag) {
                    ret = true;
                    break;
                }
            }
        }
        return ret;
    }

    /**
     * 許可判定 コードオブジェクト変換
     */
    private async createCheckCodes (dataList: {}[]) {
        const codeList = [];
        for (const data of dataList) {
            const code = data['code']['value'];
            codeList.push(code);
        }
        return codeList;
    }

    /**
     * 許可判定
     * @param reqCodes
     * @param checkCodes
     * @returns 判定結果
     */
    private checkAllowedData (reqCodes: CodeVersionObject[], checkCodes: DataType[]) {
        if (!reqCodes || reqCodes.length <= 0) {
            return true;
        } else if (!checkCodes || checkCodes.length <= 0) {
            return false;
        }
        for (const codeObject of reqCodes) {
            if (!checkCodes.some(elem => elem.code._value === codeObject._value && elem.code._ver === codeObject._ver)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 許可判定
     * @param reqCodes
     * @param checkCodes
     * @returns 判定結果
     */
    private checkAllowedDataByCodeVersionObjects (reqCodes: CodeVersionObject[], checkCodes: CodeVersionObject[]) {
        if (!reqCodes || reqCodes.length <= 0) {
            return true;
        } else if (!checkCodes || checkCodes.length <= 0) {
            return false;
        }
        for (const codeObject of reqCodes) {
            if (!checkCodes.some(elem => elem._value === codeObject._value && elem._ver === codeObject._ver)) {
                return false;
            }
        }
        return true;
    }
}
