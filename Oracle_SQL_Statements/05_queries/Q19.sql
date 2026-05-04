--19. Count how many materials each supplier provides.
SELECT sd.supplier_name, COUNT(*) AS materials_supplied
FROM lab_materials lm
JOIN supplier_details sd ON lm.supplier_id = sd.supplier_id
GROUP BY sd.supplier_name;
