--48. Find suppliers with the highest purchases.
SELECT supplier_id
FROM purchase_details
GROUP BY supplier_id
HAVING COUNT(*) = (
 SELECT MAX(cnt) FROM (
   SELECT COUNT(*) cnt FROM purchase_details GROUP BY supplier_id) x);
 