/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import bodyParser = require('body-parser');

/**
 * 外部蓄積サービス
 */
export default class StubOutsideStoreServer {
    _app: express.Express;
    _server: Server;

    constructor (status: number, type?: number) {
        this._app = express();

        // イベントハンドラー
        // 利用者ID連携
        const _listener = (req: express.Request, res: express.Response) => {
            if (status === 200) {
                if (!type) {
                    // 通常 typeが設定されていない
                    let _document: {}[];
                    let _event: {}[];
                    let _thing: {}[];
                    if (req.body.documentIdentifier && req.body.documentIdentifier[0] === 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6') {
                        _document = [
                            {
                                id: {
                                    index: '2_1_1',
                                    value: 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                },
                                code: {
                                    index: '2_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                createAt: {
                                    index: '2_2_1',
                                    value: '2020-02-20T00:00:00.000+0900'
                                },
                                sourceId: '202108-1-1',
                                app: null,
                                wf: {
                                    code: {
                                        index: '2_3_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '2_3_2',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '2_3_3',
                                        value: {
                                            _value: 1000005,
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
                                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        ],
                                        sourceId: ['202108-1-1']
                                    }
                                ]
                            }
                        ];
                    } else if (req.body.documentIdentifier && req.body.documentIdentifier[0] === 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0') {
                        _document = [
                            {
                                id: {
                                    index: '2_1_1',
                                    value: 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '2_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                createAt: {
                                    index: '2_2_1',
                                    value: '2020-02-20T00:00:00.000+0900'
                                },
                                sourceId: '202108-1-1',
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    }
                                },
                                wf: null,
                                chapter: [
                                    {
                                        title: 'タイトル１',
                                        event: [
                                            'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        ],
                                        sourceId: ['202108-1-1']
                                    }
                                ]
                            }
                        ];
                    }
                    if (req.body.eventIdentifier && req.body.eventIdentifier[0] === 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6') {
                        _event = [
                            {
                                id: {
                                    index: '3_1_1',
                                    value: 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                },
                                code: {
                                    index: '3_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                start: {
                                    index: '3_2_1',
                                    value: '2020-02-20T00:00:00.000+0900'
                                },
                                end: {
                                    index: '3_2_2',
                                    value: '2020-02-21T00:00:00.000+0900'
                                },
                                location: {
                                    index: '3_3_1',
                                    value: 'location'
                                },
                                sourceId: '202108-1-1',
                                env: null,
                                app: null,
                                wf: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '3_5_2',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '3_5_3',
                                        value: {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    },
                                    staffId: {
                                        index: '3_5_4',
                                        value: 'staffId'
                                    }
                                },
                                thing: [
                                    {
                                        id: {
                                            index: '4_1_1',
                                            value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        },
                                        code: {
                                            index: '4_1_2',
                                            value: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        },
                                        sourceId: '202108-1',
                                        env: null,
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
                                        },
                                        acquired_time: {
                                            index: '4_2_2_4',
                                            value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                        }
                                    },
                                    {
                                        id: {
                                            index: '4_1_1',
                                            value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        },
                                        code: {
                                            index: '4_1_2',
                                            value: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        },
                                        sourceId: '20200221-1',
                                        env: null,
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
                                        },
                                        acquired_time: {
                                            index: '4_2_2_4',
                                            value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                        }
                                    }
                                ]
                            }
                        ];
                    } else if (req.body.eventIdentifier && req.body.eventIdentifier[0] === 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0') {
                        _event = [
                            {
                                id: {
                                    index: '3_1_1',
                                    value: 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '3_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                start: {
                                    index: '3_2_1',
                                    value: '2020-02-20T00:00:00.000+0900'
                                },
                                end: {
                                    index: '3_2_2',
                                    value: '2020-02-21T00:00:00.000+0900'
                                },
                                location: {
                                    index: '3_3_1',
                                    value: 'location'
                                },
                                sourceId: '202108-1-1',
                                env: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    }
                                },
                                wf: null,
                                thing: [
                                    {
                                        id: {
                                            index: '4_1_1',
                                            value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        },
                                        code: {
                                            index: '4_1_2',
                                            value: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        },
                                        sourceId: '202108-1',
                                        env: null,
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
                                        },
                                        acquired_time: {
                                            index: '4_2_2_4',
                                            value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                        }
                                    },
                                    {
                                        id: {
                                            index: '4_1_1',
                                            value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                        },
                                        code: {
                                            index: '4_1_2',
                                            value: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        },
                                        sourceId: '20200221-1',
                                        env: null,
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
                                        },
                                        acquired_time: {
                                            index: '4_2_2_4',
                                            value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                        }
                                    }
                                ]
                            }
                        ];
                    }
                    if (req.body.thingIdentifier && req.body.thingIdentifier[0] === 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6') {
                        _thing = [
                            {
                                id: {
                                    index: '4_1_1',
                                    value: 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '202108-1',
                                env: null,
                                app: null,
                                wf: {
                                    code: {
                                        index: '4_5_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    wf: {
                                        index: '4_5_2',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    },
                                    role: {
                                        index: '4_5_3',
                                        value: {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    },
                                    staffId: {
                                        index: '4_5_4',
                                        value: 'staffId'
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
                                },
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                }
                            }
                        ];
                    } else if (req.body.thingIdentifier && req.body.thingIdentifier[0] === 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0') {
                        _thing = [
                            {
                                id: {
                                    index: '4_1_1',
                                    value: 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0'
                                },
                                code: {
                                    index: '4_1_2',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                },
                                sourceId: '202108-1',
                                env: null,
                                app: {
                                    code: {
                                        index: '3_5_1',
                                        value: {
                                            _value: 1000004,
                                            _ver: 1
                                        }
                                    },
                                    app: {
                                        index: '3_5_5',
                                        value: {
                                            _value: 1000007,
                                            _ver: 1
                                        }
                                    }
                                },
                                wf: null,
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
                                },
                                acquired_time: {
                                    index: '4_2_2_4',
                                    value: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu'
                                }
                            }
                        ];
                    }
                    res.json({
                        document: _document,
                        event: _event,
                        thing: _thing
                    });
                } else if (type === 1) {
                    res.json({});
                }
            }
            res.status(status).end();
        };
        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.use(bodyParser.json());
        this._app.post('/outsideStoreService', _listener);
        this._server = this._app.listen(3033);
    }
}
