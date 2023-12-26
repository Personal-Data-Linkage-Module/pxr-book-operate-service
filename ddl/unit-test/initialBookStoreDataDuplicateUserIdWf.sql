INSERT INTO pxr_book_operate.my_condition_book
(
    user_id,
    actor_catalog_code,
    actor_catalog_version,
    region_catalog_code,
    region_catalog_version,
    app_catalog_code,
    app_catalog_version,
    wf_catalog_code,
    wf_catalog_version,
    open_start_at,
    identify_code,
    attributes,
    is_disabled,
    created_by,
    created_at,
    updated_by,
    updated_at
)
VALUES
(
	'wfUser01',
    1000001,1,
    null,null,
    null,null,
    1000007,1,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeWf1000007',
    'userId重複の取得対象wf',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser02',
    1000001,1,
    null,null,
    null,null,
    1000007,1,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeWf10000072',
    'userId重複なしの取得対象wf',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser01',
    1000001,1,
    null,null,
    null,null,
    1000017,1,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeWf1000017',
    'userId重複のwf2',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser01',
    1000001,1,
    null,null,
    null,null,
    1000027,1,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeWf1000027',
    'userId重複の削除済wf',
    true,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
);

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
    1, '202108-1-1', 'WFEvent011',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000001, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFEvent011"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1-1', 'WFEvent021',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000001, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFEvent021"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1-1', 'WFEvent012',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000001, 1,
    1000017, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFEvent012"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000017,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1-1', 'WFEvent013',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000001, 1,
    1000027, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFEvent013"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000027,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
	'wfUser01', null, null,
	'WFEvent011', 1000101, 1,
	'2020-02-20 00:00:00', '2020-02-21 00:00:00',
	'location',
	1000001, 1, 1000007, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser02', null, null,
	'WFEvent021', 1000101, 1,
	'2020-02-20 00:00:00', '2020-02-21 00:00:00',
	'location',
	1000001, 1, 1000007, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser01', null, null,
	'WFEvent012', 1000101, 1,
	'2020-02-20 00:00:00', '2020-02-21 00:00:00',
	'location',
	1000001, 1, 1000017, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'wfUser01', null, null,
	'WFEvent013', 1000101, 1,
	'2020-02-20 00:00:00', '2020-02-21 00:00:00',
	'location',
	1000001, 1, 1000027, 1, 1000005, 1, 'staffId', null, null,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
    1, '202108-1', 'WFThing011',
    1000201, 1,
	1000001, 1,
    1000007, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"WFThing011"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1', 'WFThing021',
    1000201, 1,
	1000001, 1,
    1000007, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"WFThing021"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1', 'WFThing012',
    1000201, 1,
	1000001, 1,
    1000017, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"WFThing012"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1', 'WFThing013',
    1000201, 1,
	1000001, 1,
    1000027, 1,
    1000005, 1,
    'staffId',
    null, null,
    '{"id":{"index":"4_1_1","value":"WFThing013"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
	'WFThing011', 1000201, 1,
	1000001, 1, 1000007, 1, 1000005, 1, 'staffId',
	null, null,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2,
	'WFThing021', 1000201, 1,
	1000001, 1, 1000007, 1, 1000005, 1, 'staffId',
	null, null,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2,
	'WFThing012', 1000201, 1,
	1000001, 1, 1000017, 1, 1000005, 1, 'staffId',
	null, null,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3,
	'WFThing013', 1000201, 1,
	1000001, 1, 1000027, 1, 1000005, 1, 'staffId',
	null, null,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '4_5_1',
    'floating',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '4_5_1',
    'floating',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '4_5_1',
    'floating',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

INSERT INTO pxr_book_operate.document
(
    my_condition_book_id, source_id, doc_identifier, 
    doc_catalog_code, doc_catalog_version,
    doc_create_at,
    doc_actor_code, doc_actor_version, 
    wf_catalog_code, wf_catalog_version, 
    wf_role_code, wf_role_version, wf_staff_identifier, 
    app_catalog_code, app_catalog_version, 
    template, 
    attributes, is_disabled, created_by, 
    created_at, updated_by, updated_at)
VALUES
(
    1, '202108-1-1', 'WFDocument011', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFDocument011"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1-1', 'WFDocument021', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFDocument021"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1-1', 'WFDocument012', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000017, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFDocument021"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000017,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1-1', 'WFDocument013', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000027, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"WFDocument013"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000027,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
    'WFDocument011',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000007, 1,
    1000005, 1, 
    'staffId',
    null, null,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'WFDocument021',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000007, 1,
    1000005, 1, 
    'staffId',
    null, null,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'WFDocument012',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000017, 1,
    1000005, 1, 
    'staffId',
    null, null,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'WFDocument013',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    1000027, 1,
    1000005, 1, 
    'staffId',
    null, null,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2,
    2, 2,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3,
    3, 3,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4,
    4, 4,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

INSERT INTO pxr_book_operate.document_event_set_relation
(
    document_id, title,
    attributes, is_disabled, created_by, 
    created_at, updated_by, updated_at)
VALUES
(
    1, 'userId重複wf1',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, 'userId重複なしwf',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, 'userId重複wf2',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, 'userId重複wf3削除済',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

INSERT INTO pxr_book_operate.event_set_event_relation
(
    event_set_id, event_id,
    attributes, is_disabled, created_by, 
    created_at, updated_by, updated_at)
VALUES
(
    1, 1,
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, 2,
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, 3,
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, 4,
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

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
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	2,
    '\test\file',
    'text',
    10, '982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	3,
    '\test\file',
    'text',
    10, '982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	4,
    '\test\file',
    'text',
    10, '982d9e3eb996f559e633f4d194def3761d909f5a3b647d1a851fead67c32c9d1',
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
);

