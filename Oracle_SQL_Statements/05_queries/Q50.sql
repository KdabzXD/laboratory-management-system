--50. Find materials never requested. (REPORT)
SELECT * FROM lab_materials lm
WHERE NOT EXISTS (
SELECT 1 FROM material_requests mr WHERE mr.reference_number = lm.reference_number);

