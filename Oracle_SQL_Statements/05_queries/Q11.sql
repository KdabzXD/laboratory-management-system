--11. Purchases with the supplier names, material names, quantity and purchase date. (REPORT)
SELECT lm.material_name, sd.supplier_name, pd.material_quantity, pd.purchase_date
FROM purchase_details pd
JOIN lab_materials lm ON pd.reference_number = lm.reference_number
JOIN supplier_details sd ON pd.supplier_id = sd.supplier_id
ORDER BY pd.purchase_date DESC;
