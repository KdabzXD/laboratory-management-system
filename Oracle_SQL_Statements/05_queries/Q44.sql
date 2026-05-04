--44. Find scientists in department with highest number of scientists.
SELECT * FROM scientist_details
WHERE department_id = (
 SELECT department_id
 FROM scientist_details
 GROUP BY department_id
 ORDER BY COUNT(*) DESC
 FETCH FIRST 1 ROW ONLY);