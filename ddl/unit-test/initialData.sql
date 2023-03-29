/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
-- 対象テーブルのデータをすべて削除
DELETE FROM pxr_book_operate.binary_file;
DELETE FROM pxr_book_operate.shared_access_log_data_type;
DELETE FROM pxr_book_operate.shared_access_log;
DELETE FROM pxr_book_operate.collection_request_consent;
DELETE FROM pxr_book_operate.collection_request_data_type;
DELETE FROM pxr_book_operate.collection_request;
DELETE FROM pxr_book_operate.event_set_event_relation;
DELETE FROM pxr_book_operate.document_event_set_relation;
DELETE FROM pxr_book_operate.document;
DELETE FROM pxr_book_operate.cmatrix_2_n_relation;
DELETE FROM pxr_book_operate.cmatrix_2_n;
DELETE FROM pxr_book_operate.cmatrix_floating_column;
DELETE FROM pxr_book_operate.cmatrix_thing;
DELETE FROM pxr_book_operate.cmatrix_event;
DELETE FROM pxr_book_operate.thing;
DELETE FROM pxr_book_operate.event;
DELETE FROM pxr_book_operate.my_condition_book;
DELETE FROM pxr_book_operate.share_trigger_waiting;
DELETE FROM pxr_book_operate.share_status;

-- 対象テーブルのシーケンスを初期化
SELECT SETVAL('pxr_book_operate.binary_file_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.shared_access_log_data_type_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.shared_access_log_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.event_set_event_relation_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.document_event_set_relation_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.document_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.cmatrix_2_n_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.cmatrix_2_n_relation_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.cmatrix_floating_column_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.cmatrix_thing_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.cmatrix_event_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.thing_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.event_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.my_condition_book_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.share_trigger_waiting_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.share_status_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.collection_request_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.collection_request_data_type_id_seq', 1, false);
SELECT SETVAL('pxr_book_operate.collection_request_consent_id_seq', 1, false);
