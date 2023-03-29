/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
import * as supertest from 'supertest';
import { Application } from '../resources/config/Application';
import Common, { Url } from './Common';
import { Session } from './Session';
import Config from '../common/Config';
import { StubOperatorServerType0 } from './StubOperatorServer';
import StubBookManageServer from './StubBookManageServer';
import StubProxyServer from './StubProxyServer';
const Message = Config.ReadConfig('./config/message.json');

// 対象アプリケーションを取得
const app = new Application();
const expressApp = app.express.app;
const common = new Common();

// サーバをlisten
app.start();

// スタブサーバー
let _operatorServer: StubOperatorServerType0 = null;
let _bookManageServer: StubBookManageServer = null;
let _proxyServer: StubProxyServer = null;

/**
 * book-operate API のユニットテスト
 */
describe('book-operate API', () => {
    /**
     * 全テスト実行の前処理
     */
    beforeAll(async () => {
        // DB接続
        await common.connect();
        // DB初期化
        await common.executeSqlFile('initialData.sql');
        await common.executeSqlFile('initialMyConditionData.sql');
    });
    /**
     * 各テスト実行の前処理
     */
    beforeEach(async () => {
        // DB接続
        await common.connect();
    });
    /**
     * 全テスト実行の後処理
     */
    afterAll(async () => {
        // サーバ停止
        app.stop();
    });
    /**
     * 各テスト実行の後処理
     */
    afterEach(async () => {
        // スタブサーバー停止
        if (_operatorServer) {
            _operatorServer._server.close();
            _operatorServer = null;
        }
        if (_bookManageServer) {
            _bookManageServer._server.close();
            _bookManageServer = null;
        }
        if (_proxyServer) {
            _proxyServer._server.close();
            _proxyServer = null;
        }
    });

    /**
     * 一時的データ共有コードによるデータ取得
     */
    describe('一時的データ共有コードによるデータ取得', () => {
        test('正常：データ取得（照合結果にidentifierあり）', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ 'access-token': '1111111111111' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                document: [
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc01-89bb-f8f2-74a0-dc517da60653'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル１',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21',
                                    'doc01-eve02-e230-930c-c43d5050b9d3'
                                ]
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc02-ceb1-fd2b-d9ac-e405f5159fe2'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル２',
                                event: [
                                    'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d',
                                    '97ad360f-5749-add7-9076-9dca6a9fc112'
                                ]
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc03-baa1-8808-dbeb-63b6-f09a1cf8e1fb'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル３',
                                event: [
                                    'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29',
                                    'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve01-8eb5-9b57-ac1980208f21'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                },
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 43,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve02-e230-930c-c43d5050b9d3'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: []
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: '97ad360f-5749-add7-9076-9dca6a9fc112'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [{
                            acquired_time: {
                                index: '4_2_2_4',
                                value: null
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000815,
                                    _ver: 1
                                }
                            },
                            env: null,
                            sourceId: '20200221-1',
                            id: {
                                index: '4_1_1',
                                value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                            },
                            wf: null,
                            app: {
                                code: {
                                    index: '3_5_1',
                                    value: {
                                        _value: 1000438,
                                        _ver: 1
                                    }
                                },
                                app: {
                                    index: '3_5_5',
                                    value: {
                                        _value: 1000481,
                                        _ver: 1
                                    }
                                }
                            },
                            'x-axis': {
                                index: '4_2_2_1',
                                value: null
                            },
                            'y-axis': {
                                index: '4_2_2_2',
                                value: null
                            },
                            'z-axis': {
                                index: '4_2_2_3',
                                value: null
                            }
                        }]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve01-c31-459a-479e-794b-6302046a04c5'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve02-b098-8327-feb5-0927-91afeba51114'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                        },
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    }
                ]
            }));
        });
        test('正常：データ取得（照合結果にidentifierあり）,document, event, thing1件ずつ共有コードで指定', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 4);
            _proxyServer = new StubProxyServer(3003, 200, 2);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438ffff',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1000811,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1000814,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                document: [
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc01-89bb-f8f2-74a0-dc517da60653'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル１',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21',
                                    'doc01-eve02-e230-930c-c43d5050b9d3'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve01-8eb5-9b57-ac1980208f21'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                },
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 43,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                        },
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    }
                ]
            }));
        });
        test('正常：データ取得（照合結果にidentifierあり）,eventのみ取得, 一時的共有の定義でevent.thingをフィルタリング', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 3);
            _proxyServer = new StubProxyServer(3003, 200, 1);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438eeee',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                document: [],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve01-8eb5-9b57-ac1980208f21'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                },
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 43,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: []
            }));
        });
        test('正常：データ取得（照合結果にidentifierなし）', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 1);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                document: [
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc01-89bb-f8f2-74a0-dc517da60653'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル１',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21',
                                    'doc01-eve02-e230-930c-c43d5050b9d3'
                                ]
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc02-ceb1-fd2b-d9ac-e405f5159fe2'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル２',
                                event: [
                                    'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d',
                                    '97ad360f-5749-add7-9076-9dca6a9fc112'
                                ]
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc03-baa1-8808-dbeb-63b6-f09a1cf8e1fb'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル３',
                                event: [
                                    'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29',
                                    'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve01-8eb5-9b57-ac1980208f21'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                },
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 43,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-1171a3b52499'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve02-e230-930c-c43d5050b9d3'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve02-thi01-813a-505c-2657f0f09817'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: '97ad360f-5749-add7-9076-9dca6a9fc112'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve01-c31-459a-479e-794b-6302046a04c5'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: '655cbcdd-7c7a-6378-8182-d5d1effa5d0d'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve02-b098-8327-feb5-0927-91afeba51114'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                        },
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-1171a3b52499'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve02-thi01-813a-505c-2657f0f09817'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '655cbcdd-7c7a-6378-8182-d5d1effa5d0d'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    }
                ]
            }));
        });
        test('正常：データ取得（結果が空）', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200, 3);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify({
                document: [],
                event: [],
                thing: []
            }));
        });
        test('正常：データ取得（照合結果にidentifierあり）document.chapter.eventがnull', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200, 4);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ 'access-token': '1111111111111' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                document: [
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc01-89bb-f8f2-74a0-dc517da60653'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル１',
                                event: null
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc02-ceb1-fd2b-d9ac-e405f5159fe2'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル２',
                                event: [
                                    'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d',
                                    '97ad360f-5749-add7-9076-9dca6a9fc112'
                                ]
                            }
                        ]
                    },
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc03-baa1-8808-dbeb-63b6-f09a1cf8e1fb'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        app: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '2_3_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル３',
                                event: [
                                    'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29',
                                    'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc02-eve01-9c9c-0799-45e5-7e9a190e0a0d'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000815,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: '97ad360f-5749-add7-9076-9dca6a9fc112'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [{
                            acquired_time: {
                                index: '4_2_2_4',
                                value: null
                            },
                            code: {
                                index: '4_1_2',
                                value: {
                                    _value: 1000815,
                                    _ver: 1
                                }
                            },
                            env: null,
                            sourceId: '20200221-1',
                            id: {
                                index: '4_1_1',
                                value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                            },
                            wf: null,
                            app: {
                                code: {
                                    index: '3_5_1',
                                    value: {
                                        _value: 1000438,
                                        _ver: 1
                                    }
                                },
                                app: {
                                    index: '3_5_5',
                                    value: {
                                        _value: 1000481,
                                        _ver: 1
                                    }
                                }
                            },
                            'x-axis': {
                                index: '4_2_2_1',
                                value: null
                            },
                            'y-axis': {
                                index: '4_2_2_2',
                                value: null
                            },
                            'z-axis': {
                                index: '4_2_2_3',
                                value: null
                            }
                        }]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve21e7d-be0b-7fe0-3946-6ac2d3f29c29'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve2ba69-7b81-7aaf-8b02-5caa375ec8f0'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000816,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve01-c31-459a-479e-794b-6302046a04c5'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000817,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    },
                    {
                        id: {
                            index: '3_1_1',
                            value: 'eve02-b098-8327-feb5-0927-91afeba51114'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000818,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                        },
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve01-thi01-3f9d-58151c94fdad'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc02-eve02-thi01-fece-a0a7-889462ef21d2'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'd008f05b-15cb-9e78-7bfe-37df1105df6a'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000815,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '8c8fc6be-6d3b-dc44-d8cc-26e07641485c'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thicc8a1-ac2a-3bdc-b41e-e15a857526db'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi33916-0c79-5372-f2ff-098cd4a56bb1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi19c77-9b53-35e7-996f-6770f8868a29'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000816,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi8e266-2e24-1ea4-0cde-948516d556d0'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi01-ec81-35af-e85f-b6fe2d3dcd4f'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000817,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'eve01-thi02-1441-31d7-5725-f22548ac0cb9'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi9b36e-b79d-ecd8-5fc4-af81b5ed91eb'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: '9f034179-2f15-111b-3acf-6d4262ecdfd1'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi01-84c6-06f5-d1c8-64f5-dd1b70e55058'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000818,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'thi02-9-1056-c4ed-edd4-9bcd2eb96902'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    }
                ]
            });
        });
        test('正常：データ取得（照合結果にidentifierあり）identifier.thingがnull', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 5);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ 'access-token': '1111111111111' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                document: [
                    {
                        id: {
                            index: '2_1_1',
                            value: 'doc01-89bb-f8f2-74a0-dc517da60653'
                        },
                        code: {
                            index: '2_1_2',
                            value: {
                                _value: 1001010,
                                _ver: 1
                            }
                        },
                        createdAt: {
                            index: '2_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        sourceId: '20200221-1',
                        wf: {
                            code: {
                                index: '2_3_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '2_3_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '2_3_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            },
                            staffId: {
                                index: '2_3_4',
                                value: 'staffId'
                            }
                        },
                        chapter: [
                            {
                                title: 'タイトル１',
                                event: [
                                    'doc01-eve01-8eb5-9b57-ac1980208f21',
                                    'doc01-eve02-e230-930c-c43d5050b9d3'
                                ]
                            }
                        ]
                    }
                ],
                event: [
                    {
                        id: {
                            index: '3_1_1',
                            value: 'doc01-eve01-8eb5-9b57-ac1980208f21'
                        },
                        code: {
                            index: '3_1_2',
                            value: {
                                _value: 1000811,
                                _ver: 1
                            }
                        },
                        start: {
                            index: '3_2_1',
                            value: '2020-02-20 00:00:00'
                        },
                        end: {
                            index: '3_2_2',
                            value: '2020-02-21 00:00:00'
                        },
                        location: {
                            index: '3_3_1',
                            value: 'location'
                        },
                        sourceId: '20200221-1',
                        env: null,
                        app: null,
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        thing: [
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                                },
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 43,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            },
                            {
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: null
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000814,
                                        _ver: 1
                                    }
                                },
                                env: null,
                                sourceId: '20200221-1',
                                id: {
                                    index: '4_1_1',
                                    value: 'doc01-eve01-thi01-1171a3b52499'
                                },
                                wf: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000438,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000481,
                                            _ver: 1
                                        }
                                    }
                                },
                                'x-axis': {
                                    index: '4_2_2_1',
                                    value: null
                                },
                                'y-axis': {
                                    index: '4_2_2_2',
                                    value: null
                                },
                                'z-axis': {
                                    index: '4_2_2_3',
                                    value: null
                                }
                            }
                        ]
                    }
                ],
                thing: [
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-c4e0-130b2788dcf4'
                        },
                        wf: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            wf: {
                                index: '3_5_2',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            },
                            role: {
                                index: '3_5_3',
                                value: {
                                    _value: 43,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    },
                    {
                        acquired_time: {
                            index: '4_2_2_4',
                            value: null
                        },
                        code: {
                            index: '4_1_2',
                            value: {
                                _value: 1000814,
                                _ver: 1
                            }
                        },
                        env: null,
                        sourceId: '20200221-1',
                        id: {
                            index: '4_1_1',
                            value: 'doc01-eve01-thi01-1171a3b52499'
                        },
                        wf: null,
                        app: {
                            code: {
                                index: '3_5_1',
                                value: {
                                    _value: 1000438,
                                    _ver: 1
                                }
                            },
                            app: {
                                index: '3_5_5',
                                value: {
                                    _value: 1000481,
                                    _ver: 1
                                }
                            }
                        },
                        'x-axis': {
                            index: '4_2_2_1',
                            value: null
                        },
                        'y-axis': {
                            index: '4_2_2_2',
                            value: null
                        },
                        'z-axis': {
                            index: '4_2_2_3',
                            value: null
                        }
                    }
                ]
            });
        });
        test('正常：データ取得（照合結果にidentifierあり）identifierがnull', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 6);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ 'access-token': '1111111111111' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: []
                    }));

            // レスポンスチェック
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                document: [],
                event: [],
                thing: []
            });
        });
        test('パラメータ異常：全体が空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify({}));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.REQUEST_IS_EMPTY);
        });
        test('パラメータ不足：tempShareCode', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：tempShareCode、uuid以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa97b049229b552b555438779euuuu',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isUuid);
        });
        test('パラメータ異常：tempShareCode、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: null,
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：updatedAt.start', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：updatedAt.start、日付以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '202001010000000000',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常：updatedAt.start、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: null,
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：updatedAt.end', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：updatedAt.end、日付以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020030100000000000900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDate);
        });
        test('パラメータ異常：updatedAt.end、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: null
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document、配列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: {
                            _value: 1001010,
                            _ver: 1
                        },
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：document[]._value', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._value、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：document[]._value、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：document[]._ver', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：document[]._ver、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 'dummy'
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：document[]._ver、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: null
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event、配列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: {
                            _value: 1001010,
                            _ver: 1
                        },
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：event[]._value', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._value、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event[]._value、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：event[]._ver', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：event[]._ver、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 'dummy'
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：event[]._ver、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: null
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing、配列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: {
                            _value: 1001010,
                            _ver: 1
                        }
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('パラメータ不足：thing[]._value', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._value、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing[]._value、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: null,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ不足：thing[]._ver', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：thing[]._ver、数値以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 'dummy',
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isNumber);
        });
        test('パラメータ異常：thing[]._ver、null', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: null
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isDefined);
        });
        test('パラメータ異常：identifier、配列以外', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: {},
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.reasons[0].message).toBe(Message.validation.isArray);
        });
        test('異常：Cookieが存在するが空', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(200, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + ''])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答204', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(204, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答400系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(400, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type1_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：Cookie使用、オペレータサービス応答500系', async () => {
            // スタブサーバー起動
            _operatorServer = new StubOperatorServerType0(503, 0);
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_TAKE_SESSION);
        });
        test('異常：セッション(オペレータサービス未起動)', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set('Cookie', ['operator_type2_session=' + 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296'])
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_OPERATOR);
        });
        test('異常：セッションなし', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.NOT_AUTHORIZED);
        });
        test('異常：セッション（Book管理サービスエラー応答400系）', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(400, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(400);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：セッション（Book管理サービスエラー応答500系）', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(503, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：セッション（Book管理サービスエラー応答204）', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(204, 0);
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(401);
            expect(response.body.message).toBe(Message.FAILED_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：セッション（Book管理サービス未起動）', async () => {
            // スタブサーバー起動
            _proxyServer = new StubProxyServer(3003, 200);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(503);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_BOOK_MANAGE_TEMPSHARECODECOOPERATE);
        });
        test('異常：セッション（プロキシサービスエラー応答400系）', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(200, 0);
            _proxyServer = new StubProxyServer(3003, 400);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_LINKAGE);
        });
        test('異常：セッション（プロキシサービス未起動）', async () => {
            // スタブサーバー起動
            _bookManageServer = new StubBookManageServer(200, 0);

            // 対象APIに送信
            const response = await supertest(expressApp).post(Url.ShareByTempShereCodeURI)
                .set({ accept: 'application/json', 'Content-Type': 'application/json' })
                .set({ session: JSON.stringify(Session.indTemporarilyShare) })
                .send(JSON.stringify(
                    {
                        tempShareCode: 'e9f4ecfa-97b0-4922-9b55-2b555438779e',
                        updatedAt: {
                            start: '2020-01-01T00:00:00.000+0900',
                            end: '2020-03-01T00:00:00.000+0900'
                        },
                        identifier: [],
                        document: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        event: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ],
                        thing: [
                            {
                                _value: 1001010,
                                _ver: 1
                            }
                        ]
                    }));

            // レスポンスチェック
            expect(response.status).toBe(500);
            expect(response.body.message).toBe(Message.FAILED_CONNECT_TO_LINKAGE_SERVICE);
        });
    });
});
