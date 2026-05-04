--47. Find scientists with no equipment assigned. (REPORT)
SELECT * FROM scientist_details s
WHERE NOT EXISTS (
 SELECT 1 FROM equipment_assignment ea WHERE ea.employee_id = s.employee_id);
