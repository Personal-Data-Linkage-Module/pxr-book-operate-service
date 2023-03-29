/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.binary_file
(
    thing_id,
    file_path,
    mime_type,
    file_size, file_hash,
    is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
	1,
    '\test\file',
    'text',
    10, '982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	2,
    '\test\file',
    'text',
    10, '982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1',
    false, 'pxr_user', NOW(), 'pxr_user', NOW()
);
