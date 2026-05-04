--3. All equipment with the supplier details.
SELECT e.equipment_name, sd.supplier_name
FROM lab_equipment e 
JOIN supplier_details sd ON e.supplier_id = sd.supplier_id;
