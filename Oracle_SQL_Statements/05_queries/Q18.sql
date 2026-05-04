--18. Find average age of scientists per department.
SELECT d.department_name, AVG(s.scientist_age) AS avg_age
FROM scientist_details s
JOIN departments d ON s.department_id = d.department_id
GROUP BY d.department_name;
