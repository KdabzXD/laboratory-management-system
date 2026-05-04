--32. Departments with average age above 40.
SELECT department_id, AVG(scientist_age) AS average_age
FROM scientist_details
GROUP BY department_id
HAVING AVG(scientist_age) > 40;
