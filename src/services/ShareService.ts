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
import OperatorService from './OperatorService';
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

        // Proxyサービス経由でデータ共有を呼出してデータを取得
        const results = [];
        const result = await BookOperateService.doLinkingGetShareSearch(operator.getBlockCode(), dto, operator, accessToken);
        if (Array.isArray(result)) {
            results.push(...result);
        } else {
            results.push(result);
        }

        // results の document,event,thing が全て空のものを除外する
        const ret = [];
        for (const result of results) {
            if ((result.document && result.document.length > 0) ||
            (result.event && result.event.length > 0) ||
            (result.thing && result.thing.length > 0)) {
                ret.push(result);
            }
        }

        // レスポンスを生成
        const response: PostShareResDto = new PostShareResDto();
        response.setFromJson(ret);
        // レスポンスを返す
        return response;
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
        const operator = dto.getOperator();
        // userIdを取得
        let pxrId;
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
            // サービス（アプリケーション/ワークフロー）のカタログコードをオペレーター情報から取得
            const { appCatalogCode } = await OperatorService.getAppWfCatalogCodeByOperator(operator);
            const actor = operator.getActorCode();
            const app = appCatalogCode;
            pxrId = await this.searchPxrId(dto.getUserId(), actor, app, null, operator, bookManageService);
        }
        const targetCoop = await this.getCoop(pxrId, operator, bookManageService);

        // ドキュメント、イベント、モノを取得
        const { resultDocumentList, resultEventList, resultThingList } = await this.getDataTypaList(targetCoop, dto);

        // レスポンスを生成
        const response: PostShareSearchResDto = new PostShareSearchResDto();
        response.documentList = resultDocumentList;
        response.eventList = resultEventList;
        response.thingList = resultThingList;

        // レスポンスを返す
        return response;
    }

    private async getCoop (pxrId: string, operator: Operator, bookManageService: BookManageService) {
        const bookSearch: BookManageDto = new BookManageDto();
        let bookSearchUrl;
        let targetCoop;
        const baseUrl = configure['bookManageUrl'];
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            bookSearchUrl = urljoin(baseUrl, '/search');
        } else {
            bookSearchUrl = baseUrl + encodeURIComponent('/search');
        }
        bookSearch.setUrl(bookSearchUrl);
        bookSearch.setOperator(operator);
        bookSearch.setMessage(message);
        const book = await bookManageService.getCoopList(bookSearch, pxrId);
        if (book && Array.isArray(book)) {
            targetCoop = book[0]['cooperation'];
        } else {
            throw new AppError('bookが存在しません', ResponseCode.INTERNAL_SERVER_ERROR);
        }
        return targetCoop;
    }

    private async searchPxrId (userId: string, actorCode: number, app: number, wf: number, operator: Operator, bookManageService: BookManageService) {
        const bookSearchUser: BookManageDto = new BookManageDto();
        bookSearchUser.setUserId(userId);
        let url;
        const baseUrl = configure['bookManageUrl'];
        if ((baseUrl + '').indexOf('pxr-block-proxy') === -1) {
            url = urljoin(baseUrl, '/search/user');
        } else {
            url = baseUrl + encodeURIComponent('/search/user');
        }
        bookSearchUser.setUrl(url);
        bookSearchUser.setOperator(operator);
        bookSearchUser.setMessage(message);
        bookSearchUser.setActor(actorCode);
        bookSearchUser.setApplication(app);
        bookSearchUser.setWorkflow(wf);
        const searchUser = await bookManageService.searchUser(bookSearchUser);
        const pxrId = searchUser['pxrId'];
        return pxrId;
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
        const resultDocumentList: {}[] = [];
        const resultEventList: {}[] = [];
        const resultThingList: {}[] = [];
        for (const coop of targetCoop) {
            let documentList: {}[] = [];
            let eventList: {}[] = [];
            let thingList: {}[] = [];
            const app: number = coop['app'] && coop['app']['_value'] ? coop['app']['_value'] : null;
            const wf: number = null;
            // userId がない または APP以外の連携情報はスキップ
            if (!coop['userId'] || !app) {
                continue;
            }
            const book2 = await EntityOperation.getContBookRecordFromUserId(coop['userId'], app, wf);
            // Bookが存在しない場合はスキップする
            if (!book2) {
                continue;
            }

            const bookDto = new BookDto();
            const bookService = new BookService();
            bookDto.setUserId(coop['userId']);
            bookDto.setIdentifier(dto.getIdentifier());
            bookDto.setUpdatedAt(dto.getUpdatedAt());
            bookDto.setWf(null);
            bookDto.setApp(app ? { _value: app } : null);
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

            resultDocumentList.push(...documentList);
            resultEventList.push(...eventList);
            resultThingList.push(...thingList);
        }
        return { resultDocumentList, resultEventList, resultThingList };
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
