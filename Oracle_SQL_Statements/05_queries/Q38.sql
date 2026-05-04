--38. Suppliers who supply more than one material. 
SELECT supplier_id, COUNT(DISTINCT reference_number) AS total_materials_supplied
FROM lab_materials
GROUP BY supplier_id
HAVING COUNT(DISTINCT reference_number) > 1;
