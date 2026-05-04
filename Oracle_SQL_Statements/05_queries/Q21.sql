--21. Count number of assignments per scientist.
SELECT employee_id, COUNT(*) AS assignments 
FROM equipment_assignment
GROUP BY employee_id;
