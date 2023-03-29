/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
DELETE FROM pxr_book_operate.my_condition_book;

-- 対象テーブルのシーケンスを初期化
SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);

-- 対象テーブルに既にデータがある場合の確認用
INSERT INTO pxr_book_operate.my_condition_book
(
    user_id,
    actor_catalog_code,
    actor_catalog_version,
    app_catalog_code,
    app_catalog_version,
    wf_catalog_code,
    wf_catalog_version,
    open_start_at,
    attributes,
    is_disabled,
    created_by,
    created_at,
    updated_by,
    updated_at
)
VALUES
(
	'123456789',
    1000004,1,
    null,null,
    1000004,1,
    NOW(),
    null,
    false,
    'pxr_user',
    NOW(),
    'pxr_user',
    NOW()
);
