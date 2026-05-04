--33. Suppliers with more than 2 purchases.
SELECT supplier_id, COUNT(*) AS total_purchases
FROM purchase_details
GROUP BY supplier_id
HAVING COUNT(*) > 2;
