--17. Count the number of equipment per department. (REPORT)
SELECT d.department_name, COUNT(*) AS total_equipment
FROM lab_equipment e
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;
