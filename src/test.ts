/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import { transformAndValidate } from 'class-transformer-validator';
// import UserInformationDto from './src/resources/dto/UserInformationDto';
import PostUserCreateReqDto from './resources/dto/PostUserCreateReqDto';

(async () => {
    try {
        const result = await transformAndValidate(
            PostUserCreateReqDto,
            {
                identifyCode: 'ukO8z+Xf8vv7yxXQj2Hpo',
                userInformation: {
                    _code: {
                        _value: 1000373,
                        _ver: 1
                    },
                    'item-group': [
                        {
                            title: '氏名',
                            item: [
                                {
                                    title: '姓',
                                    type: {
                                        _value: 30019,
                                        _ver: 1
                                    },
                                    content: 'サンプル'
                                },
                                {
                                    title: '名',
                                    type: {
                                        _value: 30020,
                                        _ver: 1
                                    },
                                    content: ['太郎']
                                }
                            ]
                        }
                    ]
                }
            }
        );
        console.log(result);
    } catch (err) {
        console.log(err);
    }
})();
