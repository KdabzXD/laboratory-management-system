--30. Scientists with more than 1 equipment assigned.
SELECT employee_id, COUNT(*) AS total_equipment_assigned
FROM equipment_assignment
GROUP BY employee_id
HAVING COUNT(*) > 1;
