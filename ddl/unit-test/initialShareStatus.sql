/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.share_status
(
    id,
    user_id,
    share_trigger_code,
    share_trigger_version,
    share_code,
    share_version,
    end_method,
    start_datetime,
    end_datetime,
    status,
    is_disabled,
    created_by,
    created_at,
    updated_by,
    updated_at)
VALUES
(
    1, 
    'test_user_id1', 
    1000510, 
    1, 
    1000501, 
    1, 
    1, 
    '2020-02-20 00:00:00', 
    '2020-02-21 00:00:00', 
    1,
    false, 
    'pxr_user', 
    NOW(), 
    'pxr_user', 
    NOW()
);
