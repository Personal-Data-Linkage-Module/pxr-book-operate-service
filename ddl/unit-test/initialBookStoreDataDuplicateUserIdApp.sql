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
	'appUser01',
    1000436,1,
    null,null,
    1000002,1,
    null,null,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeApp1000002',
    'userId重複の取得対象app',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'appUser02',
    1000436,1,
    null,null,
    1000002,1,
    null,null,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeApp1000002',
    'userId重複なしの取得対象app',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'appUser01',
    1000436,1,
    null,null,
    1000012,1,
    null,null,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeApp1000012',
    'userId重複のapp2',
    false,
    'pxr_user',
    '2020-02-01T00:00:00.000+0900',
    'pxr_user',
    '2020-02-01T00:00:00.000+0900'
),
(
	'appUser01',
    1000436,1,
    null,null,
    1000022,1,
    null,null,
    '2020-02-01T00:00:00.000+0900',
    'identifyCodeApp1000022',
    'userId重複の削除済app',
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
    1, '202108-1-1', 'APPEvent011',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000436, 1,
    null, null,
    null, null, null,
    1000002, 1,
    '{"id":{"index":"3_1_1","value":"APPEvent011"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000002,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1-1', 'APPEvent021',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000436, 1,
    null, null,
    null, null, null,
    1000002, 1,
    '{"id":{"index":"3_1_1","value":"APPEvent011"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000002,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1-1', 'APPEvent012',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000436, 1,
    null, null,
    null, null, null,
    1000012, 1,
    '{"id":{"index":"3_1_1","value":"APPEvent012"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000012,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1-1', 'APPEvent013',
    1000101, 1,
    '2020-02-20 00:00:00', '2020-02-21 00:00:00', 'location',
    1000436, 1,
    null, null,
    null, null, null,
    1000022, 1,
    '{"id":{"index":"3_1_1","value":"APPEvent013"},"code":{"index":"3_1_2","value":{"_value":1000101,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"end":{"index":"3_2_2","value":"2020-02-21T00:00:00.000+0900"},"location":{"index":"3_3_1","value":null},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000022,"_ver":1}}},"wf":null,"thing":[]}',
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
	'appUser01', null, null,
	'APPEvent011', 1000101, 1,
	null, null,
	null,
	1000001, 1, null, null, null, null, null, 1000002, 1,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'appUser02', null, null,
	'APPEvent021', 1000101, 1,
	null, null,
	null,
	1000001, 1, null, null, null, null, null, 1000002, 1,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'appUser01', null, null,
	'APPEvent012', 1000101, 1,
	null, null,
	null,
	1000001, 1, null, null, null, null, null, 1000012, 1,
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
	'appUser01', null, null,
	'APPEvent013', 1000101, 1,
	null, null,
	null,
	1000001, 1, null, null, null, null, null, 1000022, 1,
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
    1, '202108-1', 'APPThing011',
    1000201, 1,
	1000001, 1,
    null, null,
    null, null,
    null,
    1000002, 1,
    '{"id":{"index":"4_1_1","value":"APPThing011"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1', 'APPThing021',
    1000201, 1,
	1000001, 1,
    null, null,
    null, null,
    null,
    1000002, 1,
    '{"id":{"index":"4_1_1","value":"APPThing021"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1', 'APPThing012',
    1000201, 1,
	1000001, 1,
    null, null,
    null, null,
    null,
    1000012, 1,
    '{"id":{"index":"4_1_1","value":"APPThing012"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1', 'APPThing013',
    1000201, 1,
	1000001, 1,
    null, null,
    null, null,
    null,
    1000012, 1,
    '{"id":{"index":"4_1_1","value":"APPThing013"},"code":{"index":"4_1_2","value":{"_value":1000201,"_ver":1}},"sourceId":"20200221-1","env":null,"x-axis":{"index":"4_2_2_1","value":null},"y-axis":{"index":"4_2_2_2","value":null},"z-axis":{"index":"4_2_2_3","value":null},"acquired_time":{"index":"4_2_2_4","value":"uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu"}}',
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
	'APPThing011', 1000201, 1,
	1000001, 1, null, null, null, null, null,
	1000002, 1,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2,
	'APPThing021', 1000201, 1,
	1000001, 1, null, null, null, null, null,
	1000002, 1,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),

(
    3,
	'APPThing012', 1000201, 1,
	1000001, 1, null, null, null, null, null,
	1000012, 1,
	'XXXX', '2020-01-01 00:00:00',
	false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),

(
    4,
	'APPThing013', 1000201, 1,
	1000001, 1, null, null, null, null, null,
	1000022, 1,
	'XXXX', '2020-01-01 00:00:00',
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
    1, '202108-1-1', 'APPDocument011', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000002, 1,
    '{"id":{"index":"3_1_1","value":"APPDocument011"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000002,"_ver":1}}},"wf":null,"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    2, '202108-1-1', 'APPDocument021', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000002, 1,
    '{"id":{"index":"3_1_1","value":"APPDocument021"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000002,"_ver":1}}},"wf":null,"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    3, '202108-1-1', 'APPDocument012', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000012, 1,
    '{"id":{"index":"3_1_1","value":"APPDocument012"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000012,"_ver":1}}},"wf":null,"thing":[]}', 
    null, false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    4, '202108-1-1', 'APPDocument013', 
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000022, 1,
    '{"id":{"index":"3_1_1","value":"APPDocument013"},"code":{"index":"3_1_2","value":{"_value":1000301,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000001,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000022,"_ver":1}}},"wf":null,"thing":[]}', 
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
    'APPDocument011',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000002, 1,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'APPDocument021',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000002, 1,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'APPDocument012',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000012, 1,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
),
(
    'APPDocument013',
    1000301, 1, 
    '2020-02-20 00:00:00',
    1000001, 1, 
    null, null,
    null, null, null,
    1000022, 1,
    false, 'pxr_user', '2020-02-01T00:00:00.000+0900', 'pxr_user', '2020-02-01T00:00:00.000+0900'
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
