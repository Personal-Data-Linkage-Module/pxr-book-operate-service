/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.cmatrix_2_n
(
    _1_1,
    _1_2_1, _1_2_2,
    _2_1,
    _3_1_1, _3_1_2,
    _3_2_1, _3_2_2,
    _3_3_1, _3_3_2,
    _3_4,
    _3_5_1, _3_5_2,
    is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
    'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1, 
    '2020-02-20 00:00:00',
    1000004, 1, 
    1000007, 1,
    1000005, 1, 
    'staffId',
    null, null,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1, 
    '2020-02-20 00:00:00',
    1000004, 1, 
    null, null,
    null, null, null,
    1000007, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;

INSERT INTO pxr_book_operate.cmatrix_2_n_relation
(
    n,
    cmatrix_event_id, cmatrix_2n_id,
    is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
    1,
    1, 1,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2,
    2, 2,
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
