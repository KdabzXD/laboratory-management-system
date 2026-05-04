--41. List of scientists who never requested materials.
SELECT * FROM scientist_details s
WHERE NOT EXISTS (
SELECT 1 FROM material_requests mr WHERE mr.employee_id = s.employee_id);
