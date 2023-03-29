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
import UserServiceDto from './dto/UserServiceDto';
import { Service } from 'typedi';
import BookManageDto from './dto/BookManageDto';
import BookManageService from './BookManageService';
import MyConditionBook from '../repositories/postgres/MyConditionBook';
import EntityOperation from '../repositories/EntityOperation';
import NotificationDto from './dto/NotificationDto';
import NotificationService from './NotificationService';
import BookUserCreateResponseDto from '../resources/dto/PostUserCreateResDto';
import BookManageSettingStoreDomain from '../domains/BookManageSettingStoreDomain';
import PostUserDeleteResDto from '../resources/dto/PostUserDeleteResDto';
import PostUserCreateBatchResDto from '../resources/dto/PostUserCreateBatchResDto';
import { connectDatabase } from '../common/Connection';
import { sprintf } from 'sprintf-js';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import { transformFromDateTimeToString } from '../common/Transform';
import Config from '../common/Config';
import OperatorAddDto from './dto/OperatorAddDto';
import OperatorService from './OperatorService';
import urljoin = require('url-join');
import CatalogService from './CatalogService';
import CatalogDto from './dto/CatalogDto';
import OperatorReqDto from '../resources/dto/OperatorReqDto';
/* eslint-enable */
const config = Config.ReadConfig('./config/config.json');

@Service()
export default class UserService {
    readonly REQUEST_STATUS = 0;
    readonly COOPERATING_STATUS = 1;
    readonly IND_OPERATOR = 0;

    /**
     * 利用者作成
     * @param bookUserCreateDto
     *
     * RefactorDescription:
     *  #3803 : checkAppWfRegionCode
     *  #3803 : registerCompleteNotification
     */
    public async createUser (bookUserCreateDto: UserServiceDto): Promise<BookUserCreateResponseDto> {
        const operator = bookUserCreateDto.getOperator();
        const message = bookUserCreateDto.getMessage();
        const notificationCategoryCode = 156;
        const notificationCategoryVersion = 1;

        // My-Condition-Book管理サービス.利用者ID連携APIを呼び出す
        // レスポンスが200 OK以外の場合エラーレスポンスを返却し終了
        const bookManageDto: BookManageDto = new BookManageDto();
        const cooperateUrl: string = urljoin(bookUserCreateDto.getBookManageUrl(), '/cooperate');
        bookManageDto.setUrl(cooperateUrl);
        bookManageDto.setIdentifyCode(bookUserCreateDto.getIdentifyCode());
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(message);
        const bookManageService: BookManageService = new BookManageService();
        const bookManageResult = await bookManageService.getCooperateInfo(bookManageDto);

        // app, wf, regionのどれか一つが_codeオブジェクトであることを確認する。
        // すべてnull, または2つ以上_codeオブジェクトの場合エラーレスポンスを返却し終了
        const { regionCode, regionVersion, appCode, appVersion, wfCode, wfVersion }: { regionCode: number; regionVersion: number; appCode: number; appVersion: number; wfCode: number; wfVersion: number; } = await this.checkAppWfRegionCode(bookManageResult, message);

        // ログイン情報よりオペレータータイプが3(運営メンバー)であるか確認する。
        // 3(運営メンバー)でなければエラーレスポンスを返却し終了
        if (operator.getType() !== 3) {
            throw new AppError(message.REQUEST_UNAUTORIZED, ResponseCode.BAD_REQUEST);
        }

        // 利用者管理情報のひな形を確認、カタログサービスに問い合わせる
        if (bookUserCreateDto.userInfo) {
            const dto = new CatalogDto(); dto.setOperator(operator); dto.setCode(bookUserCreateDto.userInfo._code._value); dto.setVersion(bookUserCreateDto.userInfo._code._ver); dto.setMessage(message); dto.setUrl(config.catalogUrl);
            await new CatalogService().getCatalogInfo(dto);
        }

        // ログイン不可の個人を登録する
        const operatorAddDto: OperatorAddDto = new OperatorAddDto();
        operatorAddDto.setUrl(bookUserCreateDto.getOperatorUrl());
        operatorAddDto.setOperator(operator);
        operatorAddDto.setUserId(bookManageResult.userId);
        operatorAddDto.setRegionCatalogCode(bookManageResult.region ? bookManageResult.region._value : null);
        operatorAddDto.setAppCatalogCode(bookManageResult.app ? bookManageResult.app._value : null);
        operatorAddDto.setWfCatalogCode(null);
        await OperatorService.addProhibitedIndividual(operatorAddDto);

        // 利用者管理情報として、オペレーターサービスに連携する
        await OperatorService.registerUserInformation(bookManageResult.userId, bookUserCreateDto.userInfo, operator.getEncodeData());

        // My-Condition-Bookテーブルにレコードを登録する
        const nowTime: Date = new Date();
        const nowDateTime: Date = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds());
        const myConditionBook = new MyConditionBook();
        myConditionBook.userId = bookManageResult.userId;
        myConditionBook.actorCatalogCode = parseInt(bookManageResult.actor._value);
        myConditionBook.actorCatalogVersion = parseInt(bookManageResult.actor._ver);
        myConditionBook.regionCatalogCode = regionCode;
        myConditionBook.regionCatalogVersion = regionVersion;
        myConditionBook.appCatalogCode = appCode;
        myConditionBook.appCatalogVersion = appVersion;
        myConditionBook.wfCatalogCode = wfCode;
        myConditionBook.wfCatalogVersion = wfVersion;
        myConditionBook.openStartAt = nowDateTime;
        myConditionBook.identifyCode = bookUserCreateDto.getIdentifyCode();
        myConditionBook.createdBy = operator.getLoginId();
        myConditionBook.updatedBy = operator.getLoginId();

        // 完了通知を登録
        await this.registerCompleteNotification(myConditionBook, bookUserCreateDto, message, bookManageResult, notificationCategoryCode, notificationCategoryVersion, appCode, wfCode, operator);

        // レスポンスを生成
        const response: BookUserCreateResponseDto = new BookUserCreateResponseDto();
        response.actorCode = parseInt(bookManageResult.actor._value);
        response.actorVersion = parseInt(bookManageResult.actor._ver);
        response.regionCode = regionCode;
        response.regionVersion = regionVersion;
        response.appCode = appCode;
        response.appVersion = appVersion;
        response.wfCode = wfCode;
        response.wfVersion = wfVersion;
        response.userId = bookManageResult.userId;
        response.openStartAt = nowTime;
        response.attributes = bookUserCreateDto.getAttributes();

        // レスポンスを返す
        return response;
    }

    /**
     * 完了通知を登録
     * @param myConditionBook
     * @param bookUserCreateDto
     * @param message
     * @param bookManageResult
     * @param notificationCategoryCode
     * @param notificationCategoryVersion
     * @param appCode
     * @param wfCode
     * @param operator
     */
    private async registerCompleteNotification (myConditionBook: MyConditionBook, bookUserCreateDto: UserServiceDto, message: any, bookManageResult: any, notificationCategoryCode: number, notificationCategoryVersion: number, appCode: number, wfCode: number, operator: OperatorReqDto) {
        const connection = await connectDatabase();
        await connection.transaction(async (trans) => {
            await EntityOperation.insertCondBookRecord(trans, myConditionBook);

            // 通知サービス.登録APIを呼出し、連携完了通知を登録する
            const notificationDto: NotificationDto = new NotificationDto();
            notificationDto.setUrl(bookUserCreateDto.getNotificationUrl());
            notificationDto.setType(0);
            notificationDto.setTitle(message.BOOK_OPERATE_USER_ADD_TITLE);
            notificationDto.setContent(sprintf(message.BOOK_OPERATE_USER_ADD_CONTENT, bookManageResult.userId));
            notificationDto.setAttribute(bookUserCreateDto.getAttributes());
            notificationDto.setCategoryCode(notificationCategoryCode);
            notificationDto.setCategoryVersion(notificationCategoryVersion);
            notificationDto.setFromApplicationCode(appCode);
            notificationDto.setFromWorkflowCode(wfCode);
            notificationDto.setDestinationBlockCode(operator.getBlockCode());
            notificationDto.setDestinationOperatorType(operator.getType());
            notificationDto.setDestinationIsSendAll(true);
            notificationDto.setDestinationOperatorId(null);
            notificationDto.setDestinationUserId(null);
            notificationDto.setSessionId(operator.getSessionId());
            notificationDto.setOperator(operator);
            notificationDto.setMessage(message);
            const notification: NotificationService = new NotificationService();
            await notification.postNotificationAdd(notificationDto);
        });
    }

    /**
     * APP/WF/REGIONのコードを確認
     * @param bookManageResult
     * @param message
     * @returns
     */
    private async checkAppWfRegionCode (bookManageResult: any, message: any) {
        let appWfRegionCnt = 0;
        let appCode: number;
        let appVersion: number;
        let wfCode: number;
        let wfVersion: number;
        let regionCode: number;
        let regionVersion: number;
        if (bookManageResult.app && bookManageResult.app._value && bookManageResult.app._ver) {
            appWfRegionCnt += 1;
            appCode = bookManageResult.app._value;
            appVersion = bookManageResult.app._ver;
        }
        if (bookManageResult.wf && bookManageResult.wf._value && bookManageResult.wf._ver) {
            throw new AppError(message.UNSUPPORTED_ACTOR, 400);
        }
        if (bookManageResult.region && bookManageResult.region._value && bookManageResult.region._ver) {
            appWfRegionCnt += 1;
            regionCode = bookManageResult.region._value;
            regionVersion = bookManageResult.region._ver;
        }
        if (appWfRegionCnt === 0) {
            throw new AppError(message.EMPTY_APP, 400);
        }
        if (appWfRegionCnt > 1) {
            throw new AppError(message.SET_APP_REGION, 400);
        }
        return { regionCode, regionVersion, appCode, appVersion, wfCode, wfVersion };
    }

    /**
     * 利用者削除
     * @param bookUserCreateDto
     */
    public async deleteUser (bookUserCreateDto: UserServiceDto): Promise<PostUserDeleteResDto> {
        // オペレータ情報を取得
        const operator = bookUserCreateDto.getOperator();

        // メッセージを取得
        const message = bookUserCreateDto.getMessage();

        // 物理削除フラグを取得
        const isPhysicalDelete = bookUserCreateDto.getPhysicalDelete();

        // My-Condition-Book管理サービス.利用者ID連携解除APIを呼び出す
        // レスポンスが200 OK以外の場合エラーレスポンスを返却し終了
        const bookManageDto = new BookManageDto();
        bookManageDto.setUrl(urljoin(bookUserCreateDto.getBookManageUrl(), '/cooperate/release'));
        bookManageDto.setIdentifyCode(bookUserCreateDto.getIdentifyCode());
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(message);
        const bookManageService: BookManageService = new BookManageService();
        const bookManageResult = await bookManageService.cancelCooperateInfo(bookManageDto);

        const connection = await connectDatabase();
        await connection.transaction(async trans => {
            // My-Condition-Bookテーブルからレコードを削除する
            const myConditionBook = new MyConditionBook();
            myConditionBook.actorCatalogCode = bookManageResult['actor'] ? bookManageResult['actor']['_value'] : null;
            myConditionBook.regionCatalogCode = bookManageResult['region'] ? bookManageResult['region']['_value'] : null;
            myConditionBook.wfCatalogCode = null;
            myConditionBook.appCatalogCode = bookManageResult['app'] ? bookManageResult['app']['_value'] : null;
            myConditionBook.userId = bookManageResult['userId'];
            myConditionBook.updatedBy = operator.getLoginId();

            await EntityOperation.deleteCondBookRecord(trans, myConditionBook, isPhysicalDelete);

            // 通知サービス.登録APIを呼出し、連携解除通知を登録する
            const notificationCategoryCode = 158;
            const notificationCategoryVersion = 1;
            const notificationDto: NotificationDto = new NotificationDto();
            notificationDto.setUrl(bookUserCreateDto.getNotificationUrl());
            notificationDto.setType(0);
            notificationDto.setTitle(message.BOOK_OPERATE_USER_CENCEL_TITLE);
            notificationDto.setContent(sprintf(message.BOOK_OPERATE_USER_CENCEL_CONTENT, bookManageResult['userId']));
            notificationDto.setAttribute(null);
            notificationDto.setCategoryCode(notificationCategoryCode);
            notificationDto.setCategoryVersion(notificationCategoryVersion);
            notificationDto.setFromApplicationCode(bookManageResult['app'] ? Number(bookManageResult['app']['_value']) : null);
            notificationDto.setFromWorkflowCode(null);
            notificationDto.setDestinationBlockCode(operator.getBlockCode());
            notificationDto.setDestinationOperatorType(operator.getType());
            notificationDto.setDestinationIsSendAll(true);
            notificationDto.setDestinationOperatorId(null);
            notificationDto.setDestinationUserId(null);
            notificationDto.setSessionId(operator.getSessionId());
            notificationDto.setOperator(operator);
            notificationDto.setMessage(message);
            const notification: NotificationService = new NotificationService();
            await notification.postNotificationAdd(notificationDto);
        });

        // レスポンスを生成
        const response: PostUserDeleteResDto = new PostUserDeleteResDto();
        response.userId = bookManageResult['userId'];

        // レスポンスを返す
        return response;
    }

    /**
     * 利用者一覧検索
     * @param searchUserListDto
     *
     * RefactorDescription:
     * #3803 : getDataStoreInfo
     * #3803 : createResSearchUserList
     */
    public async searchUserList (searchUserListDto: UserServiceDto): Promise<{}[]> {
        const message = searchUserListDto.getMessage();
        const userIdList = searchUserListDto.getUserIdList();
        const operator = searchUserListDto.getOperator();
        let establishAtStartDate = null;
        if (searchUserListDto.getEstablishAtStart()) {
            const establishAtStart = new Date(searchUserListDto.getEstablishAtStart());
            establishAtStartDate = new Date(establishAtStart.getUTCFullYear(), establishAtStart.getUTCMonth(), establishAtStart.getUTCDate(), establishAtStart.getUTCHours(), establishAtStart.getUTCMinutes(), establishAtStart.getUTCSeconds());
        }
        let establishAtEndDate = null;
        if (searchUserListDto.getEstablishAtEnd()) {
            const establishAtEnd = new Date(searchUserListDto.getEstablishAtEnd());
            establishAtEndDate = new Date(establishAtEnd.getUTCFullYear(), establishAtEnd.getUTCMonth(), establishAtEnd.getUTCDate(), establishAtEnd.getUTCHours(), establishAtEnd.getUTCMinutes(), establishAtEnd.getUTCSeconds());
        }
        const myConditionBookDataList: MyConditionBook[] = await EntityOperation.getRecordFromUserIdOpenAt(userIdList, establishAtStartDate, establishAtEndDate);

        // My-Condition-Book管理サービス.データ蓄積定義取得APIを呼び出す
        // レスポンスが200 OK以外の場合エラーレスポンスを返却し終了
        const bookManageResultList: Array<BookManageSettingStoreDomain> = await this.getDataStoreInfo(searchUserListDto, myConditionBookDataList, operator, message);

        if (searchUserListDto.getIncludeRequest()) {
            // 通知サービスから通知を取得し、連携中のデータを取得する
            const notificationDto: NotificationDto = new NotificationDto();
            notificationDto.setUrl(searchUserListDto.getNotificationUrl());
            notificationDto.setOperator(operator);
            notificationDto.setMessage(message);
            const notificationService: NotificationService = new NotificationService();
            const notifications = await notificationService.getNotification(notificationDto);
            for (const notification of notifications) {
                if (notification['attribute'] && notification['attribute']['identifyCode']) {
                    let isExist = false;
                    const identifyCode: string = notification['attribute']['identifyCode'];
                    for (const bookManageResult of bookManageResultList) {
                        if (bookManageResult.identifyCode === identifyCode) {
                            isExist = true;
                            break;
                        }
                    }
                    if (!isExist) {
                        const bookManageResult: BookManageSettingStoreDomain = new BookManageSettingStoreDomain();
                        bookManageResult.status = this.REQUEST_STATUS;
                        bookManageResult.identifyCode = identifyCode;
                        bookManageResultList.push(bookManageResult);
                    }
                }
            }
        }
        // 対象データが存在しない場合
        if (bookManageResultList.length === 0) {
            throw new AppError(message.TARGET_NO_DATA, ResponseCode.NOT_FOUND);
        }

        // レスポンスを生成
        const response: Array<{}> = await this.createResSearchUserList(bookManageResultList, operator);

        // レスポンスを返す
        return response;
    }

    /**
     * レスポンス生成
     * @param bookManageResultList
     * @param operator
     * @returns
     */
    private async createResSearchUserList (bookManageResultList: BookManageSettingStoreDomain[], operator: OperatorReqDto) {
        const response: Array<{}> = [];
        for (const bookManageResult of bookManageResultList) {
            let jsonData;
            if (bookManageResult.status === this.REQUEST_STATUS) {
                jsonData = {
                    status: bookManageResult.status,
                    identifyCode: bookManageResult.identifyCode
                };
            } else {
                const userInformation = await OperatorService.acquireUserInformation(
                    bookManageResult.userId,
                    operator.getEncodeData()
                );
                jsonData = {
                    status: bookManageResult.status,
                    app: bookManageResult.appCode ? {
                        _value: bookManageResult.appCode,
                        _ver: bookManageResult.appVersion
                    } : null,
                    wf: bookManageResult.wfCode ? {
                        _value: bookManageResult.wfCode,
                        _ver: bookManageResult.wfVersion
                    } : null,
                    userId: bookManageResult.userId,
                    establishAt: transformFromDateTimeToString(config['timezone'], bookManageResult.openStartAt),
                    attribute: bookManageResult.attribute ? bookManageResult.attribute : {},
                    store: {
                        document: bookManageResult.document,
                        event: bookManageResult.event,
                        thing: bookManageResult.thing
                    },
                    userInformation: userInformation
                };
            }
            response.push(jsonData);
        }
        return response;
    }

    /**
     * 蓄積定義取得
     */
    private async getDataStoreInfo (searchUserListDto: UserServiceDto, myConditionBookDataList: MyConditionBook[], operator: OperatorReqDto, message: any) {
        const bookManageDto: BookManageDto = new BookManageDto();
        const bookManageResultList: Array<BookManageSettingStoreDomain> = [];
        for (const myConditionBookData of myConditionBookDataList) {
            let urlParam: string = '';

            urlParam = 'app=' + myConditionBookData.appCatalogCode.toString();
            // operatorのアクターカタログを取得
            const catalogDto = new CatalogDto();
            catalogDto.setMessage(message);
            catalogDto.setUrl(config['catalogUrl']);
            catalogDto.setCode(operator.getActorCode());
            catalogDto.setOperator(operator);
            const catalogService = new CatalogService();
            const actorCatalog = await catalogService.getCatalogInfo(catalogDto);
            // アクターがregion-rootの場合、クエリパラムにactorCodeを追加
            const actorNs: string = actorCatalog['catalogItem']['ns'];
            if (actorNs.indexOf('region-root') >= 0) {
                urlParam = urlParam + '&actorCode=' + myConditionBookData.actorCatalogCode.toString();
            }
            let dataAccumuUrl: string;
            if ((searchUserListDto.getBookManageUrl() + '').indexOf('pxr-block-proxy') === -1) {
                dataAccumuUrl = urljoin(searchUserListDto.getBookManageUrl(), '/settings/store', myConditionBookData.userId, '?' + urlParam);
            } else {
                dataAccumuUrl = searchUserListDto.getBookManageUrl() + encodeURIComponent(urljoin('/settings/store', myConditionBookData.userId, '?' + urlParam));
            }
            bookManageDto.setUrl(dataAccumuUrl);
            bookManageDto.setOperator(operator);
            bookManageDto.setMessage(message);
            const bookManageService: BookManageService = new BookManageService();
            const ret = await bookManageService.getDataInfo(bookManageDto);
            if (ret === 'no_user') {
                continue;
            }
            const bookManageResult: BookManageSettingStoreDomain = new BookManageSettingStoreDomain();
            bookManageResult.setFromJson(ret);
            bookManageResult.userId = myConditionBookData.userId;
            bookManageResult.attribute = myConditionBookData.attributes;
            const openStartAt = new Date(Date.UTC(myConditionBookData.openStartAt.getFullYear(), myConditionBookData.openStartAt.getMonth(), myConditionBookData.openStartAt.getDate(), myConditionBookData.openStartAt.getHours(), myConditionBookData.openStartAt.getMinutes(), myConditionBookData.openStartAt.getSeconds()));
            bookManageResult.openStartAt = openStartAt;
            bookManageResult.actorCode = myConditionBookData.actorCatalogCode;
            bookManageResult.actorVersion = myConditionBookData.actorCatalogVersion;
            bookManageResult.wfCode = myConditionBookData.wfCatalogCode;
            bookManageResult.wfVersion = myConditionBookData.wfCatalogVersion;
            bookManageResult.appCode = myConditionBookData.appCatalogCode;
            bookManageResult.appVersion = myConditionBookData.appCatalogVersion;
            bookManageResult.status = this.COOPERATING_STATUS;
            bookManageResult.identifyCode = myConditionBookData.identifyCode;
            bookManageResultList.push(bookManageResult);
        }
        return bookManageResultList;
    }

    /**
     * 利用者作成(バッチ)
     * @param bookUserCreateDto
     */
    public async createUserBatch (bookUserCreateDto: UserServiceDto): Promise<PostUserCreateBatchResDto> {
        const operator = bookUserCreateDto.getOperator();
        const message = bookUserCreateDto.getMessage();

        // My-Condition-Book管理サービス.利用者ID連携APIを呼び出す
        // レスポンスが200 OK以外の場合エラーレスポンスを返却し終了
        const bookManageDto: BookManageDto = new BookManageDto();
        const bookSearchUrl: string = urljoin(bookUserCreateDto.getBookManageUrl(), '/search');
        bookManageDto.setUrl(bookSearchUrl);
        bookManageDto.setOperator(operator);
        bookManageDto.setMessage(message);
        const bookManageService: BookManageService = new BookManageService();
        const bookManageResult = await bookManageService.getCoopList(bookManageDto);

        if (bookManageResult && Array.isArray(bookManageResult)) {
            const connection = await connectDatabase();
            await connection.transaction(async trans => {
                // 作成されてない利用者IDを検索
                const myConditionBooks: MyConditionBook[] = await EntityOperation.getMyConditionBooksIncludeDeleted();

                for (const book of bookManageResult) {
                    if (book['cooperation'] && Array.isArray(book['cooperation'])) {
                        for (const coop of book['cooperation']) {
                            if (Number(coop['actor']['_value']) === operator.getActorCode()) {
                                const appCatalogCode = coop['app'] ? Number(coop['app']['_value']) : null;
                                const appCatalogVersion = coop['app'] ? Number(coop['app']['_ver']) : null;
                                const wfCatalogCode :number = null;
                                const wfCatalogVersion :number = null;
                                const userId = coop['userId'];
                                let isExist = false;
                                for (const myConditionBook of myConditionBooks) {
                                    if (
                                        (
                                            (appCatalogCode === Number(myConditionBook.appCatalogCode)) ||
                                            (wfCatalogCode === Number(myConditionBook.wfCatalogCode))
                                        ) && userId === myConditionBook.userId
                                    ) {
                                        isExist = true;
                                        break;
                                    }
                                }
                                if (!isExist && userId) {
                                    // ログイン不可の個人を登録する
                                    const operatorAddDto: OperatorAddDto = new OperatorAddDto();
                                    operatorAddDto.setUrl(bookUserCreateDto.getOperatorUrl());
                                    operatorAddDto.setOperator(operator);
                                    operatorAddDto.setMessage(message);
                                    operatorAddDto.setUserId(userId);
                                    operatorAddDto.setAppCatalogCode(appCatalogCode);
                                    operatorAddDto.setWfCatalogCode(wfCatalogCode);
                                    await OperatorService.addProhibitedIndividual(operatorAddDto);

                                    // My-Condition-Bookテーブルにレコードを登録する
                                    const nowTime: Date = new Date();
                                    const nowDateTime: Date = new Date(nowTime.getUTCFullYear(), nowTime.getUTCMonth(), nowTime.getUTCDate(), nowTime.getUTCHours(), nowTime.getUTCMinutes(), nowTime.getUTCSeconds());
                                    const myConditionBook = new MyConditionBook();
                                    myConditionBook.userId = userId;
                                    myConditionBook.actorCatalogCode = Number(coop['actor']['_value']);
                                    myConditionBook.actorCatalogVersion = Number(coop['actor']['_ver']);
                                    myConditionBook.appCatalogCode = appCatalogCode;
                                    myConditionBook.appCatalogVersion = appCatalogVersion;
                                    myConditionBook.wfCatalogCode = wfCatalogCode;
                                    myConditionBook.wfCatalogVersion = wfCatalogVersion;
                                    myConditionBook.openStartAt = nowDateTime;
                                    myConditionBook.createdBy = operator.getLoginId();
                                    myConditionBook.updatedBy = operator.getLoginId();
                                    await EntityOperation.insertCondBookRecord(trans, myConditionBook);
                                }
                            }
                        }
                    }
                }
            });
        }

        // レスポンスを返す
        const response: PostUserCreateBatchResDto = new PostUserCreateBatchResDto();
        response.result = 'success';
        return response;
    }
}
