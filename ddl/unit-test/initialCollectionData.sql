/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.collection_request
(
    status, pcd_code,
    actor_code, block_code,
    supply_proposal_id, contract_id,
    is_disabled, created_by,
    created_at, updated_by, updated_at
)
VALUES
(
    1, 1,
    1000004, 1000008,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    1, 2,
    1000004, 1000008,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    1, 3,
    1000004, 1000008,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    1, 4,
    1000004, 1000008,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    0, 5,
    1000004, 1000008,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;

INSERT INTO pxr_book_operate.collection_request_data_type
(
    collection_request_id,
    event_code, event_version,
    thing_code, thing_version,
    is_disabled, created_by,
    created_at, updated_by, updated_at
)
VALUES
(
    1,
    1000008, 1,
    1000008, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2,
    1000008, 1,
    1000008, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    3,
    1000008, 1,
    1000008, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    4,
    1000008, 1,
    1000008, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;

INSERT INTO pxr_book_operate.collection_request_consent
(
    collection_request_id, status,
    user_id, mask_id,
    is_disabled, created_by,
    created_at, updated_by, updated_at
)
VALUES
(
    1, 1,
    'test_user_id1', 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 1,
    'test_user_id2', 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    3, 1,
    'test_user_id3', 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    4, 1,
    'test_user_idxxx', 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    5, 0,
    'test_user_id5', 5,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;

INSERT INTO pxr_book_operate.cmatrix_floating_column
(
    cmatrix_thing_id, index_key,
    value,
    is_disabled, created_by,
    created_at, updated_by, updated_at
)
VALUES
(
    1, '4_5_1',
    'floating',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
