--27. Count specializations per department.
SELECT department_id, COUNT(*) AS specializations
FROM department_specialization
GROUP BY department_id;