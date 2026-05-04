--22. Find most requested material. (REPORT)
SELECT reference_number, COUNT(*) AS total_requests
FROM material_requests
GROUP BY reference_number
ORDER BY total_requests DESC
FETCH FIRST 1 ROW ONLY;