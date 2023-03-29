/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.my_condition_book
(
    id,
    user_id,
    actor_catalog_code, actor_catalog_version,
    app_catalog_code, app_catalog_version,
    wf_catalog_code, wf_catalog_version,
    open_start_at,
    attributes, is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
    1,
	'wf_test_user01',
    1000117, 1,
    null, null,
    1000120, 1,
    '2020-02-01 00:00:00.000',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2,
	'wf_test_user02',
    1000004, 1,
    null, null,
    1000073, null,
    '2020-02-01 00:00:00.000',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    3,
	'wf_test_user03',
    1000070, 1,
    null, null,
    1000007, 1,
    '2020-02-01 00:00:00.000',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    4,
	'app_test_user01',
    1000117, 1,
    1001120, 1,
    null, null,
    '2020-02-01 00:00:00.000',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    5,
	'wf_test_user04',
    1002070, 1,
    null, null,
    1002007, 1,
    '2020-02-01 00:00:00.000',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
);

INSERT INTO pxr_book_operate.shared_access_log
(
    id,
    my_condition_book_id,
    log_identifier,
    user_name,
    data_type,
    req_actor_catalog_code,
    req_actor_catalog_version,
    req_block_catalog_code,
    req_block_catalog_version,
    access_at,
    is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
	1, 1,
    '7529ff1b-7b1e-ede8-de9d-ca54048df803',
    'share_user01',
    1,
    1001020, 1,
    1001109, 1,
    '2020-07-31 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	2, 1,
    '2374d48d-575b-0f75-1324-1e5305ad4a73',
    'share_user01',
    1, 1001020, 1,
    1001109, 1,
    '2020-08-14 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	3, 2,
    'cf09ac8e-86fd-579a-d0f6-5792d651f8c6',
    'share_user02',
    1, 1001021, 1,
    1001110, 1,
    '2020-08-01 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	4, 4,
    'b2af7d28-0230-b8d6-e515-b89d9db80def',
    'share_user03',
    1, 1001022, 1,
    1001111, 1,
    '2020-08-19 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	5, 5,
    '8d507ec3-02ee-8745-f350-b92a7accd75b',
    'share_user04',
    2, 1001022, 1,
    1001111, 1,
    '2020-08-29 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	6, 1,
    '35c3fee4-70d4-70aa-1911-0407c52364c4',
    'share_user05',
    1, 1001021, 1,
    1001110, 1,
    '2020-08-10 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 1,
    '5a14f673-fbbb-13e8-0328-4e6335e2affc',
    'share_user05',
    1, 1001021, 1,
    1001110, 1,
    '2020-08-12 15:00:00.000',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
);

INSERT INTO pxr_book_operate.shared_access_log_data_type
(
    share_access_log_id,
    data_type,
    data_type_catalog_code,
    data_type_catalog_version,
    is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
	1, 1, 1002120, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	1, 2, 1000155, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	1, 3, 1000344, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	2, 2, 1000155, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	2, 3, 1000343, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	3, 2, 1000009, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	3, 3, 1000046, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	4, 1, 1002120, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	4, 2, 1001009, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	4, 3, 1001046, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	6, 1, 1002120, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	6, 2, 1000155, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	6, 3, 1000046, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 1, 1002120, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 1, 1002120, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 1, 1002121, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 2, 1000155, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 2, 1000155, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 2, 1000156, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 3, 1000046, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 3, 1000046, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	7, 3, 1000047, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
);
