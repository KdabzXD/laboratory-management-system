--31. Materials requested more than 10 times.
SELECT reference_number, COUNT(*) AS total_requests
FROM material_requests
GROUP BY reference_number
HAVING COUNT(*) > 10;