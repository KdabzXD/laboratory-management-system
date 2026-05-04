--46. Find department with highest equipment cost.
SELECT department_id
FROM lab_equipment
GROUP BY department_id
HAVING SUM(equipment_cost) = (
 SELECT MAX(total) FROM (
   SELECT SUM(equipment_cost) total FROM lab_equipment GROUP BY department_id) x);
