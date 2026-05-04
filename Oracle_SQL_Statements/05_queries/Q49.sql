--49. Find specialization with most scientists.
SELECT specialization_id
FROM scientist_details
GROUP BY specialization_id
HAVING COUNT(*) = (
 SELECT MAX(cnt) FROM (
   SELECT COUNT(*) cnt FROM scientist_details GROUP BY specialization_id) x);
