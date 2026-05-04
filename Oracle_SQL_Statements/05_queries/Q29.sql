--29. Suppliers who supply more than 3 materials.
SELECT supplier_id, COUNT(*) AS total_materials
FROM lab_materials
GROUP BY supplier_id
HAVING COUNT(*) > 3;
