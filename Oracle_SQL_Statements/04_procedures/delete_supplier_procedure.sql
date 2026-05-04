CREATE OR REPLACE PROCEDURE delete_supplier_safe (
    p_supplier_id IN NUMBER
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_count
    FROM lab_equipment
    WHERE supplier_id = p_supplier_id;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20001,
            'Cannot delete supplier because it is used in lab_equipment'
        );
    END IF;

    DELETE FROM supplier_details
    WHERE supplier_id = p_supplier_id;

    COMMIT;
END;
/