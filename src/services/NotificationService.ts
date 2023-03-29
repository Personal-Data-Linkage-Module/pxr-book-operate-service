/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import NotificationDto from './dto/NotificationDto';
import { CoreOptions } from 'request';
/* eslint-enable */
import { doGetRequest, doPostRequest } from '../common/DoRequest';
import AppError from '../common/AppError';
import { ResponseCode } from '../common/ResponseCode';

export default class NotificationService {
    /**
     * 通知登録
     * @param notificationDto
     */
    public async postNotificationAdd (notificationDto: NotificationDto): Promise<any> {
        const message = notificationDto.getMessage();
        const operator = notificationDto.getOperator();
        const body = JSON.stringify({
            type: notificationDto.getType(),
            title: notificationDto.getTitle(),
            content: notificationDto.getContent(),
            attribute: notificationDto.getAttribute(),
            category: {
                _value: notificationDto.getCategoryCode(),
                _ver: notificationDto.getCategoryVersion()
            },
            from: {
                applicationCode: notificationDto.getFromApplicationCode(),
                workflowCode: null
            },
            destination: {
                blockCode: notificationDto.getDestinationBlockCode(),
                operatorType: notificationDto.getDestinationOperatorType(),
                isSendAll: notificationDto.getDestinationIsSendAll(),
                operatorId: notificationDto.getDestinationOperatorId(),
                userId: notificationDto.getDestinationUserId()
            }
        });

        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body),
                session: operator.getEncodeData()
            },
            body: body
        };

        try {
            // 通知サービスに通知登録
            const result = await doPostRequest(notificationDto.getUrl(), options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_POST, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_POST, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_POST, ResponseCode.UNAUTHORIZED);
            }
            // 結果を戻す
            return result.body;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_NOTIFICATION, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }

    /**
     * 通知取得
     * @param notificationDto
     */
    public async getNotification (notificationDto: NotificationDto): Promise<any> {
        const message = notificationDto.getMessage();
        const operator = notificationDto.getOperator();
        const url = notificationDto.getUrl() + '/?is_send=false&is_unread=false&is_approval=false&type=0&num=0';
        // 接続のためのオプションを生成
        const options: CoreOptions = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                session: operator.getEncodeData()
            }
        };

        try {
            // 通知サービスに通知登録
            const result = await doGetRequest(url, options);

            // ステータスコードを判定
            const statusCode: string = result.response.statusCode.toString();
            if (result.response.statusCode === ResponseCode.BAD_REQUEST) {
                // 応答が400の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_GET, ResponseCode.BAD_REQUEST);
            } else if (statusCode.match(/^5.+/)) {
                // 応答が500系の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_GET, ResponseCode.SERVICE_UNAVAILABLE);
            } else if (result.response.statusCode === ResponseCode.NO_CONTENT) {
                // 応答が200 OK以外の場合、エラーを返す
                return [];
            } else if (result.response.statusCode !== ResponseCode.OK) {
                // 応答が200 OK以外の場合、エラーを返す
                throw new AppError(message.FAILED_NOTIFICATION_GET, ResponseCode.UNAUTHORIZED);
            }
            // 結果を戻す
            const ret = result.body;
            return ret;
        } catch (err) {
            if (err.name === AppError.NAME) {
                throw err;
            }
            // サービスへの接続に失敗した場合
            throw new AppError(message.FAILED_CONNECT_TO_NOTIFICATION, ResponseCode.SERVICE_UNAVAILABLE, err);
        }
    }
}
