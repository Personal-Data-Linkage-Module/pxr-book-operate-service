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
import { Request, Response } from 'express';
import {
    JsonController, Post, Put, Delete, Body, Param, Header, QueryParam, Res, Req, UseBefore
} from 'routing-controllers';
import PostDocumentByUserIdReqDto from './dto/PostDocumentByUserIdReqDto';
import PostDocumentByUserIdResDto from './dto/PostDocumentByUserIdResDto';
import PutDocumentByUserIdReqDto from './dto/PutDocumentByUserIdReqDto';
import PutDocumentByUserIdResDto from './dto/PutDocumentByUserIdResDto';
import DeleteDocumentByUserIdReqDto from './dto/DeleteDocumentByUserIdReqDto';
import DeleteDocumentByUserIdResDto from './dto/DeleteDocumentByUserIdResDto';
/* eslint-enable */
import PostDocumentAddRequestValidator from './validator/PostDocumentAddRequestValidator';
import PutDocumentRepRequestValidator from './validator/PutDocumentRepRequestValidator';
import DeleteDocumentDelRequestValidator from './validator/DeleteDocumentDelRequestValidator';
import DocumentServiceDto from '../services/dto/DocumentServiceDto';
import SessionCheckDto from '../services/dto/SessionCheckDto';
import SessionCheckService from '../services/SessionCheckService';
import DocumentService from '../services/DocumentService';
import EnableSimpleBackPressure from './backpressure/EnableSimpleBackPressure';
import { OperatorType } from '../common/Operator';
import Config from '../common/Config';

@JsonController('/book-operate')
export default class DocumentController {
    /**
     * ドキュメント蓄積
     */
    @Post('/document/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PostDocumentAddRequestValidator)
    async postdocumentByUserId (@Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: PostDocumentByUserIdReqDto, @Res() res: Response): Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // リクエストを取得
        dto.setUserId(parmUserId);
        dto.setFromJson(req.body);

        // ドキュメント蓄積データオブジェクトを生成
        const documentDto = new DocumentServiceDto();
        documentDto.setUserId(dto.getUserId());
        documentDto.setRequestObject(dto.getRequestObject());
        documentDto.setOperator(operator);
        documentDto.setCatalogUrl(configure['catalogUrl']);
        documentDto.setCTokenUrl(configure['ctokenUrl']);
        documentDto.setMessage(message);
        // サービス層のドキュメント蓄積を実行
        const documentService: DocumentService = new DocumentService();
        const ret:PostDocumentByUserIdResDto = await documentService.addDocument(documentDto);
        return ret.getAsJson();
    }

    /**
     * ソースIDによるドキュメント更新
     */
    @Put('/document/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutDocumentRepRequestValidator)
    async putdocumentByUserId (@QueryParam('documentSourceId') queryDocumentSourceId: string, @Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: PutDocumentByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setSourceId(queryDocumentSourceId);
        dto.setDocumentIdentifer(null);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:PutDocumentByUserIdResDto = await this.updateDocumentProc(reqParm);
        // applicationLogger.debug(ret.getAsJson());
        return ret.getAsJson();
    }

    /**
     * ドキュメント更新
     */
    @Put('/document/:userId/:documentId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(PutDocumentRepRequestValidator)
    async putdocumentByUserIdBydocumentId (@Param('userId') parmUserId: string, @Param('documentId') parmDocumentId: string, @Req() req: Request, @Body() dto: PutDocumentByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setSourceId(null);
        dto.setDocumentIdentifer(parmDocumentId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:PutDocumentByUserIdResDto = await this.updateDocumentProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * ドキュメント更新処理
     */
    private async updateDocumentProc (reqParm: any) : Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(reqParm.req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // ドキュメント更新データオブジェクトを生成
        const documentDto = new DocumentServiceDto();
        documentDto.setUserId(reqParm.dto.getUserId());
        documentDto.setSourceId(reqParm.dto.getSourceId());
        documentDto.setDocumentIdentifer(reqParm.dto.getDocumentIdentifer());
        documentDto.setRequestObject(reqParm.dto.getRequestObject());
        documentDto.setOperator(operator);
        documentDto.setCatalogUrl(configure['catalogUrl']);
        documentDto.setCTokenUrl(configure['ctokenUrl']);
        documentDto.setMessage(message);
        // サービス層のドキュメント蓄積を実行
        const documentService: DocumentService = new DocumentService();
        const ret:PutDocumentByUserIdResDto = await documentService.updateDocument(documentDto);
        return ret;
    }

    /**
     * ソースIDによるドキュメント削除
     */
    @Delete('/document/:userId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteDocumentDelRequestValidator)
    async deletedocumentByUserId (@QueryParam('documentSourceId') queryDocumentSourceId: string, @Param('userId') parmUserId: string, @Req() req: Request, @Body() dto: DeleteDocumentByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setDocumentSourceId(queryDocumentSourceId);
        dto.setDocumentIdentifer(null);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:DeleteDocumentByUserIdResDto = await this.deletedocumentProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * ドキュメント削除
     */
    @Delete('/document/:userId/:documentId')
    @Header('X-Content-Type-Options', 'nosniff')
    @Header('X-XSS-Protection', '1; mode=block')
    @Header('X-Frame-Options', 'deny')
    // SDE-MSA-PRIN 過負荷を回避する （MSA-PRIN-ID-02）
    @EnableSimpleBackPressure()
    @UseBefore(DeleteDocumentDelRequestValidator)
    async deletedocumentByUserIdBydocumentId (@Param('userId') parmUserId: string, @Param('documentId') parmDocumentId: string, @Req() req: Request, @Body() dto: DeleteDocumentByUserIdReqDto, @Res() res: Response): Promise<any> {
        dto.setUserId(parmUserId);
        dto.setDocumentSourceId(null);
        dto.setDocumentIdentifer(parmDocumentId);
        dto.setFromJson(req.body);

        const reqParm: {} = {
            req: req,
            dto: dto
        };

        const ret:DeleteDocumentByUserIdResDto = await this.deletedocumentProc(reqParm);
        return ret.getAsJson();
    }

    /**
     * ドキュメント削除処理
     */
    private async deletedocumentProc (reqParm: any) : Promise<any> {
        const configure = Config.ReadConfig('./config/config.json');
        const message = Config.ReadConfig('./config/message.json');

        // セッションチェックデータオブジェクトを生成
        const sessionCheckDto = new SessionCheckDto();
        sessionCheckDto.setRequest(reqParm.req);
        sessionCheckDto.setCatalogUrl(configure['catalogUrl']);
        sessionCheckDto.setOperatorUrl(configure['operatorUrl']);
        sessionCheckDto.setMessage(message);

        // 除外するオペレータタイプの指定
        sessionCheckDto.setIgnoreOperatorTypeList([OperatorType.TYPE_IND, OperatorType.TYPE_MANAGE_MEMBER]);

        // サービス層のセッションチェックを実行
        const sessionCheckService: SessionCheckService = new SessionCheckService();
        const operator = await sessionCheckService.isSessionCheck(sessionCheckDto);

        // ドキュメント削除データオブジェクトを生成
        const documentDto = new DocumentServiceDto();
        documentDto.setUserId(reqParm.dto.getUserId());
        documentDto.setSourceId(reqParm.dto.getDocumentSourceId());
        documentDto.setDocumentIdentifer(reqParm.dto.getDocumentIdentifer());
        documentDto.setRequestObject(reqParm.dto.getRequestObject());
        documentDto.setOperator(operator);
        documentDto.setCatalogUrl(configure['catalogUrl']);
        documentDto.setCTokenUrl(configure['ctokenUrl']);
        documentDto.setMessage(message);
        // サービス層のドキュメント蓄積を実行
        const documentService: DocumentService = new DocumentService();
        const ret:DeleteDocumentByUserIdResDto = await documentService.deleteDocument(documentDto);
        return ret;
    }
}
