CREATE OR REPLACE PROCEDURE get_materials_by_supplier (
    p_supplier_id NUMBER,
    p_cursor OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        reference_number,
        material_name,
        material_description,
        material_cost
    FROM lab_materials
    WHERE supplier_id = p_supplier_id;
END;
/