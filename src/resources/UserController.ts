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

// SDE-IMPL-REQUIRED 本ファイルをコピーして外部サービスに公開する REST API インタフェースを定義します。
/* eslint-disable */
import { Container } from 'typedi';
import { Request, Response } from 'express';
import {
    JsonController, Post, Body, Header, Res, Req, UseBefore, Delete, OnUndefined, QueryParam
} from 'routing-controllers';
import PostUserCreateReqDto from './dto/PostUserCreateReqDto';
import PostUserListReqDto from './dto/PostUserListReqDto';
import PostUserDeleteReqDto from './dto/PostUserDeleteReqDto';
/* eslint-enable */
import SessionCheckDto from '../services/dto/SessionCheckDto';
import SessionCheckService from '../services/SessionCheckService';
import UserServiceDto from '../services/dto/UserServiceDto';
import UserService from '../services/UserService';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import PostUserCreateRequestValidator from './validator/PostUserCreateRequestValidator';
import PostUserListRequestValidator from './validator/PostUserListRequestValidator';
import PostUserDeleteRequestValidator from './validator/PostUserDeleteRequestValidator';
import { transformAndValidate } from 'class-transformer-validator';
import { OperatorType } from '../common/Operator';
import Config from '../common/Config';

// SDE-IMPL-REQUIRED REST API のベースルートを指定します。("/")をベースルートにする場合は引数なしとしてください。
@JsonController('/book-operate')
export default class UserController {
    /**
     * 利用者作成
     * @param req
     * @param dto
     * @param res
     */
    @Post('/user')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostUserCreateRequestValidator)
    async postUserCreate (@Req() req: Request, @Body() dto: PostUserCreateReqDto, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');
        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        const ignoreOperators: number[] = [OperatorType.TYPE_IND, OperatorType.TYPE_WF];
        sessionCheckDto.setIgnoreOperatorTypeList(ignoreOperators);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // サービス層生成
        const serviceDto = new UserServiceDto();
        serviceDto.setBookManageUrl(configure['bookManageUrl']);
        serviceDto.setNotificationUrl(configure['notificationUrl']);
        serviceDto.setOperatorUrl(configure['operatorUrl']);
        serviceDto.setIdentifyCode(dto.identifyCode);
        serviceDto.setAttributes(dto.attributes);
        serviceDto.setOperator(operator);
        serviceDto.setMessage(message);
        serviceDto.userInfo = dto.userInformation;
        const userService = new UserService();
        const ret = await userService.createUser(serviceDto);

        // レスポンスを返却する
        const retDto = ret.getAsJson();
        return retDto;
    }

    /**
     * 利用者削除
     * @param req
     * @param dto
     * @param res
     */
    @Post('/user/delete')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostUserDeleteRequestValidator)
    async deleteUserDelete (@Req() req: Request, @QueryParam('physicalDelete') physicalDelete: boolean, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // パラメータを取得
        let dto = await transformAndValidate(PostUserDeleteReqDto, req.body);
        dto = <PostUserDeleteReqDto>dto;

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        const ignoreOperators: number[] = [OperatorType.TYPE_IND, OperatorType.TYPE_APP, OperatorType.TYPE_WF];
        sessionCheckDto.setIgnoreOperatorTypeList(ignoreOperators);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // サービス層生成
        const serviceDto = new UserServiceDto();
        serviceDto.setBookManageUrl(configure['bookManageUrl']);
        serviceDto.setNotificationUrl(configure['notificationUrl']);
        serviceDto.setIdentifyCode(dto.identifyCode);
        serviceDto.setPhysicalDelete(physicalDelete);
        serviceDto.setOperator(operator);
        serviceDto.setMessage(message);

        // 利用者削除を実行
        const userService = new UserService();
        const ret = await userService.deleteUser(serviceDto);

        // レスポンスを返却
        return ret.getAsJson();
    }

    /**
     * 利用者一覧検索
     * @param req
     * @param dto
     * @param res
     */
    @Post('/user/list')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostUserListRequestValidator)
    async postUserList (@Req() req: Request, @Body() dto: PostUserListReqDto, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');
        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        const ignoreOperators: number[] = [OperatorType.TYPE_IND];
        sessionCheckDto.setIgnoreOperatorTypeList(ignoreOperators);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // 利用者一覧検索データオブジェクトを生成
        const serviceDto = new UserServiceDto();
        if (dto.userId) {
            serviceDto.setUserIdList(dto.userId);
        }
        if (dto.establishAt) {
            if (dto.establishAt.start) {
                serviceDto.setEstablishAtStart(dto.establishAt.start);
            }
            if (dto.establishAt.end) {
                serviceDto.setEstablishAtEnd(dto.establishAt.end);
            }
        }
        if (dto.includeRequest) {
            serviceDto.setIncludeRequest(dto.includeRequest);
        }

        serviceDto.setBookManageUrl(configure['bookManageUrl']);
        serviceDto.setNotificationUrl(configure['notificationUrl']);
        serviceDto.setOperator(operator);
        serviceDto.setMessage(message);
        const userService = new UserService();
        const userList = await userService.searchUserList(serviceDto);

        return userList;
    }

    /**
     * 利用者作成(バッチ)
     * @param req
     * @param dto
     * @param res
     */
    @Post('/user/batch')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    async postUserCreateBatch (@Req() req: Request, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');
        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        const ignoreOperators: number[] = [OperatorType.TYPE_IND, OperatorType.TYPE_WF];
        sessionCheckDto.setIgnoreOperatorTypeList(ignoreOperators);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // サービス層生成
        const serviceDto = new UserServiceDto();
        serviceDto.setBookManageUrl(configure['bookManageUrl']);
        serviceDto.setNotificationUrl(configure['notificationUrl']);
        serviceDto.setOperatorUrl(configure['operatorUrl']);
        serviceDto.setOperator(operator);
        serviceDto.setMessage(message);
        return new UserService().createUserBatch(serviceDto);
    }
}
