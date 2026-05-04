--16. Count the number of scientists per department. (REPORT)
SELECT d.department_name, COUNT(*) AS total_scientists
FROM scientist_details s
JOIN departments d ON s.department_id = d.department_id
GROUP BY d.department_name;
