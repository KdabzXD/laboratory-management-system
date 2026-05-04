-- PURCHASE DETAILS
INSERT INTO purchase_details (reference_number,material_quantity,supplier_id,purchase_date)
SELECT 'MA001', 50,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA002', 30,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA025', 40,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA026', 20,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA027', 15,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA028', 60,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA029', 25,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA030', 35,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'karibu@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA031', 45,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA032', 55,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual;
