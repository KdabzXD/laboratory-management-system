--28. Departments with more than 5 scientists.
SELECT department_id, COUNT(*) AS total_scientists 
FROM scientist_details
GROUP BY department_id
HAVING COUNT(*) > 5;
