/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/* eslint-disable */
import { Server } from 'net';
/* eslint-enable */
import * as express from 'express';
import { ResponseCode } from '../common/ResponseCode';
import bodyParser = require('body-parser');

export default class StubCatalogServer {
    _app: express.Express;
    _server: Server;
    constructor (port: number, code: number, status: number) {
        // イベントハンドラー
        const _listener2 = (req: express.Request, res: express.Response) => {
            res.status(status).json({
                ext_name: 'test-org'
            });
        };

        const _listener3 = (req: express.Request, res: express.Response) => {
            const ns = req.query['ns'];
            res.status(status);
            if (ns === 'catalog/ext/test-org/actor/wf/actor_1000020/store') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            }
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            store: [
                                {
                                    id: '5589c2b6-e79b-eb17-c78b-8a9f4425a737',
                                    role: null,
                                    event: [
                                        {
                                            code: {
                                                _value: 1000811,
                                                _ver: 1
                                            },
                                            requireConsent: true,
                                            thing: [
                                                {
                                                    code: {
                                                        _value: 1000814,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000815,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000816,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000817,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000818,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000819,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            store: [
                                {
                                    id: '5589c2b6-e79b-eb17-c78b-8a9f4425a737',
                                    role: [
                                        {
                                            _value: 222222,
                                            _ver: 1
                                        }
                                    ],
                                    event: [
                                        {
                                            code: {
                                                _value: 1000811,
                                                _ver: 1
                                            },
                                            requireConsent: true,
                                            thing: [
                                                {
                                                    code: {
                                                        _value: 1000814,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000815,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000816,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000817,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000818,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000819,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/store',
                            name: '外来診療が蓄積可能なデータ',
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            inherit: {
                                _value: 44,
                                _ver: 1
                            },
                            description: '外来診療が蓄積可能なデータ定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000489,
                                _ver: 1
                            },
                            store: [
                                {
                                    id: '5589c2b6-e79b-eb17-c78b-8a9f4425a737',
                                    role: [
                                        {
                                            _value: 1,
                                            _ver: 1
                                        }
                                    ],
                                    event: [
                                        {
                                            code: {
                                                _value: 1000811,
                                                _ver: 1
                                            },
                                            requireConsent: true,
                                            thing: [
                                                {
                                                    code: {
                                                        _value: 1000814,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000815,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000816,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000817,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000818,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                },
                                                {
                                                    code: {
                                                        _value: 1000819,
                                                        _ver: 1
                                                    },
                                                    requireConsent: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'store',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Store',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '蓄積定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000020/workflow') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/workflow',
                            name: '外来診療',
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            inherit: {
                                _value: 46,
                                _ver: 1
                            },
                            description: '外来診療の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            'information-site': null,
                            'region-alliance': null,
                            share: [
                                {
                                    _value: 1000485,
                                    _ver: 1
                                },
                                {
                                    _value: 1000486,
                                    _ver: 1
                                }
                            ],
                            store: null
                        },
                        prop: [
                            {
                                key: 'information-site',
                                type: {
                                    of: 'string',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: 'ワークフローの情報サイト',
                                isInherit: true
                            },
                            {
                                key: 'region-alliance',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 48,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: '参加している領域運営サービスプロバイダーのリージョンコード配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 45,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが提供する状態共有機能の定義',
                                isInherit: true
                            },
                            {
                                key: 'store',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 44,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが蓄積可能なデータの定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/workflow',
                            name: '外来診療',
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            inherit: {
                                _value: 46,
                                _ver: 1
                            },
                            description: '外来診療の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            'information-site': null,
                            'region-alliance': null,
                            share: [
                                {
                                    _value: 1000485,
                                    _ver: 1
                                },
                                {
                                    _value: 1000486,
                                    _ver: 1
                                }
                            ],
                            store: [
                                {
                                    _value: 222222222,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'information-site',
                                type: {
                                    of: 'string',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: 'ワークフローの情報サイト',
                                isInherit: true
                            },
                            {
                                key: 'region-alliance',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 48,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: '参加している領域運営サービスプロバイダーのリージョンコード配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 45,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが提供する状態共有機能の定義',
                                isInherit: true
                            },
                            {
                                key: 'store',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 44,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが蓄積可能なデータの定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    },
                    {
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000020/workflow',
                            name: '外来診療',
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            inherit: {
                                _value: 46,
                                _ver: 1
                            },
                            description: '外来診療の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000481,
                                _ver: 1
                            },
                            'information-site': null,
                            'region-alliance': null,
                            share: [
                                {
                                    _value: 1000485,
                                    _ver: 1
                                },
                                {
                                    _value: 1000486,
                                    _ver: 1
                                }
                            ],
                            store: [
                                {
                                    _value: 1000489,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'information-site',
                                type: {
                                    of: 'string',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: 'ワークフローの情報サイト',
                                isInherit: true
                            },
                            {
                                key: 'region-alliance',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 48,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: '参加している領域運営サービスプロバイダーのリージョンコード配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 45,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが提供する状態共有機能の定義',
                                isInherit: true
                            },
                            {
                                key: 'store',
                                type: {
                                    of: 'code[]',
                                    cmatrix: null,
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 44,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: 'ワークフローが蓄積可能なデータの定義',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000001/share') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/actor_1000001/share',
                            name: '共有定義テスト（operator）',
                            description: '共有定義テスト（operator）',
                            _code: {
                                _value: 1000200,
                                _ver: 1
                            },
                            inherit: {
                                _value: 45,
                                _ver: null
                            }
                        },
                        template: {
                            share: [
                                {
                                    id: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    document: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    event: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    thing: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000400/share') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/actor_1000400/share',
                            name: '共有定義テスト（dest.actor）',
                            description: '共有定義テスト（dest.actor）',
                            _code: {
                                _value: 1000201,
                                _ver: 1
                            },
                            inherit: {
                                _value: 45,
                                _ver: null
                            }
                        },
                        template: {
                            share: [
                                {
                                    id: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    document: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    event: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    thing: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000401/share') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/actor_1000401/share',
                            name: '共有定義テスト（dest.actor）',
                            description: '共有定義テスト（dest.actor）',
                            _code: {
                                _value: 1000202,
                                _ver: 1
                            },
                            inherit: {
                                _value: 45,
                                _ver: null
                            }
                        },
                        template: {
                            share: [
                                {
                                    id: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    document: [
                                        {
                                            code: {
                                                _value: 1000009,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    event: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ],
                                    thing: [
                                        {
                                            code: {
                                                _value: 1000008,
                                                _ver: 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000403/share') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/actor_1000403/share',
                            name: '共有定義テスト（dest.actor）',
                            description: '共有定義テスト（dest.actor）',
                            _code: {
                                _value: 1000203,
                                _ver: 1
                            },
                            inherit: {
                                _value: 45,
                                _ver: null
                            }
                        },
                        template: {
                            share: [
                                {
                                    id: 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu',
                                    role: [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        }
                                    ],
                                    document: [],
                                    event: [],
                                    thing: []
                                }
                            ]
                        }
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000404/share') {
                res.status(status).json([
                    {
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/actor_1000403/share',
                            name: '共有定義テスト（dest.actor）',
                            description: '共有定義テスト（dest.actor）',
                            _code: {
                                _value: 1000204,
                                _ver: 1
                            },
                            inherit: {
                                _value: 45,
                                _ver: null
                            }
                        },
                        template: {
                            share: []
                        }
                    }
                ]);
            } else if (ns === 'catalog/ext/test-org/actor/wf/actor_1000405/share') {
                res.status(status).json([]);
            }
            res.end();
        };

        const _listener = (req: express.Request, res: express.Response) => {
            const catalogItemCode = parseInt(req.params.catalogItemCode);
            if (status === ResponseCode.OK) {
                if (code === 1000001) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/pxr-root',
                            name: '流通制御組織',
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 1000003) {
                    // 正常(pxr-root)
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/pxr-root',
                            name: '流通制御組織',
                            _code: {
                                _value: 1000003,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000003,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 1000020) {
                    // 正常(data-trader)
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/data-trader',
                            name: 'データ取引組織',
                            _code: {
                                _value: 1000020,
                                _ver: 1
                            },
                            inherit: {
                                _value: 38,
                                _ver: 1
                            },
                            description: 'データ取引組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000020,
                                _ver: 1
                            },
                            category: null,
                            'certify-consumer': true,
                            'consumer-alliance': [
                                {
                                    _value: 1000114,
                                    _ver: 1
                                }
                            ],
                            'create-book': true,
                            'main-block': {
                                _value: 1000109,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-alliance': [
                                {
                                    _value: 1000002,
                                    _ver: 1
                                }
                            ],
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: {
                                        _value: 1000001,
                                        _ver: 1
                                    },
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'certify-consumer',
                                type: {
                                    of: 'boolean'
                                },
                                description: 'Consumer認定権限有無'
                            },
                            {
                                key: 'consumer-alliance',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 37,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: '提携しているデータコンシューマーコード配列'
                            },
                            {
                                key: 'create-book',
                                type: {
                                    of: 'boolean'
                                },
                                description: 'Book開設権限有無'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-alliance',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 49,
                                            _ver: 1
                                        }
                                    }
                                },
                                description: '提携している領域運営サービスプロバイダーコード配列'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 1000109) {
                    // 異常(data-trader、create-bookなし)
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/block/data-trader',
                            name: 'Data-Trader-Block',
                            _code: {
                                _value: 1000109,
                                _ver: 1
                            },
                            inherit: {
                                _value: 33,
                                _ver: null
                            },
                            description: 'データ取引サービスプロバイダー用PXR-Blockの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000109,
                                _ver: 1
                            },
                            'actor-type': 'pxr-root',
                            'assigned-organization': 'データ取引組織',
                            'assignment-status': 'assigned',
                            'base-url': '<未定>',
                            id: 'Data-Trader-01'
                        },
                        prop: [
                            {
                                key: 'actor-type',
                                type: {
                                    of: 'string',
                                    format: null,
                                    unit: null,
                                    candidata: {
                                        value: [
                                            'pxr-root',
                                            'region-root',
                                            'app',
                                            'wf',
                                            'data-trader',
                                            'consumer'
                                        ]
                                    }
                                },
                                description: 'このPXR-Blockを保有する組織の種別'
                            },
                            {
                                key: 'assigned-organization',
                                type: {
                                    of: 'string',
                                    format: null,
                                    unit: null
                                },
                                description: '割当アクター名'
                            },
                            {
                                key: 'assignment-status',
                                type: {
                                    of: 'string',
                                    format: null,
                                    unit: null,
                                    candidata: {
                                        value: [
                                            'assigned',
                                            'unassigned'
                                        ]
                                    }
                                },
                                description: '割当状態'
                            },
                            {
                                key: 'base-url',
                                type: {
                                    of: 'string',
                                    format: null,
                                    unit: null
                                },
                                description: 'PXR-BlockのベースURL'
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string',
                                    format: null,
                                    unit: null
                                },
                                description: 'PXR-Block識別子'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 1000005) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 1000006) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 1000016) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 1000007) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            event: null,
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 1) {
                    // 異常(pxr-root、data-trader以外)
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/model/dummy',
                            name: 'ユニットテスト',
                            _code: {
                                _value: 1,
                                _ver: 1
                            },
                            inherit: null,
                            description: null
                        },
                        template: null,
                        prop: null,
                        attribute: null
                    });
                } else if (code === 2) {
                    // 異常(catalogItemがnull)
                    res.status(ResponseCode.OK).json({
                        catalogItem: null,
                        template: null,
                        prop: null,
                        attribute: null
                    });
                } else if (code === 3) {
                    // 異常(利用者作成時にtemplate.workflowに該当データなし)
                    res.status(ResponseCode.OK).json({
                        catalogItem: null,
                        template: {
                            workflow: [
                                {
                                    _value: 1000000,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: null,
                        attribute: null
                    });
                } else if (code === 4) {
                    // 異常(利用者作成時にtemplate.applicationなし)
                    res.status(ResponseCode.OK).json({
                        catalogItem: null,
                        template: {
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: null,
                        attribute: null
                    });
                } else if (code === 5) {
                    // 異常(利用者作成時にtemplate.applicationに該当データなし)
                    res.status(ResponseCode.OK).json({
                        catalogItem: null,
                        template: {
                            application: [
                                {
                                    _value: 10000000,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: null,
                        attribute: null
                    });
                } else if (code === 6) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1,
                                    _ver: 1
                                }
                            ],
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 16) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1,
                                    _ver: 1
                                }
                            ],
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            1
                        ]
                    });
                } else if (code === 26) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    _value: 1,
                                    _ver: 1
                                }
                            ],
                            event: null,
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 7) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: null,
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 9000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 17) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 9000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 8) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 81) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 18) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: [
                                {
                                    _value: 1000000,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': []
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 19) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: [
                                {
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': []
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 20) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: [
                                {
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000000,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 9) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'XXXXX',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 91) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: null
                    });
                } else if (code === 92) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'XXXXX',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 1000503) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/test-org/actor/wf/actor_1000004/share',
                            'name': '状態共有機能',
                            '_code': {
                                '_value': 1000502,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 45,
                                '_ver': 1
                            },
                            'description': 'テスト用ワークフローの状態共有機能です。'
                        },
                        'template': {
                            '_code': {
                                '_value': 1000502,
                                '_ver': 1
                            },
                            'share': [
                                {
                                    'role': [
                                        {
                                            '_value': 1000005,
                                            '_ver': 1
                                        }
                                    ],
                                    'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                    'document':
                                    {
                                        'code': {
                                            '_value': 1000823,
                                            '_ver': 1
                                        },
                                        'sourceActor': [
                                            {
                                                '_value': 1000020,
                                                '_ver': 1
                                            },
                                            {
                                                '_value': 1000004,
                                                '_ver': 1
                                            }
                                        ]
                                    }
                                    ,
                                    'event': [
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            },
                                            'sourceActor': [
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                }
                                            ],
                                            'thing': [
                                                {
                                                    'code': {
                                                        '_value': 1000815,
                                                        '_ver': 1
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    'thing': [
                                        {
                                            'code': {
                                                '_value': 1000815,
                                                '_ver': 1
                                            },
                                            'sourceActor': [
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        'prop': [
                            {
                                'key': 'share',
                                'type': {
                                    'of': 'inner[]',
                                    'inner': 'Share',
                                    'cmatrix': null,
                                    'candidate': null
                                },
                                'description': '共有定義',
                                'isInherit': true
                            }
                        ],
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (code === 1000504) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/test-org/actor/wf/actor_1000004/share',
                            'name': '状態共有機能',
                            '_code': {
                                '_value': 1000504,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 45,
                                '_ver': 1
                            },
                            'description': 'テスト用ワークフローの状態共有機能です。'
                        },
                        'template': {
                            '_code': {
                                '_value': 1000504,
                                '_ver': 1
                            },
                            'share': [
                                {
                                    'role': [
                                        {
                                            '_value': 1000005,
                                            '_ver': 1
                                        }
                                    ],
                                    'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                    'document': [
                                        {
                                            'code': {
                                                '_value': 1000823,
                                                '_ver': 1
                                            },
                                            'sourceActor': [
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000004,
                                                    '_ver': 1
                                                }
                                            ]
                                        }
                                    ],
                                    'event': [
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            },
                                            'sourceActor': [
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000004,
                                                    '_ver': 1
                                                }
                                            ]
                                        }
                                    ],
                                    'thing': [
                                        {
                                            'code': {
                                                '_value': 1000814,
                                                '_ver': 1
                                            },
                                            'sourceActor': [
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000020,
                                                    '_ver': 1
                                                },
                                                {
                                                    '_value': 1000004,
                                                    '_ver': 1
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    'role': [
                                        {
                                            '_value': 1000005,
                                            '_ver': 1
                                        }
                                    ],
                                    'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                    'document': [
                                        {
                                            'code': {
                                                '_value': 1000823,
                                                '_ver': 1
                                            }
                                        }
                                    ],
                                    'event': [
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            }
                                        }
                                    ],
                                    'thing': [
                                        {
                                            'code': {
                                                '_value': 1000815,
                                                '_ver': 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        'prop': [
                            {
                                'key': 'share',
                                'type': {
                                    'of': 'inner[]',
                                    'inner': 'Share',
                                    'cmatrix': null,
                                    'candidate': null
                                },
                                'description': '共有定義',
                                'isInherit': true
                            }
                        ],
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (code === 1001355) {
                    /* eslint-disable */
                    res.json({
                        "catalogItem": {
                            "ns": "catalog/ext/test-org/actor/wf/actor_1000438/share",
                            "name": "共有定義１＿金テストverup",
                            "_code": {
                                "_value": 1001355,
                                "_ver": 1
                            },
                            "inherit": {
                                "_value": 45,
                                "_ver": 1
                            },
                            "description": {
                                "title": null,
                                "section": [
                                    {
                                        "title": "タイトル",
                                        "content": [
                                            {
                                                "sentence": "test"
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        "template": {
                            "_code": {
                                "_value": 1001355,
                                "_ver": 1
                            },
                            "share": [
                                {
                                    "id": "c9d3d3ba-7a38-4725-9025-0a4d5f7426e1",
                                    "role": [
                                        {
                                            "_value": 1001193,
                                            "_ver": 1
                                        }
                                    ],
                                    "document": [
                                        {
                                            "code": {
                                                "_value": 1001272,
                                                "_ver": 1
                                            },
                                            "requireConsent": true,
                                            "sourceActor": [
                                                {
                                                    "_value": 1001021,
                                                    "_ver": 17
                                                }
                                            ]
                                        }
                                    ],
                                    "event": [
                                        {
                                            "code": {
                                                "_value": 1001027,
                                                "_ver": 5
                                            },
                                            "thing": [
                                                {
                                                    "code": {
                                                        "_value": 1001025,
                                                        "_ver": 2
                                                    },
                                                    "requireConsent": true
                                                },
                                                {
                                                    "code": {
                                                        "_value": 1001062,
                                                        "_ver": 1
                                                    },
                                                    "requireConsent": true
                                                }
                                            ],
                                            "requireConsent": true,
                                            "sourceActor": [
                                                {
                                                    "_value": 1001021,
                                                    "_ver": 17
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        "prop": [
                            {
                                "key": "share",
                                "type": {
                                    "of": "inner[]",
                                    "inner": "Share",
                                    "cmatrix": null,
                                    "candidate": null
                                },
                                "description": "状態共有機能定義",
                                "isInherit": true
                            }
                        ],
                        "value": [
                            {
                                "key": "share",
                                "value": [
                                    {
                                        "key": "id",
                                        "value": "c9d3d3ba-7a38-4725-9025-0a4d5f7426e1"
                                    },
                                    {
                                        "key": "role",
                                        "value": [
                                            {
                                                "key": "_value",
                                                "value": 1001193
                                            },
                                            {
                                                "key": "_ver",
                                                "value": 1
                                            }
                                        ]
                                    },
                                    {
                                        "key": "document",
                                        "value": [
                                            {
                                                "key": "code",
                                                "value": [
                                                    {
                                                        "key": "_value",
                                                        "value": 1001272
                                                    },
                                                    {
                                                        "key": "_ver",
                                                        "value": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "requireConsent",
                                                "value": true
                                            },
                                            {
                                                "key": "sourceActor",
                                                "value": [
                                                    {
                                                        "key": "_value",
                                                        "value": "1001021"
                                                    },
                                                    {
                                                        "key": "_ver",
                                                        "value": "17"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "key": "event",
                                        "value": [
                                            {
                                                "key": "code",
                                                "value": [
                                                    {
                                                        "key": "_value",
                                                        "value": 1001027
                                                    },
                                                    {
                                                        "key": "_ver",
                                                        "value": 5
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "thing",
                                                "value": [
                                                    {
                                                        "key": "code",
                                                        "value": [
                                                            {
                                                                "key": "_value",
                                                                "value": 1001025
                                                            },
                                                            {
                                                                "key": "_ver",
                                                                "value": 2
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "requireConsent",
                                                        "value": true
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "thing",
                                                "value": [
                                                    {
                                                        "key": "code",
                                                        "value": [
                                                            {
                                                                "key": "_value",
                                                                "value": 1001026
                                                            },
                                                            {
                                                                "key": "_ver",
                                                                "value": 2
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "requireConsent",
                                                        "value": true
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "thing",
                                                "value": [
                                                    {
                                                        "key": "code",
                                                        "value": [
                                                            {
                                                                "key": "_value",
                                                                "value": 1001062
                                                            },
                                                            {
                                                                "key": "_ver",
                                                                "value": 1
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "key": "requireConsent",
                                                        "value": true
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "requireConsent",
                                                "value": true
                                            },
                                            {
                                                "key": "sourceActor",
                                                "value": [
                                                    {
                                                        "key": "_value",
                                                        "value": "1001021"
                                                    },
                                                    {
                                                        "key": "_ver",
                                                        "value": "17"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "attribute": null
                    });
                    /* eslint-enable */
                } else if (code === 1000505) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/test-org/actor/wf/actor_1000004/share',
                            'name': '状態共有機能',
                            '_code': {
                                '_value': 1000505,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 45,
                                '_ver': 1
                            },
                            'description': 'テスト用ワークフローの状態共有機能です。'
                        },
                        'template': {
                            '_code': {
                                '_value': 1000504,
                                '_ver': 1
                            },
                            'share': [
                                {
                                    'role': [
                                        {
                                            '_value': 1000005,
                                            '_ver': 1
                                        }
                                    ],
                                    'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                    'document': [
                                        {
                                            'code': {
                                                '_value': 1000823,
                                                '_ver': 1
                                            }
                                        },
                                        {
                                            'code': {
                                                '_value': 1000823,
                                                '_ver': 1
                                            }
                                        }
                                    ],
                                    'event': [
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            },
                                            'thing': [
                                                {
                                                    'code': {
                                                        '_value': 1000815,
                                                        '_ver': 1
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            },
                                            'thing': [
                                                {
                                                    'code': {
                                                        '_value': 1000815,
                                                        '_ver': 1
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    'thing': [
                                        {
                                            'code': {
                                                '_value': 1000814,
                                                '_ver': 1
                                            }
                                        },
                                        {
                                            'code': {
                                                '_value': 1000814,
                                                '_ver': 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        'prop': [
                            {
                                'key': 'share',
                                'type': {
                                    'of': 'inner[]',
                                    'inner': 'Share',
                                    'cmatrix': null,
                                    'candidate': null
                                },
                                'description': '共有定義',
                                'isInherit': true
                            }
                        ],
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (code === 1000506) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/share/trigger',
                            'name': '診療申込受付機能_共有トリガー',
                            'description': '診療申込受付機能の状態共有機能に関する共有トリガーの定義です',
                            '_code': {
                                '_value': 1000506,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 216,
                                '_ver': null
                            }
                        },
                        'template': {
                            'prop': null,
                            'share': {
                                '_value': 1000501,
                                '_ver': 1
                            },
                            'id': ['39a03074-856e-5daa-d792-9d672bb9c7ed'],
                            'startCondition': {
                                'document': null,
                                'event': null,
                                'thing': null,
                                'period': {
                                    'specification': 'spacification',
                                    'unit': 'minut',
                                    'value': 10
                                },
                                'decisionAPI': {
                                    '_value': 9999999,
                                    '_ver': 1
                                }
                            },
                            'endCondition': {
                                'document': null,
                                'event': null,
                                'thing': null,
                                'period': {
                                    'specification': 'spacification',
                                    'unit': 'minut',
                                    'value': 10
                                },
                                'decisionAPI': {
                                    '_value': 9999999,
                                    '_ver': 1
                                }
                            }
                        },
                        'inner': null,
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (catalogItemCode === 1000373) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/test-org/person/user-information',
                            'name': '利用者情報',
                            '_code': {
                                '_value': 1000373,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 106,
                                '_ver': 1
                            },
                            'description': '組織で利用する利用者情報の定義です。'
                        },
                        'template': {
                            '_code': {
                                '_value': 1000373,
                                '_ver': 1
                            },
                            'item-group': [
                                {
                                    'title': '氏名',
                                    'item': [
                                        {
                                            'title': '姓',
                                            'type': {
                                                '_value': 30019,
                                                '_ver': 1
                                            },
                                            'content': null
                                        },
                                        {
                                            'title': '名',
                                            'type': {
                                                '_value': 30020,
                                                '_ver': 1
                                            },
                                            'content': null
                                        },
                                        {
                                            'title': '姓',
                                            'type': {
                                                '_value': 30019,
                                                '_ver': 1
                                            },
                                            'content': null
                                        },
                                        {
                                            'title': '名',
                                            'type': {
                                                '_value': 30020,
                                                '_ver': 1
                                            },
                                            'content': null
                                        }
                                    ]
                                },
                                {
                                    'title': '性別',
                                    'item': [
                                        {
                                            'title': '性別',
                                            'type': {
                                                '_value': 30021,
                                                '_ver': 1
                                            },
                                            'content': null
                                        }
                                    ]
                                },
                                {
                                    'title': '生年（西暦）',
                                    'item': [
                                        {
                                            'title': '生年（西暦）',
                                            'type': {
                                                '_value': 1000372,
                                                '_ver': 1
                                            },
                                            'content': null
                                        }
                                    ]
                                },
                                {
                                    'title': '住所（行政区）',
                                    'item': [
                                        {
                                            'title': '住所（行政区）',
                                            'type': {
                                                '_value': 1000371,
                                                '_ver': 1
                                            },
                                            'content': null
                                        }
                                    ]
                                },
                                {
                                    'title': '連絡先電話番号',
                                    'item': [
                                        {
                                            'title': '連絡先電話番号',
                                            'type': {
                                                '_value': 30036,
                                                '_ver': 1
                                            },
                                            'content': null
                                        }
                                    ]
                                }
                            ]
                        },
                        'prop': [
                            {
                                'key': 'item-group',
                                'type': {
                                    'of': 'inner[]',
                                    'inner': 'ItemGroup',
                                    'cmatrix': null,
                                    'candidate': null
                                },
                                'description': '個人属性グループの配列'
                            }
                        ],
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (catalogItemCode === 1000510) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000438/share/trigger',
                            'name': '診療申込受付機能_共有トリガー',
                            'description': '診療申込受付機能の状態共有機能に関する共有トリガーの定義です',
                            '_code': {
                                '_value': 1000510,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 216,
                                '_ver': null
                            }
                        },
                        'template': {
                            'prop': null,
                            'share': {
                                '_value': 1000501,
                                '_ver': 1
                            },
                            'id': ['39a03074-856e-5daa-d792-9d672bb9c7ed'],
                            'startCondition': {
                                'document': [
                                    {
                                        'code': {
                                            '_value': 1000823,
                                            '_ver': 1
                                        }
                                    }
                                ],
                                'event': [
                                    {
                                        'code': {
                                            '_value': 1000811,
                                            '_ver': 1
                                        },
                                        'thing': [
                                            {
                                                'code': {
                                                    '_value': 1000814,
                                                    '_ver': 1
                                                }
                                            }
                                        ]
                                    }
                                ],
                                'thing': [
                                    {
                                        'code': {
                                            '_value': 1000815,
                                            '_ver': 1
                                        }
                                    }
                                ],
                                'period': {
                                    'specification': 'spacification',
                                    'unit': 'minut',
                                    'value': 10
                                },
                                'decisionAPI': {
                                    '_value': 9999999,
                                    '_ver': 1
                                }
                            },
                            'endCondition': {
                                'document': [
                                    {
                                        'code': {
                                            '_value': 1000823,
                                            '_ver': 1
                                        }
                                    }
                                ],
                                'event': [
                                    {
                                        'code': {
                                            '_value': 1000811,
                                            '_ver': 1
                                        },
                                        'thing': [
                                            {
                                                'code': {
                                                    '_value': 1000814,
                                                    '_ver': 1
                                                }
                                            }
                                        ]
                                    }
                                ],
                                'thing': [
                                    {
                                        'code': {
                                            '_value': 1000815,
                                            '_ver': 1
                                        }
                                    }
                                ],
                                'period': {
                                    'specification': 'spacification',
                                    'unit': 'minut',
                                    'value': 10
                                },
                                'decisionAPI': {
                                    '_value': 9999999,
                                    '_ver': 1
                                }
                            }
                        },
                        'inner': null,
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (catalogItemCode === 1000501) {
                    /* eslint-disable */
                    res.json({
                        'catalogItem': {
                            'ns': 'catalog/ext/test-org/actor/wf/actor_1000004/share',
                            'name': '状態共有機能',
                            '_code': {
                                '_value': 1000501,
                                '_ver': 1
                            },
                            'inherit': {
                                '_value': 45,
                                '_ver': 1
                            },
                            'description': 'テスト用ワークフローの状態共有機能です。'
                        },
                        'template': {
                            '_code': {
                                '_value': 1000501,
                                '_ver': 1
                            },
                            'share': [
                                {
                                    'role': [
                                        {
                                            '_value': 1000005,
                                            '_ver': 1
                                        }
                                    ],
                                    'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                    'document': [
                                        {
                                            'code': {
                                                '_value': 1000823,
                                                '_ver': 1
                                            }
                                        }
                                    ],
                                    'event': [
                                        {
                                            'code': {
                                                '_value': 1000811,
                                                '_ver': 1
                                            },
                                            'thing': [
                                                {
                                                    'code': {
                                                        '_value': 1000815,
                                                        '_ver': 1
                                                    }
                                                }
                                            ]
                                        }
                                    ],
                                    'thing': [
                                        {
                                            'code': {
                                                '_value': 1000815,
                                                '_ver': 1
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        'prop': [
                            {
                                'key': 'share',
                                'type': {
                                    'of': 'inner[]',
                                    'inner': 'Share',
                                    'cmatrix': null,
                                    'candidate': null
                                },
                                'description': '共有定義',
                                'isInherit': true
                            }
                        ],
                        'attribute': null
                    });
                    /* eslint-enable */
                } else if (catalogItemCode === 1000502) {
                    if (req.query['includeDeleted'] === 'true') {
                        /* eslint-disable */
                        res.json({
                            'catalogItem': {
                                'ns': 'catalog/ext/test-org/actor/wf/actor_1000004/share',
                                'name': '状態共有機能',
                                '_code': {
                                    '_value': 1000502,
                                    '_ver': 1
                                },
                                'inherit': {
                                    '_value': 45,
                                    '_ver': 1
                                },
                                'description': 'テスト用ワークフローの状態共有機能です。'
                            },
                            'template': {
                                '_code': {
                                    '_value': 1000502,
                                    '_ver': 1
                                },
                                'share': [
                                    {
                                        'role': [
                                            {
                                                '_value': 1000005,
                                                '_ver': 1
                                            }
                                        ],
                                        'id': '39a03074-856e-5daa-d792-9d672bb9c7ed',
                                        'document': [
                                            {
                                                'code': {
                                                    '_value': 1000823,
                                                    '_ver': 1
                                                },
                                                'sourceActor': [
                                                    {
                                                        '_value': 1000020,
                                                        '_ver': 1
                                                    }
                                                ]
                                            }
                                        ],
                                        'event': [
                                            {
                                                'code': {
                                                    '_value': 1000811,
                                                    '_ver': 1
                                                },
                                                'sourceActor': [
                                                    {
                                                        '_value': 1000020,
                                                        '_ver': 1
                                                    }
                                                ],
                                                'thing': [
                                                    {
                                                        'code': {
                                                            '_value': 1000815,
                                                            '_ver': 1
                                                        }
                                                    }
                                                ]
                                            }
                                        ],
                                        'thing': [
                                            {
                                                'code': {
                                                    '_value': 1000815,
                                                    '_ver': 1
                                                },
                                                'sourceActor': [
                                                    {
                                                        '_value': 1000020,
                                                        '_ver': 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            'prop': [
                                {
                                    'key': 'share',
                                    'type': {
                                        'of': 'inner[]',
                                        'inner': 'Share',
                                        'cmatrix': null,
                                        'candidate': null
                                    },
                                    'description': '共有定義',
                                    'isInherit': true
                                }
                            ],
                            'attribute': null
                        });
                        /* eslint-enable */
                    }
                } else if (catalogItemCode === 1001010) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001010,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001010,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001011) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/app/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001011,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001011,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'all',
                                    value: null,
                                    unit: null
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001012) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001012,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001012,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: null
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001013) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001013,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001013,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'period',
                                    value: 7,
                                    unit: 'days'
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: null
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001020) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001020,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: null,
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001021) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001021,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001021,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: null,
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001022) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001022,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001022,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: null,
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001023) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001023,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001023,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: null,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: null,
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001024) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001024,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001024,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: null,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: null,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001025) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001025,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001025,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001026) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001026,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001026,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001210,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001027) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001027,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001027,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: null,
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001028) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001028,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001028,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: null,
                                    value: 12,
                                    unit: 'hour'
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001029) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001029,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001029,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: null
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001030) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/wf/actor_1000004/share/trigger',
                            name: '共有トリガー定義',
                            _code: {
                                _value: 1001030,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1001030,
                                _ver: 1
                            },
                            endCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        key: 'thing',
                                                        value: [
                                                            {
                                                                key: '_value',
                                                                value: 1000009
                                                            },
                                                            {
                                                                key: '_ver',
                                                                value: 1
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: null
                                },
                                exitMethod: {
                                    specification: 'api',
                                    value: null,
                                    unit: null
                                },
                                decisionAPI: {
                                    _value: 1001209,
                                    _ver: 1
                                }
                            },
                            id: [
                                '507bff6c-4842-c3d2-a288-df88698d446e'
                            ],
                            share: {
                                _value: 1000100,
                                _ver: 1
                            },
                            startCondition: {
                                document: [
                                    {
                                        code: {
                                            _value: 1000132,
                                            _ver: 1
                                        },
                                        event: [
                                            {
                                                code: {
                                                    _value: 1000008,
                                                    _ver: 1
                                                },
                                                thing: [
                                                    {
                                                        _value: 1000009,
                                                        _ver: 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                period: {
                                    specification: 'specification',
                                    value: 12,
                                    unit: 'hour'
                                },
                                decisionAPI: {
                                    _value: 1001208,
                                    _ver: 1
                                }
                            }
                        },
                        prop: [
                            {
                                key: 'endCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'EndCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '終了条件',
                                isInherit: true
                            },
                            {
                                key: 'id',
                                type: {
                                    of: 'string[]',
                                    cmatrix: null,
                                    format: null,
                                    unit: null,
                                    candidate: null
                                },
                                description: '状態共有機能UUID配列',
                                isInherit: true
                            },
                            {
                                key: 'share',
                                type: {
                                    of: 'code',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '状態共有機能コード',
                                isInherit: true
                            },
                            {
                                key: 'startCondition',
                                type: {
                                    of: 'inner',
                                    inner: 'StartCondition',
                                    cmatrix: null,
                                    candidate: null
                                },
                                description: '開始条件',
                                isInherit: true
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1001208) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/model/actor/app/share/trigger/decision-api',
                            name: '共有トリガー判定API定義',
                            _code: {
                                _value: 1001208,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            type: 'start',
                            url: 'http://localhost:5002/share-trigger/start'
                        }
                    });
                } else if (catalogItemCode === 1001209) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/model/actor/app/share/trigger/decision-api',
                            name: '共有トリガー判定API定義',
                            _code: {
                                _value: 1001010,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            type: 'end',
                            url: 'http://localhost:5002/share-trigger/start'
                        }
                    });
                } else if (catalogItemCode === 1001210) {
                    res.json({
                        catalogItem: {
                            ns: 'catalog/model/actor/app/share/trigger/decision-api',
                            name: '共有トリガー判定API定義',
                            _code: {
                                _value: 1001210,
                                _ver: 1
                            },
                            inherit: {
                                _value: 214,
                                _ver: 1
                            },
                            description: 'アプリケーションの状態共有機能に関する共有トリガーの定義です。'
                        },
                        template: {
                            type: 'start',
                            url: null
                        }
                    });
                } else if (catalogItemCode === 1000400) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'dest.actor（テスト）',
                            _code: {
                                _value: 1000400,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000401) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'dest.actor（テスト）',
                            _code: {
                                _value: 1000401,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000403) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'dest.actor（テスト）',
                            _code: {
                                _value: 1000403,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000404) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'dest.actor（テスト）',
                            _code: {
                                _value: 1000404,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000405) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'dest.actor（テスト）',
                            _code: {
                                _value: 1000405,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000001) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/app',
                            name: 'テストアクターカタログ',
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            inherit: {
                                _value: 50,
                                _ver: 1
                            },
                            description: '流通制御組織の定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000001,
                                _ver: 1
                            },
                            'app-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの認定基準',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'アプリケーションプロバイダーの監査手順',
                                        content: {
                                            sentence: 'アプリケーションプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            category: null,
                            'consumer-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの認定基準',
                                        content: {
                                            sentence: 'データコンシューマーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データコンシューマーの監査手順',
                                        content: {
                                            sentence: 'データコンシューマーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'data-trader-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'データ取引サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: 'データ取引サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            'identification-set': [
                                {
                                    element: {
                                        _value: 30001,
                                        _ver: 1
                                    }
                                }
                            ],
                            'main-block': {
                                _value: 1000110,
                                _ver: 1
                            },
                            'other-block': null,
                            'region-root-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの認定基準',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: '領域運営サービスプロバイダーの監査手順',
                                        content: {
                                            sentence: '領域運営サービスプロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: {
                                        title: '事業概要',
                                        content: {
                                            sentence: 'データ取引組織の事業概要です。'
                                        }
                                    }
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: null,
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'store-distribution-ratio': null,
                            'supply-distribution-ratio': null,
                            'wf-cert': {
                                cert: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの認定基準',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの認定基準です。'
                                        }
                                    }
                                },
                                audit: {
                                    key: 'title',
                                    value: '',
                                    section: {
                                        title: 'ワークフロープロバイダーの監査手順',
                                        content: {
                                            sentence: 'ワークフロープロバイダーの監査手順です。'
                                        }
                                    }
                                }
                            },
                            workflow: [
                                {
                                    _value: 1000007,
                                    _ver: 1
                                }
                            ],
                            application: [
                                {
                                    _value: 1000006,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: [
                            {
                                key: 'app-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'アプリケーションプロバイダー認定'
                            },
                            {
                                key: 'category',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/category/supply/actor',
                                            'catalog/built_in/category/supply/actor',
                                            'catalog/model/category/supply/actor',
                                            'catalog/ext/test-org/category/share/actor',
                                            'catalog/built_in/category/share/actor',
                                            'catalog/model/category/share/actor'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: null
                            },
                            {
                                key: 'consumer-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データコンシューマー認定'
                            },
                            {
                                key: 'data-trader-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'データ取引サービスプロバイダー認定'
                            },
                            {
                                key: 'identification-set',
                                type: {
                                    of: 'inner[]',
                                    inner: 'Identification'
                                },
                                description: '採用した本人性確認事項の組み合わせ'
                            },
                            {
                                key: 'main-block',
                                type: {
                                    of: 'code',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: 'アクター参加時に割り当てられたPXR-Block'
                            },
                            {
                                key: 'other-block',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: null,
                                        _code: null,
                                        base: {
                                            _value: 29,
                                            _ver: null
                                        }
                                    }
                                },
                                description: '他アクターから引き継いだPXR-Blockの配列'
                            },
                            {
                                key: 'region-root-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: '領域運営サービスプロバイダー認定'
                            },
                            {
                                key: 'statement',
                                type: {
                                    of: 'item[]',
                                    candidate: {
                                        ns: null,
                                        _code: [
                                            {
                                                _value: 61,
                                                _ver: 1
                                            }
                                        ],
                                        base: null
                                    }
                                },
                                description: '組織ステートメント'
                            },
                            {
                                key: 'status',
                                type: {
                                    of: 'inner[]',
                                    inner: 'CertStatus'
                                },
                                description: '認定の履歴'
                            },
                            {
                                key: 'store-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '蓄積分配比率'
                            },
                            {
                                key: 'supply-distribution-ratio',
                                type: {
                                    of: 'inner[]',
                                    inner: 'DistributionRatio'
                                },
                                description: '提供分配比率'
                            },
                            {
                                key: 'wf-cert',
                                type: {
                                    of: 'inner',
                                    inner: 'Certification'
                                },
                                description: 'ワークフロープロバイダー認定'
                            }
                        ],
                        attribute: null
                    });
                } else if (catalogItemCode === 1000432) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/region-root',
                            name: 'aaa',
                            _code: {
                                _value: 1000432,
                                _ver: 94
                            },
                            inherit: {
                                _value: 49,
                                _ver: 1
                            },
                            description: 'aaaの定義です。'
                        },
                        template: {
                            _code: {
                                _value: 1000432,
                                _ver: 94
                            },
                            'breakaway-flg': false,
                            category: null,
                            'information-site': null,
                            'main-block': {
                                _value: 1000402,
                                _ver: 1
                            },
                            'other-block': null,
                            region: [
                                {
                                    _value: 1000451,
                                    _ver: 1
                                },
                                {
                                    _value: 1000452,
                                    _ver: 1
                                },
                                {
                                    _value: 1000453,
                                    _ver: 1
                                },
                                {
                                    _value: 1001118,
                                    _ver: 1
                                },
                                {
                                    _value: 1001120,
                                    _ver: 1
                                },
                                {
                                    _value: 1001123,
                                    _ver: 1
                                },
                                {
                                    _value: 1001138,
                                    _ver: 1
                                },
                                {
                                    _value: 1001140,
                                    _ver: 1
                                },
                                {
                                    _value: 1001142,
                                    _ver: 1
                                },
                                {
                                    _value: 1001200,
                                    _ver: 1
                                },
                                {
                                    _value: 1001227,
                                    _ver: 1
                                },
                                {
                                    _value: 1001229,
                                    _ver: 1
                                },
                                {
                                    _value: 1001231,
                                    _ver: 1
                                },
                                {
                                    _value: 1001233,
                                    _ver: 1
                                },
                                {
                                    _value: 1001239,
                                    _ver: 1
                                },
                                {
                                    _value: 1001241,
                                    _ver: 1
                                },
                                {
                                    _value: 1001243,
                                    _ver: 1
                                },
                                {
                                    _value: 1001245,
                                    _ver: 1
                                },
                                {
                                    _value: 1001247,
                                    _ver: 1
                                },
                                {
                                    _value: 1001249,
                                    _ver: 1
                                },
                                {
                                    _value: 1001251,
                                    _ver: 1
                                },
                                {
                                    _value: 1001253,
                                    _ver: 1
                                },
                                {
                                    _value: 1001255,
                                    _ver: 1
                                },
                                {
                                    _value: 1001257,
                                    _ver: 1
                                },
                                {
                                    _value: 1001259,
                                    _ver: 1
                                },
                                {
                                    _value: 1001261,
                                    _ver: 1
                                },
                                {
                                    _value: 1001263,
                                    _ver: 1
                                },
                                {
                                    _value: 1001265,
                                    _ver: 1
                                },
                                {
                                    _value: 1001267,
                                    _ver: 1
                                },
                                {
                                    _value: 1001270,
                                    _ver: 1
                                },
                                {
                                    _value: 1001272,
                                    _ver: 1
                                },
                                {
                                    _value: 1001274,
                                    _ver: 1
                                },
                                {
                                    _value: 1001276,
                                    _ver: 1
                                },
                                {
                                    _value: 1001278,
                                    _ver: 1
                                },
                                {
                                    _value: 1001280,
                                    _ver: 1
                                },
                                {
                                    _value: 1001282,
                                    _ver: 1
                                },
                                {
                                    _value: 1001284,
                                    _ver: 1
                                },
                                {
                                    _value: 1001286,
                                    _ver: 1
                                },
                                {
                                    _value: 1001288,
                                    _ver: 1
                                },
                                {
                                    _value: 1001296,
                                    _ver: 1
                                },
                                {
                                    _value: 1001315,
                                    _ver: 1
                                },
                                {
                                    _value: 1001333,
                                    _ver: 1
                                },
                                {
                                    _value: 1001339,
                                    _ver: 1
                                },
                                {
                                    _value: 1001341,
                                    _ver: 1
                                },
                                {
                                    _value: 1001387,
                                    _ver: 1
                                },
                                {
                                    _value: 1001401,
                                    _ver: 1
                                },
                                {
                                    _value: 1001404,
                                    _ver: 1
                                },
                                {
                                    _value: 1001407,
                                    _ver: 1
                                },
                                {
                                    _value: 1001411,
                                    _ver: 1
                                },
                                {
                                    _value: 1001459,
                                    _ver: 1
                                },
                                {
                                    _value: 1001463,
                                    _ver: 1
                                },
                                {
                                    _value: 1001465,
                                    _ver: 1
                                },
                                {
                                    _value: 1001475,
                                    _ver: 1
                                },
                                {
                                    _value: 1001486,
                                    _ver: 1
                                },
                                {
                                    _value: 1001488,
                                    _ver: 1
                                },
                                {
                                    _value: 1001490,
                                    _ver: 1
                                },
                                {
                                    _value: 1001494,
                                    _ver: 1
                                },
                                {
                                    _value: 1001506,
                                    _ver: 1
                                },
                                {
                                    _value: 1001508,
                                    _ver: 1
                                },
                                {
                                    _value: 1001510,
                                    _ver: 1
                                },
                                {
                                    _value: 1001531,
                                    _ver: 1
                                }
                            ],
                            statement: [
                                {
                                    title: '組織ステートメント',
                                    section: [
                                        {
                                            title: '組織ステートメント',
                                            content: [
                                                {
                                                    sentence: 'aaa地区の住民が、近隣の病院をはじめとする様々な医療・健康サービスで質の高いサービスをスムーズに受けられるように、複数の医療・ヘルスケアサービスを認定アプリケーションで連携させるサービスを企画・運営します。'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            status: [
                                {
                                    status: 'certified',
                                    by: {
                                        _value: 1000431,
                                        _ver: 1
                                    },
                                    at: '2020-01-01T00:00:00.000+0900'
                                }
                            ],
                            'trader-alliance': [
                                {
                                    _value: 1000435,
                                    _ver: 1
                                }
                            ]
                        },
                        prop: null,
                        attribute: null
                    });
                }
                res.end();
                return;
            }
            res.status(status).end();
        };

        const _listener4 = (req: express.Request, res: express.Response) => {
            if (status === ResponseCode.OK) {
                if (code === 112233) {
                    const _codes: {}[] = [];
                    for (const dataTypeCode of req.body) {
                        if (dataTypeCode._code._value === 1000008) {
                            _codes.push({
                                catalogItem: {
                                    ns: '/event',
                                    _code: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            });
                            _codes.push({
                                catalogItem: {
                                    ns: '/thing',
                                    _code: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            });
                        } else if (dataTypeCode._code._value === 1000018) {
                            _codes.push({
                                catalogItem: {
                                    ns: '/thing',
                                    _code: {
                                        _value: 1000014,
                                        _ver: 1
                                    }
                                }
                            });
                        } else if (dataTypeCode._code._value === 1000028) {
                            _codes.push({
                                catalogItem: {
                                    ns: '/document',
                                    _code: {
                                        _value: 1000024,
                                        _ver: 1
                                    }
                                }
                            });
                        }
                        res.status(ResponseCode.OK).json(_codes);
                    }
                }
                return;
            }
            res.status(status).end();
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app = express();
        this._app.use(bodyParser.json());
        this._app.post('/catalog', _listener4);
        this._app.get('/catalog/', _listener3);
        this._app.get('/catalog/name', _listener2);
        this._app.get('/catalog/:catalogItemCode', _listener);
        this._app.get('/catalog/:catalogItemCode/:catalogItemVersion', _listener);
        this._server = this._app.listen(port);
    }
}

export class StubCatalogServer05 {
    _app: express.Express;
    _server: Server;
    constructor (status: number) {
        this._app = express();

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            const code = Number(req.params.code);
            if (status === 200) {
                res.status(200);
                // アクター確認
                if (code === 1000006) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role',
                            name: '研究員',
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            inherit: {
                                _value: 43,
                                _ver: null
                            },
                            description: 'テスト用ワークフローＡの研究員です。'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: null,
                            event: [
                                {
                                    index: '3_5_1',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            ],
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        },
                        prop: [
                            {
                                key: 'document',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/document/*',
                                            'catalog/built_in/document/*',
                                            'catalog/model/document/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なドキュメント'
                            },
                            {
                                key: 'event',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/event/*',
                                            'catalog/built_in/event/*',
                                            'catalog/model/event/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なイベント'
                            },
                            {
                                key: 'licence',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/licence',
                                            'catalog/built_in/licence',
                                            'catalog/model/licence'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '所持ライセンス'
                            },
                            {
                                key: 'thing',
                                type: {
                                    of: 'code[]',
                                    candidate: {
                                        ns: [
                                            'catalog/ext/test-org/thing/*',
                                            'catalog/built_in/thing/*',
                                            'catalog/model/thing/*'
                                        ],
                                        _code: null,
                                        base: null
                                    }
                                },
                                description: '作成可能なモノ'
                            }
                        ],
                        attribute: [
                            {
                                key: 'constraint-store',
                                value: {
                                    'required-licence': [
                                        {
                                            _value: 1000005,
                                            _ver: 1
                                        },
                                        {
                                            _value: 1000008,
                                            _ver: 1
                                        }
                                    ]
                                },
                                description: '蓄積制約（必要ライセンス）の定義です。'
                            }
                        ]
                    });
                } else if (code === 92) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/test-org/actor/wf/テスト用ワークフロー/role'
                        },
                        template: {
                            _code: {
                                _value: 1000005,
                                _ver: 1
                            },
                            document: [
                                {
                                    index: '3_5_1',
                                    value: {
                                        _value: 1000008,
                                        _ver: 1
                                    }
                                }
                            ],
                            event: null,
                            licence: [
                                {
                                    _value: 1000005,
                                    _ver: 1
                                },
                                {
                                    _value: 1000008,
                                    _ver: 1
                                }
                            ],
                            thing: null
                        }
                    });
                } else {
                    res.status(ResponseCode.INTERNAL_SERVER_ERROR);
                }
                res.end();
            }
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.get('/catalog/:code/:version', _listener);
        this._app.get('/catalog/:code', _listener);
        this._server = this._app.listen(3001);
    }
}

export class StubCatalogServerForContract {
    _app: express.Express;
    _server: Server;
    constructor (status: number) {
        this._app = express();

        // イベントハンドラー
        const _listener = (req: express.Request, res: express.Response) => {
            const code = Number(req.params.code);
            res.status(status);
            if (status === ResponseCode.OK) {
                if (code === 1000447) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/consumer',
                            name: 'test',
                            _code: {
                                _value: 1000447,
                                _ver: 1
                            },
                            inherit: {
                                _value: 37,
                                _ver: 1
                            },
                            description: 'testです。'
                        },
                        template: {
                            _code: {
                                _value: 1000447,
                                _ver: 1
                            },
                            'main-block': {
                                _value: 1000420,
                                _ver: 1
                            },
                            statement: null,
                            status: 'certified'
                        },
                        prop: null,
                        attribute: null,
                        'trader-alliance': {
                            _value: 1000435,
                            _ver: 1
                        }
                    });
                } else if (code === 1000448) {
                    res.status(ResponseCode.OK).json({
                        catalogItem: {
                            ns: 'catalog/ext/aaa-healthcare-consortium/actor/consumer',
                            name: 'test',
                            _code: {
                                _value: 1000447,
                                _ver: 1
                            },
                            inherit: {
                                _value: 37,
                                _ver: 1
                            },
                            description: 'testです。'
                        },
                        template: {
                            _code: {
                                _value: 1000447,
                                _ver: 1
                            },
                            'main-block': {
                                _value: null,
                                _ver: null
                            },
                            statement: null,
                            status: 'certified'
                        },
                        prop: null,
                        attribute: null,
                        'trader-alliance': {
                            _value: 1000435,
                            _ver: 1
                        }
                    });
                }
                res.end();
            }
        };

        const _listener2 = (req: express.Request, res: express.Response) => {
            res.status(status);
            if (status === ResponseCode.OK) {
                const json = [];
                for (const codeObj of req.body) {
                    const code = Number(codeObj._code._value);
                    if (code === 1000801) {
                        json.push({
                            catalogItem: {
                                ns: 'catalog/ext/aaa-healthcare-consortium/event/actor_1000436',
                                name: 'event1',
                                description: 'event1',
                                _code: {
                                    _value: 1000801,
                                    _ver: 1
                                },
                                inherit: {
                                    _value: 53,
                                    _ver: 1
                                }
                            },
                            template: null,
                            inner: null,
                            attribute: null
                        });
                    } else if (code === 1000805) {
                        json.push({
                            catalogItem: {
                                ns: 'catalog/ext/aaa-healthcare-consortium/thing/actor_1000436',
                                name: 'thing1',
                                description: 'thing1',
                                _code: {
                                    _value: 1000805,
                                    _ver: 1
                                },
                                inherit: {
                                    _value: 55,
                                    _ver: 1
                                }
                            },
                            template: null,
                            inner: null,
                            attribute: null
                        });
                    } else if (code === 1000807) {
                        json.push({
                            catalogItem: {
                                ns: 'catalog/ext/aaa-healthcare-consortium/thing/actor_1000436',
                                name: 'thing2',
                                description: 'thing2',
                                _code: {
                                    _value: 1000807,
                                    _ver: 1
                                },
                                inherit: {
                                    _value: 55,
                                    _ver: 1
                                }
                            },
                            template: null,
                            inner: null,
                            attribute: null
                        });
                    } else if (code === 1000461) {
                        json.push({
                            catalogItem: {
                                ns: 'catalog/ext/aaa-healthcare-consortium/app/actor_1000436/application',
                                name: 'app',
                                description: 'app',
                                _code: {
                                    _value: 1000461,
                                    _ver: 1
                                },
                                inherit: {
                                    _value: 46,
                                    _ver: 1
                                }
                            },
                            template: null,
                            inner: null,
                            attribute: null
                        });
                    }
                }
                res.json(json).end();
            }
            res.end();
        };

        // ハンドラーのイベントリスナーを追加、アプリケーションの起動
        this._app.use(bodyParser.json());
        this._app.get('/catalog/:code/:version', _listener);
        this._app.get('/catalog/:code', _listener);
        this._app.post('/catalog', _listener2);
        this._server = this._app.listen(3001);
    }
}
