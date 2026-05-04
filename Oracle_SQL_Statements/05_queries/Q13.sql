--13. Purchases and material cost. (REPORT)
SELECT pd.purchase_id, pd.purchase_date, lm.material_name, pd.material_quantity, lm.material_cost, pd.material_quantity * lm.material_cost AS estimated_total_cost, sd.supplier_name
FROM purchase_details pd
JOIN lab_materials lm ON pd.reference_number = lm.reference_number
JOIN supplier_details sd ON pd.supplier_id = sd.supplier_id
ORDER BY pd.purchase_date DESC;
