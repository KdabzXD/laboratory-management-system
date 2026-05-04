CREATE OR REPLACE PROCEDURE get_equipment_by_department (
    p_department_id NUMBER,
    p_cursor OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN p_cursor FOR
    SELECT 
        serial_number,
        equipment_name,
        equipment_cost,
        department_id,
        supplier_id
    FROM lab_equipment
    WHERE department_id = p_department_id;
END;
/