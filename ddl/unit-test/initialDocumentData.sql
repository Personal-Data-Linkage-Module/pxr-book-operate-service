/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
INSERT INTO pxr_book_operate.event
(
    my_condition_book_id, source_id, event_identifier,
    event_catalog_code, event_catalog_version,
    event_start_at, event_end_at, event_outbreak_position,
    event_actor_code, event_actor_version,
    wf_catalog_code, wf_catalog_version,
    wf_role_code, wf_role_version, wf_staff_identifier,
    app_catalog_code, app_catalog_version,
    template,
    attributes, is_disabled, created_by,
    created_at, updated_by, updated_at)
VALUES
(
    1, '202108-1-1', 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000004, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, '202108-1-1', 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000004, 1,
    null, null,
    null, null, null,
    1000007, 1,
    '{"id":{"index":"3_1_1","value":"event-4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    3, '202108-1-1', 'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000004, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    4, '202108-1-1', 'event-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000004, 1,
    null, null,
    null, null, null,
    1000007, 1,
    '{"id":{"index":"3_1_1","value":"event-4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
INSERT INTO pxr_book_operate.cmatrix_event
(
	"1_1", "1_2", "1_3",
	"3_1_1", "3_1_2_1", "3_1_2_2",
	"3_2_1", "3_2_2",
	"3_3_1",
	"3_5_1_1", "3_5_1_2", "3_5_2_1", "3_5_2_2", "3_5_3_1", "3_5_3_2", "3_5_4", "3_5_5_1", "3_5_5_2",
	is_disabled, created_by, created_at, updated_by, updated_at
)
VALUES
(
	'test_user_id1', null, null,
	'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 1000008, 1,
	'2020-01-01 00:00:00', '2030-12-31 23:59:59',
	'a',
	1000004, 1, 1000007, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id2', null, null,
	'event-4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
	null, null,
	null,
	1000004, 1, null, null, null, null, null, 1000007, 1,
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id3', null, null,
	'event-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6', 1000008, 1,
	'2020-01-01 00:00:00', '2030-12-31 23:59:59',
	null,
	1000004, 1, 1000007, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
	'test_user_id4', null, null,
	'event-4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
	'2020-01-01 00:00:00', '2030-12-31 23:59:59',
	null,
	1000004, 1, null, null, null, null, null, 1000007, 1,
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
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
    1, '202108-1', 'thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
	1000004, 1,
    1000007, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"thing-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"4_1_2","value":{"_value":1000008,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2, '202108-1', 'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
	1000004, 1,
    null, null,
    null, null,
    null,
    1000007, 1,
    '{"id":{"index":"4_1_1","value":"4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"4_1_2","value":{"_value":1000008,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', NOW(), 'pxr_user', NOW()
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
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
),
(
    2,
	'thing-4f75161a-449a-4839-be6a-4cc577b8a8d0', 1000008, 1,
	1000004, 1, null, null, null, null, null,
	1000007, 1,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', NOW(), 'pxr_user', NOW()
)
;
