/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import CTokenDto from './dto/CTokenDto';
import { CoreOptions } from 'request';
import Cmatrix2n from '../repositories/postgres/Cmatrix2n';
import CmatrixEvent from '../repositories/postgres/CmatrixEvent';
import CmatrixThing from '../repositories/postgres/CmatrixThing';
/* eslint-enable */
import { doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';
import Config from '../common/Config';
import moment = require('moment-timezone');
const config = Config.ReadConfig('./config/config.json');

export default class CTokenService {
    /**
     * Local-CToken登録/更新
     * @param method
     * @param ctokenDto
     *
     * RefactorDescription:
     *  #3803 : createCmatrixListForSave
     */
    public async saveLocalCToken (method: string, ctokenDto: CTokenDto): Promise<any> {
        const message = ctokenDto.getMessage();

        // CMatrixデータの生成
        const cmatrixList: {}[] = this.createCmatrixListForSave(ctokenDto);

        // POSTデータを生成
        const tempBody: {} = {
            add: [],
            update: [],
            delete: []
        };
        tempBody[method] = cmatrixList;
        const body = JSON.stringify(tempBody);

        const options: CoreOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                accept: 'application/json',
                session: encodeURIComponent(JSON.stringify(ctokenDto.getOperator()))
            },
            body: body
        };

        try {
            // Local-CToken登録/更新 API
            const result = await doPostRequest(ctokenDto.getUrl(), options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.UNAUTHORIZED);
            }
            // 結果を返却
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * 登録/更新用CMatrixデータの生成
     * @param ctokenDto
     * @returns
     */
    private createCmatrixListForSave (ctokenDto: CTokenDto) {
        // CMatrix2(n)データを取得
        const cmatrix2nList: Cmatrix2n[] = ctokenDto.getCmatrix2nList();

        // CMatrixモノデータを取得
        const cmatrixThingList: CmatrixThing[] = ctokenDto.getCmatrixThingList();

        // CMatrixイベントデータを取得
        const cmatrixEventList: CmatrixEvent[] = ctokenDto.getCmatrixEventList();
        const cmatrixList: {}[] = [];
        for (const cmatrixEvent of cmatrixEventList) {
            const bodyDocumentList: {}[] = [];
            for (const cmatrix2n of cmatrix2nList) {
                bodyDocumentList.push({
                    '2_n_1_1': cmatrix2n.docIdentifier,
                    '2_n_1_2_1': cmatrix2n.docCatalogCode,
                    '2_n_1_2_2': cmatrix2n.docCatalogVersion,
                    '2_n_2_1': cmatrix2n.docCreateAt,
                    '2_n_3_1_1': cmatrix2n.docActorCode,
                    '2_n_3_1_2': cmatrix2n.docActorVersion,
                    '2_n_3_2_1': cmatrix2n.docWfCatalogCode,
                    '2_n_3_2_2': cmatrix2n.docWfCatalogVersion,
                    '2_n_3_5_1': cmatrix2n.docAppCatalogCode,
                    '2_n_3_5_2': cmatrix2n.docAppCatalogVersion
                });
            }
            let bodyThingList: {}[] = [];
            for (const cmatrixThing of cmatrixThingList) {
                bodyThingList.push({
                    '4_1_1': cmatrixThing.getThingIdentifier(),
                    '4_1_2_1': cmatrixThing.getThingCatalogCode(),
                    '4_1_2_2': cmatrixThing.getThingCatalogVersion(),
                    '4_4_1_1': cmatrixThing.getThingActorCode(),
                    '4_4_1_2': cmatrixThing.getThingActorVersion(),
                    '4_4_2_1': cmatrixThing.getThingWfCatalogCode(),
                    '4_4_2_2': cmatrixThing.getThingWfCatalogVersion(),
                    '4_4_5_1': cmatrixThing.getThingAppCatalogCode(),
                    '4_4_5_2': cmatrixThing.getThingAppCatalogVersion(),
                    rowHash: cmatrixThing.getRowHash(),
                    rowHashCreateAt: cmatrixThing.getRowHashCreateAt()
                });
            }
            bodyThingList = bodyThingList.length !== 0 ? bodyThingList : null;
            const cmatrixinfo: {} = {
                '1_1': ctokenDto.getUserId(),
                document: bodyDocumentList,
                event: {
                    '3_1_1': cmatrixEvent.getEventIdentifier(),
                    '3_1_2_1': cmatrixEvent.getEventCatalogCode(),
                    '3_1_2_2': cmatrixEvent.getEventCatalogVersion(),
                    '3_2_1': cmatrixEvent.getEventStartAt() ? moment(cmatrixEvent.getEventStartAt()).tz(config['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null,
                    '3_2_2': cmatrixEvent.getEventEndAt() ? moment(cmatrixEvent.getEventEndAt()).tz(config['timezone']).format('YYYY-MM-DDTHH:mm:ss.SSSZZ') : null,
                    '3_5_1_1': cmatrixEvent.getEventActorCode(),
                    '3_5_1_2': cmatrixEvent.getEventActorVersion(),
                    '3_5_2_1': cmatrixEvent.getEventWfCatalogCode(),
                    '3_5_2_2': cmatrixEvent.getEventWfCatalogVersion(),
                    '3_5_5_1': cmatrixEvent.getEventAppCatalogCode(),
                    '3_5_5_2': cmatrixEvent.getEventAppCatalogVersion()
                },
                thing: bodyThingList
            };
            cmatrixList.push(cmatrixinfo);
        }
        return cmatrixList;
    }

    /**
     * Local-CToken削除
     * @param ctokenDto
     */
    public async deleteLocalCToken (ctokenDto: CTokenDto): Promise<any> {
        const message = ctokenDto.getMessage();

        // ドキュメント識別子リストを取得
        const documentIdentifierList: string[] = ctokenDto.getDocIdentifierList();
        const documents: {}[] = [];
        if (documentIdentifierList && documentIdentifierList.length > 0) {
            documentIdentifierList.forEach((ele: string) => {
                documents.push({
                    '2_n_1_1': ele
                });
            });
        }
        // CMatrixモノデータを取得
        const cmatrixThingList: CmatrixThing[] = ctokenDto.getCmatrixThingList();

        // CMatrixイベントデータを取得
        const cmatrixEventList: CmatrixEvent[] = ctokenDto.getCmatrixEventList();
        const cmatrixList: {}[] = [];
        for (const cmatrixEvent of cmatrixEventList) {
            let bodyThingList: {}[] = [];
            for (const cmatrixThing of cmatrixThingList) {
                bodyThingList.push({
                    '4_1_1': cmatrixThing.getThingIdentifier()
                });
            }
            bodyThingList = bodyThingList.length !== 0 ? bodyThingList : null;
            const cmatrixinfo: {} = {
                '1_1': ctokenDto.getUserId(),
                document: documents,
                event: {
                    '3_1_1': cmatrixEvent.getEventIdentifier()
                },
                thing: bodyThingList
            };
            cmatrixList.push(cmatrixinfo);
        }

        // POSTデータを生成
        const tempBody: {} = {
            add: [],
            update: [],
            delete: cmatrixList
        };
        const body = JSON.stringify(tempBody);

        const options: CoreOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                accept: 'application/json',
                session: encodeURIComponent(JSON.stringify(ctokenDto.getOperator()))
            },
            body: body
        };

        try {
            // Local-CToken削除 API
            const result = await doPostRequest(ctokenDto.getUrl(), options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.UNAUTHORIZED);
            }
            // 結果を返却
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * Local-CToken一括削除
     * @param ctokenDtos
     */
    public async deleteLocalCTokenList (ctokenDtos: CTokenDto[]): Promise<any> {
        const message = ctokenDtos[0].getMessage();
        const cmatrixList: {}[] = [];

        for (const ctokenDto of ctokenDtos) {
            // ドキュメント識別子リストを取得
            const documentIdentifierList: string[] = ctokenDto.getDocIdentifierList();
            const documents: {}[] = [];
            if (documentIdentifierList && documentIdentifierList.length > 0) {
                documentIdentifierList.forEach((ele: string) => {
                    documents.push({
                        '2_n_1_1': ele
                    });
                });
            }
            // CMatrixモノデータを取得
            const cmatrixThingList: CmatrixThing[] = ctokenDto.getCmatrixThingList();

            // CMatrixイベントデータを取得
            const cmatrixEventList: CmatrixEvent[] = ctokenDto.getCmatrixEventList();
            for (const cmatrixEvent of cmatrixEventList) {
                let bodyThingList: {}[] = [];
                for (const cmatrixThing of cmatrixThingList) {
                    bodyThingList.push({
                        '4_1_1': cmatrixThing.getThingIdentifier()
                    });
                }
                bodyThingList = bodyThingList.length !== 0 ? bodyThingList : null;
                const cmatrixinfo: {} = {
                    '1_1': ctokenDto.getUserId(),
                    document: documents,
                    event: {
                        '3_1_1': cmatrixEvent.getEventIdentifier()
                    },
                    thing: bodyThingList
                };
                cmatrixList.push(cmatrixinfo);
            }
        }

        // POSTデータを生成
        const tempBody: {} = {
            add: [],
            update: [],
            delete: cmatrixList
        };
        const body = JSON.stringify(tempBody);

        const options: CoreOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                accept: 'application/json',
                session: encodeURIComponent(JSON.stringify(ctokenDtos[0].getOperator()))
            },
            body: body
        };

        try {
            // Local-CToken削除 API
            const result = await doPostRequest(ctokenDtos[0].getUrl(), options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_CTOKEN_POST, ResponseCode.UNAUTHORIZED);
            }
            // 結果を返却
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_CTOKEN_POST, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
