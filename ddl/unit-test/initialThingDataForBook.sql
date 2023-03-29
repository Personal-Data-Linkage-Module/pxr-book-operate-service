/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.thing
(
	event_id, source_id, thing_identifier,
    thing_catalog_code, thing_catalog_version,
    thing_actor_code, thing_actor_version,
	wf_catalog_code, wf_catalog_version,
    wf_role_code, wf_role_version,
	wf_staff_identifier,
    app_catalog_code, app_catalog_version,
    template,
	attributes, is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
    1, '20200221-1', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
	1000004, 1,
    1000007, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"4_1_2","value":{"_value":1000008,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-20T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
),
(
    2, '20200221-1', 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
	1000004, 1,
    null, null,
    null, null,
    null,
    1000007, 1,
    null,
    null, false, 'pxr_user', '2020-02-20T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
)
;
INSERT INTO pxr_book_operate.cmatrix_thing
(
	"cmatrix_event_id",
	"4_1_1", "4_1_2_1", "4_1_2_2",
	"4_4_1_1", "4_4_1_2", "4_4_2_1", "4_4_2_2", "4_4_3_1", "4_4_3_2", "4_4_4",
	"4_4_5_1", "4_4_5_2",
	row_hash, row_hash_create_at,
	is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
    1,
	'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 1000008, 1,
	1000004, 1, 1000007, 1, 1000005, 1, 'staffId',
	null, null,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-20T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
),
(
    2,
	'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
	1000004, 1, null, null, null, null, null,
	1000007, 1,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-20T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
)
;
