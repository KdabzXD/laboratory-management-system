--15. All suppliers located in Nairobi and what they supply. (REPORT)
SELECT sd.supplier_name, e.equipment_name, lm.material_name
FROM supplier_details sd
LEFT JOIN lab_equipment e ON sd.supplier_id = e.supplier_id
LEFT JOIN lab_materials lm ON sd.supplier_id = lm.supplier_id
WHERE sd.supplier_location = 'Nairobi';

