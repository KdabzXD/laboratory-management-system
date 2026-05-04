--36. Scientists who made more than 2 requests.
SELECT employee_id, COUNT(*) AS total_requests
FROM material_requests
GROUP BY employee_id
HAVING COUNT(*) > 2;