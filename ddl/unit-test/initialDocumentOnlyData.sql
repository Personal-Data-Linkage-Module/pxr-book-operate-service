/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
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
    1, '202108-1-1', 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
    '2020-02-20 00:00:00',
    1000004, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-01-01T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
),
(
    2, null, 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
    '2020-02-20 00:00:00',
    1000004, 1,
    null, null,
    null, null, null,
    1000007, 1,
    '{"id":{"index":"3_1_1","value":"doc-4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', '2020-01-01T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
),
(
    3, '202108-1-1', 'doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6',
    1000008, 1,
    '2020-02-20 00:00:00',
    1000004, 1,
    1000007, 1,
    1000005, 1, 'staffId',
    null, null,
    '{"id":{"index":"3_1_1","value":"doc-fedc51ce-2efd-4ade-9bbe-45dc445ae9c6"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"sourceId":"20200221-1","env":null,"app":null,"wf":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"wf":{"index":"3_5_2","value":{"_value":1000007,"_ver":1}},"role":{"index":"3_5_3","value":{"_value":1000005,"_ver":1}},"staffId":{"index":"3_5_4","value":"staffId"}},"thing":[]}',
    null, false, 'pxr_user', '2020-01-01T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
),
(
    4, '202108-1-1', 'doc-4f75161a-449a-4839-be6a-4cc577b8a8d0',
    1000008, 1,
    '2020-02-20 00:00:00',
    1000004, 1,
    null, null,
    null, null, null,
    1000007, 1,
    '{"id":{"index":"3_1_1","value":"doc-4f75161a-449a-4839-be6a-4cc577b8a8d0"},"code":{"index":"3_1_2","value":{"_value":1000008,"_ver":1}},"start":{"index":"3_2_1","value":"2020-02-20T00:00:00.000+0900"},"env":null,"app":{"code":{"index":"3_5_1","value":{"_value":1000004,"_ver":1}},"app":{"index":"3_5_5","value":{"_value":1000007,"_ver":1}}},"wf":null,"thing":[]}',
    null, false, 'pxr_user', '2020-01-01T00:00:00.000+0900', 'pxr_user', '2020-02-20T00:00:00.000+0900'
)
;
