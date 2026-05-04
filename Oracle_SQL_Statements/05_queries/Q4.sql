--4. Materials and supplier name. (REPORT)
SELECT lm.material_name, sd.supplier_name
FROM lab_materials lm
JOIN supplier_details sd ON lm.supplier_id = sd.supplier_id;
