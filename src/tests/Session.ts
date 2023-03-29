/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 * セッション情報
 */
export namespace Session {
    /**
    * 正常(流通制御、運営メンバー)
    */
    export const pxrRoot = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000001,
            _ver: 1
        }
    };

    /**
    * 正常(データ取引、運営メンバー)
    */
    export const dataTrader = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000020,
            _ver: 1
        }
    };

    /**
    * 正常(ワークフロー)
    */
    export const wrorkFlow = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 1,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000020,
            _ver: 1
        }
    };

    /**
    * 正常(アプリケーション)
    */
    export const application = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 2,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000020,
            _ver: 1
        }
    };

    /**
    * 異常(対象カタログなし)
    */
    export const errorNotCatalog = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 999999,
            _ver: 1
        }
    };

    /**
    * 異常(流通制御、データ取引以外)
    */
    export const errorActorCode = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1,
            _ver: 1
        }
    };

    /**
    * 異常(データ取引、create_bookなし)
    */
    export const errorNotCreateBook = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000109,
            _ver: 1
        }
    };

    /**
    * 異常(アクターなし)
    */
    export const errorNotActor = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000110,
            _ver: 1
        }
    };

    /**
    * 正常(個人)
    */
   export const ind = {
       sessionId: 'sessionId',
       operatorId: 1,
       type: 0,
       loginId: 'loginid',
       pxrId: 'pxrid',
       mobilePhone: '0311112222',
       lastLoginAt: '2020-01-01T00:00:00.000+0900',
       attributes: {},
       block: {
           _value: 1000110,
           _ver: 1
       },
       actor: {
           _value: 1000001,
           _ver: 1
       }
   };

   /**
    * 正常(個人)、一時的データ共有コードによるデータ取得用
    */
    export const indTemporarilyShare = {
        sessionId: 'd89171efae04aa55357bdd2ebf8338725c8fd17ffdfbe61be66ca96c7590b296',
        operatorId: 2,
        type: 0,
        loginId: '58di2dfse2.test.org',
        pxrId: '58di2dfse2.test.org',
        mobilePhone: '09011112222',
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        block: {
            _value: 1000110,
            _ver: 1
        },
        actor: {
            _value: 1000001,
            _ver: 1
        }
    };

    /**
    * 正常(領域運営、運営メンバー)
    */
    export const regionRoot = {
        sessionId: 'sessionId',
        operatorId: 1,
        type: 3,
        loginId: 'loginid',
        name: 'test-user',
        mobilePhone: '0311112222',
        auth: {
            add: true,
            update: true,
            delete: true
        },
        lastLoginAt: '2020-01-01T00:00:00.000+0900',
        attributes: {},
        roles: [
            {
                _value: 1,
                _ver: 1
            }
        ],
        block: {
            _value: 1000402,
            _ver: 1
        },
        actor: {
            _value: 1000432,
            _ver: 1
        }
    };
}
