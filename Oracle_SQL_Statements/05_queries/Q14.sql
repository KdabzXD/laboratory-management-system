--14. Departments with their scientists and equipment. (REPORT)
SELECT d.department_name, s.scientist_name, e.equipment_name
FROM departments d
LEFT JOIN scientist_details s ON d.department_id = s.department_id
LEFT JOIN lab_equipment e ON d.department_id = e.department_id
ORDER BY d.department_name, s.scientist_name;
