--6. All equipment used in the Physics department.
SELECT DISTINCT e.equipment_name
FROM lab_equipment e
JOIN departments d ON e.department_id = d.department_id
WHERE d.department_name = 'Physics';
