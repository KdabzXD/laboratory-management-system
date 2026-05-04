CREATE OR REPLACE PROCEDURE get_purchases (
    p_cursor OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        pd.purchase_id,
        pd.reference_number,
        lm.material_name,
        pd.material_quantity,
        pd.supplier_id,
        sd.supplier_name,
        pd.purchase_date
    FROM purchase_details pd
    JOIN lab_materials lm ON pd.reference_number = lm.reference_number
    JOIN supplier_details sd ON pd.supplier_id = sd.supplier_id;
END;
/