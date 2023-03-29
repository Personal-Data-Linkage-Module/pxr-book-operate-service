/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';

import * as express from 'express';
import bodyParser = require('body-parser');
/**
 * Book管理サービス
 */
export default class StubBookManageServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number, option?: number) {
        this._app = express();

        // イベントハンドラー
        // 利用者ID連携
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (option === 1) {
                    // APP
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        app: {
                            _value: 1000005,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else if (option === 2) {
                    // REGION
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        region: {
                            _value: 1000006,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else if (option === 3) {
                    // 異常系
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        region: {
                            _value: 1000004,
                            _ver: 1
                        },
                        app: {
                            _value: 1000005,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else if (option === 4) {
                    // 異常系
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else {
                    // WF
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        wf: {
                            _value: 1000004,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                }
                return;
            }
            res.status(status).end();
        };

        // データ蓄積定義取得
        const _listener2 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (req.params.id === '111111111') {
                    res.json({
                        id: 1,
                        bookId: 1,
                        regionUseId: null,
                        type: 'store',
                        actor: {
                            _value: 1000112,
                            _ver: 1
                        },
                        app: null,
                        wf: {
                            _value: 1000007,
                            _ver: 1
                        },
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            },
                            {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000009,
                                _ver: 1
                            },
                            {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000011,
                                _ver: 1
                            },
                            {
                                _value: 1000014,
                                _ver: 1
                            }
                        ]
                    });
                } else if (req.params.id === '222222222') {
                    res.json({
                        id: 1,
                        bookId: 1,
                        regionUseId: null,
                        type: 'store',
                        actor: {
                            _value: 1200112,
                            _ver: 1
                        },
                        app: null,
                        wf: {
                            _value: 1200007,
                            _ver: 2
                        },
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            },
                            {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1200009,
                                _ver: 4
                            },
                            {
                                _value: 1200010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1200011,
                                _ver: 2
                            },
                            {
                                _value: 1200014,
                                _ver: 3
                            }
                        ]
                    });
                } else if (req.params.id === '333333333') {
                    res.json({
                        id: 1,
                        bookId: 1,
                        regionUseId: null,
                        type: 'store',
                        actor: {
                            _value: 1300112,
                            _ver: 1
                        },
                        wf: null,
                        app: {
                            _value: 1300007,
                            _ver: 2
                        },
                        document: [
                            {
                                _value: 1000009,
                                _ver: 1
                            },
                            {
                                _value: 1000010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1300009,
                                _ver: 4
                            },
                            {
                                _value: 1300010,
                                _ver: 5
                            }
                        ],
                        thing: [
                            {
                                _value: 1300011,
                                _ver: 2
                            },
                            {
                                _value: 1300014,
                                _ver: 3
                            }
                        ]
                    });
                }
                return;
            }
            res.status(status).end();
        };

        // 利用者ID連携解除
        const _listener3 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (option === 1) {
                    // APP
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        app: {
                            _value: 1000005,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else if (option === 2) {
                    // REGION
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        region: {
                            _value: 1000006,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else if (option === 3) {
                    // 異常系
                    res.json({
                        actor: null,
                        region: {
                            _value: 1000006,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                } else {
                    // WF
                    res.json({
                        actor: {
                            _value: 1000003,
                            _ver: 1
                        },
                        wf: {
                            _value: 1000004,
                            _ver: 1
                        },
                        userId: '123456789'
                    });
                }
                return;
            }
            res.status(status).end();
        };

        // My-Condition-Book一覧取得
        const _listener4 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (!option) {
                    res.json([
                        {
                            pxrId: '58di2dfse2.test.org',
                            attribute: {
                                key: 'value'
                            },
                            cooperation: [
                                {
                                    actor: {
                                        _value: '1000004',
                                        _ver: '1'
                                    },
                                    wf: null,
                                    app: {
                                        _value: '1000007',
                                        _ver: '1'
                                    },
                                    userId: 'userid01',
                                    startAt: '2020-07-07T00:00:00.000+0900'
                                }
                            ],
                            userInformation: [
                                {
                                    template: {
                                        _code: {
                                            _value: 99999,
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
                                                        content: '太郎'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '氏名(ローマ字)',
                                                item: [
                                                    {
                                                        title: '姓(ローマ字)',
                                                        type: {
                                                            _value: 30119,
                                                            _ver: 1
                                                        },
                                                        content: 'sample'
                                                    },
                                                    {
                                                        title: '名(ローマ字)',
                                                        type: {
                                                            _value: 30120,
                                                            _ver: 1
                                                        },
                                                        content: 'taro'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '連絡先',
                                                item: [
                                                    {
                                                        title: '電話番号',
                                                        type: {
                                                            _value: 30121,
                                                            _ver: 1
                                                        },
                                                        content: '080-0000-0000'
                                                    },
                                                    {
                                                        title: '郵便番号',
                                                        type: {
                                                            _value: 30122,
                                                            _ver: 1
                                                        },
                                                        content: '000-0000'
                                                    },
                                                    {
                                                        title: '住所',
                                                        type: {
                                                            _value: 30123,
                                                            _ver: 1
                                                        },
                                                        content: '東京都港区'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]);
                    return;
                } else if (option === 2) {
                    if (req.body.pxrId[0] === 'test_user_id1') {
                        res.json([
                            {
                                pxrId: '58di2dfse2.test.org',
                                attribute: {
                                    key: 'value'
                                },
                                cooperation: [
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        app: null,
                                        wf: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_id1',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    },
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        app: null,
                                        wf: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_idxxx',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    }
                                ],
                                userInformation: []
                            }
                        ]);
                    } else if (req.body.pxrId[0] === 'test_user_id2') {
                        res.json([
                            {
                                pxrId: '58di2dfse2.test.org',
                                attribute: {
                                    key: 'value'
                                },
                                cooperation: [
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        app: null,
                                        wf: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_id2',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    }
                                ],
                                userInformation: []
                            }
                        ]);
                    } else if (req.body.pxrId[0] === 'test_user_id3') {
                        res.json([
                            {
                                pxrId: '58di2dfse2.test.org',
                                attribute: {
                                    key: 'value'
                                },
                                cooperation: [
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        wf: null,
                                        app: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_id3',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    }
                                ],
                                userInformation: []
                            }
                        ]);
                    } else if (req.body.pxrId[0] === 'test_user_idxxx') {
                        res.json([
                            {
                                pxrId: '58di2dfse2.test.org',
                                attribute: {
                                    key: 'value'
                                },
                                cooperation: [
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        wf: null,
                                        app: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_idxxx',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    }
                                ],
                                userInformation: []
                            }
                        ]);
                    } else if (req.body.pxrId[0] === 'test_user_id0') {
                        res.json([
                            {
                                pxrId: '58di2dfse2.test.org',
                                attribute: {
                                    key: 'value'
                                },
                                cooperation: [
                                    {
                                        actor: {
                                            _value: '1000004',
                                            _ver: '1'
                                        },
                                        wf: null,
                                        app: {
                                            _value: '1000007',
                                            _ver: '1'
                                        },
                                        userId: 'test_user_id0',
                                        startAt: '2020-07-07T00:00:00.000+0900'
                                    }
                                ],
                                userInformation: []
                            }
                        ]);
                    } else {
                        console.log(req.body.pxrId[0]);
                        console.log('pxrIdの取得に失敗しています');
                        res.status(400).end();
                    }
                } else if (option === 3) {
                    res.json([
                        {
                            pxrId: '58di2dfse2.test.org',
                            attribute: {
                                key: 'value'
                            },
                            cooperation: [
                                {
                                    actor: {
                                        _value: 1000004,
                                        _ver: 1
                                    },
                                    app: null,
                                    wf: {
                                        _value: 1000004,
                                        _ver: 1
                                    },
                                    userId: 'test_user_id1',
                                    startAt: '2020-07-07T00:00:00.000+0900'
                                }
                            ],
                            userInformation: [
                                {
                                    template: {
                                        _code: {
                                            _value: 99999,
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
                                                        content: '太郎'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '氏名(ローマ字)',
                                                item: [
                                                    {
                                                        title: '姓(ローマ字)',
                                                        type: {
                                                            _value: 30119,
                                                            _ver: 1
                                                        },
                                                        content: 'sample'
                                                    },
                                                    {
                                                        title: '名(ローマ字)',
                                                        type: {
                                                            _value: 30120,
                                                            _ver: 1
                                                        },
                                                        content: 'taro'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '連絡先',
                                                item: [
                                                    {
                                                        title: '電話番号',
                                                        type: {
                                                            _value: 30121,
                                                            _ver: 1
                                                        },
                                                        content: '080-0000-0000'
                                                    },
                                                    {
                                                        title: '郵便番号',
                                                        type: {
                                                            _value: 30122,
                                                            _ver: 1
                                                        },
                                                        content: '000-0000'
                                                    },
                                                    {
                                                        title: '住所',
                                                        type: {
                                                            _value: 30123,
                                                            _ver: 1
                                                        },
                                                        content: '東京都港区'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            pxrId: '58di2dfse2.test.org',
                            attribute: {
                                key: 'value'
                            },
                            cooperation: [
                                {
                                    actor: {
                                        _value: 1000004,
                                        _ver: 1
                                    },
                                    app: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    wf: null,
                                    userId: 'userid01',
                                    startAt: '2020-07-07T00:00:00.000+0900'
                                }
                            ],
                            userInformation: [
                                {
                                    template: {
                                        _code: {
                                            _value: 99999,
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
                                                        content: '太郎'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '氏名(ローマ字)',
                                                item: [
                                                    {
                                                        title: '姓(ローマ字)',
                                                        type: {
                                                            _value: 30119,
                                                            _ver: 1
                                                        },
                                                        content: 'sample'
                                                    },
                                                    {
                                                        title: '名(ローマ字)',
                                                        type: {
                                                            _value: 30120,
                                                            _ver: 1
                                                        },
                                                        content: 'taro'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '連絡先',
                                                item: [
                                                    {
                                                        title: '電話番号',
                                                        type: {
                                                            _value: 30121,
                                                            _ver: 1
                                                        },
                                                        content: '080-0000-0000'
                                                    },
                                                    {
                                                        title: '郵便番号',
                                                        type: {
                                                            _value: 30122,
                                                            _ver: 1
                                                        },
                                                        content: '000-0000'
                                                    },
                                                    {
                                                        title: '住所',
                                                        type: {
                                                            _value: 30123,
                                                            _ver: 1
                                                        },
                                                        content: '東京都港区'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        },
                        {
                            pxrId: '58di2dfse2.test.org',
                            attribute: {
                                key: 'value'
                            },
                            cooperation: [
                                {
                                    actor: {
                                        _value: 1000001,
                                        _ver: 1
                                    },
                                    app: null,
                                    wf: {
                                        _value: 1000007,
                                        _ver: 1
                                    },
                                    userId: 'test_user_id1',
                                    startAt: '2020-07-07T00:00:00.000+0900'
                                }
                            ],
                            userInformation: [
                                {
                                    template: {
                                        _code: {
                                            _value: 99999,
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
                                                        content: '太郎'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '氏名(ローマ字)',
                                                item: [
                                                    {
                                                        title: '姓(ローマ字)',
                                                        type: {
                                                            _value: 30119,
                                                            _ver: 1
                                                        },
                                                        content: 'sample'
                                                    },
                                                    {
                                                        title: '名(ローマ字)',
                                                        type: {
                                                            _value: 30120,
                                                            _ver: 1
                                                        },
                                                        content: 'taro'
                                                    }
                                                ]
                                            },
                                            {
                                                title: '連絡先',
                                                item: [
                                                    {
                                                        title: '電話番号',
                                                        type: {
                                                            _value: 30121,
                                                            _ver: 1
                                                        },
                                                        content: '080-0000-0000'
                                                    },
                                                    {
                                                        title: '郵便番号',
                                                        type: {
                                                            _value: 30122,
                                                            _ver: 1
                                                        },
                                                        content: '000-0000'
                                                    },
                                                    {
                                                        title: '住所',
                                                        type: {
                                                            _value: 30123,
                                                            _ver: 1
                                                        },
                                                        content: '東京都港区'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 4) {
                    res.json([
                        {
                            pxrId: '58di2dfse2.test.org',
                            attribute: {
                                key: 'value'
                            },
                            cooperation: null,
                            userInformation: null
                        }
                    ]);
                }
            }
            res.status(status).end();
        };

        // 一時的データ共有コード照合
        const _listener5 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (option === 0) {
                    res.json({
                        actor: { _value: 1000004 },
                        wf: null,
                        app: { _value: 1000007 },
                        identifier: [
                            {
                                document: 'doc01-89bb-f8f2-74a0-dc517da60653',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21',
                                    'doc01-eve02-e230-930c-c43d5050b9d3'
                                ],
                                thing: [
                                    'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                ]
                            },
                            {
                                document: 'doc02-ceb1-fd2b-d9ac-e405f5159fe2',
                                event: [],
                                thing: [
                                    'doc02-eve01-thi01-3f9d-58151c94fdad',
                                    'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                                ]
                            },
                            {
                                document: 'doc03-baa1-8808-dbeb-63b6-f09a1cf8e1fb',
                                event: [],
                                thing: []
                            },
                            {
                                event: 'eve02-b098-8327-feb5-0927-91afeba51114',
                                thing: []
                            },
                            {
                                event: 'eve01-c31-459a-479e-794b-6302046a04c5',
                                thing: [
                                    'eve01-thi02-1441-31d7-5725-f22548ac0cb9',
                                    'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                                ]
                            },
                            {
                                thing: [
                                    'thi02-9-1056-c4ed-edd4-9bcd2eb96902',
                                    'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                                ]
                            }
                        ],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 1) {
                    res.json({
                        actor: { _value: 1000004 },
                        app: null,
                        wf: { _value: 1000007 },
                        identifier: [],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 2) {
                    res.json({
                        pxrId: 'test_user_id2',
                        actor: { _value: 1000004 },
                        wf: null,
                        app: { _value: 1000007 },
                        identifier: [],
                        tempShareCode: 'fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 3) {
                    res.json({
                        actor: { _value: 1000004 },
                        app: null,
                        wf: { _value: 1000007 },
                        identifier: [
                            {
                                event:
                                    'doc01-eve01-8eb5-9b57-ac1980208f21'
                                ,
                                thing: [
                                    'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                ]
                            }
                        ],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438eeee',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 4) {
                    res.json({
                        actor: { _value: 1000004 },
                        app: null,
                        wf: { _value: 1000007 },
                        identifier: [
                            {
                                document: 'doc01-89bb-f8f2-74a0-dc517da60653',
                                event: ['doc01-eve01-8eb5-9b57-ac1980208f21'],
                                thing: ['doc01-eve01-thi01-c4e0-130b2788dcf4']
                            }
                        ],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438ffff',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 5) {
                    res.json({
                        actor: { _value: 1000004 },
                        app: null,
                        wf: { _value: 1000007 },
                        identifier: [
                            {
                                document: 'doc01-89bb-f8f2-74a0-dc517da60653',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21'
                                ]
                            }
                        ],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                } else if (option === 6) {
                    res.json({
                        actor: { _value: 1000004 },
                        app: null,
                        wf: { _value: 1000007 },
                        identifier: [
                            {
                                thing: null
                            }
                        ],
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        expireAt: '2021-10-22 13:35:02.965'
                    });
                    return;
                }
            }
            res.status(status).end();
        };

        // ユーザー取得
        const _listener6 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                const userId = req.body.userId;
                if (userId === 'test_user1') {
                    res.json({
                        pxrId: 'test_user_id1'
                    });
                    return;
                } else if (userId === 'test_user2') {
                    res.json({
                        pxrId: 'test_user_id2'
                    });
                    return;
                } else if (userId === 'test_user3') {
                    res.json({
                        pxrId: 'test_user_id3'
                    });
                    return;
                } else if (userId === 'test_user4') {
                    res.json({
                        pxrId: 'test_user_id4'
                    });
                    return;
                } else if (userId === 'test_userxxx') {
                    res.json({
                        pxrId: 'test_user_idxxx'
                    });
                    return;
                }
            }
            res.status(status).end();
        };

        const _listener7 = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (option === 1) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 2) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000502,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 3) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": [{
                                        "_value": 1000502,
                                        "_ver": 1
                                    }]
                                }
                            ]
                        }
                    ]);
                } else if (option === 4) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 5) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 6) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "wf": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 7) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 8) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 9) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                } else if (option === 10) {
                    res.status(200).json([
                        {
                            "id": 1,
                            "actor": {
                                "_value": 1000004
                            },
                            "app": {
                                "_value": 1000007
                            },
                            "share": [
                                {
                                    "code": {
                                        "_value": 1000501,
                                        "_ver": 1
                                    }
                                }
                            ]
                        }
                    ]);
                }

                return;
            }
            res.status(status).end();
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.use(bodyParser.json());
        this._app.post('/book-manage/cooperate', _listener);
        this._app.get('/book-manage/settings/store/:id', _listener2);
        this._app.post('/book-manage/cooperate/release', _listener3);
        this._app.post('/book-manage/search/user', _listener6);
        this._app.post('/book-manage/search', _listener4);
        this._app.get('/book-manage/setting/share', _listener7);
        this._app.post('/book-manage/share/temp/collation', _listener5);
        this._server = this._app.listen(3005);
    }
}
/* eslint-enable */
