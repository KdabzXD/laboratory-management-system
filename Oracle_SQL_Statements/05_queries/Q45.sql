--45. Find material with highest total requests. (REPORT)
SELECT reference_number
FROM material_requests
GROUP BY reference_number
HAVING COUNT(*) = (
 SELECT MAX(cnt) FROM (
   SELECT COUNT(*) cnt FROM material_requests GROUP BY reference_number) x);
 