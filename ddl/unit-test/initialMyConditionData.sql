/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.my_condition_book
(
    user_id,
    actor_catalog_code, actor_catalog_version,
    app_catalog_code, app_catalog_version,
    wf_catalog_code, wf_catalog_version,
    open_start_at,
    attributes, is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
	'test_user_id1',
    1000004, 1,
    null, null,
    1000004, 1,
    '2020-02-01T00:00:00.000+0900',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id2',
    1000004, 1,
    1000004, 1,
    null, null,
    '2020-03-02T00:00:00.000+0900',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id3',
    1000004, 1,
    null, null,
    1000004, 1,
    '2020-02-01T00:00:00.000+0900',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id4',
    1000004, 1,
    1000004, 1,
    null, null,
    '2020-03-02T00:00:00.000+0900',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
);
