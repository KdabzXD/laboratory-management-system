--7. Suppliers who supply both equipment and materials. 
SELECT DISTINCT sd.supplier_name
FROM supplier_details sd
JOIN lab_equipment e ON sd.supplier_id = e.supplier_id
JOIN lab_materials lm ON sd.supplier_id = lm.supplier_id;
