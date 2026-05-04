--20. Find total cost of equipment in each department. (REPORT)
SELECT d.department_name, SUM(e.equipment_cost) AS total_cost
FROM lab_equipment e 
JOIN departments d ON e.department_id = d.department_id
GROUP BY d.department_name;