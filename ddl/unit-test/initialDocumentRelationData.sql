/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.document_event_set_relation
(
    document_id, title,
    attributes, is_disabled, created_by, 
    created_at, updated_by, updated_at)
VALUES
(
    1, 'タイトル１',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 'タイトル２',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 'タイトル３',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 'タイトル４',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;

INSERT INTO pxr_book_operate.event_set_event_relation
(
    event_set_id, event_id,
    attributes, is_disabled, created_by, 
    created_at, updated_by, updated_at)
VALUES
(
    1, 1,
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 2,
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 3,
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, 4,
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
