--23. Count purchases for each supplier.
SELECT supplier_id, COUNT(*) AS purchases
FROM purchase_details
GROUP BY supplier_id;
