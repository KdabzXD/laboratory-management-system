--34. Equipment used more than once.
SELECT serial_number, COUNT(*) AS total_assignments
FROM equipment_assignment
GROUP BY serial_number
HAVING COUNT(*) > 1;