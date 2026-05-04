CREATE OR REPLACE PROCEDURE add_equipment (
    p_serial_number   VARCHAR2,
    p_name            VARCHAR2,
    p_cost            NUMBER,
    p_department_id   NUMBER,
    p_supplier_id     NUMBER
)
IS
    v_count NUMBER;
BEGIN
    -- Validate serial format
    IF NOT REGEXP_LIKE(p_serial_number, '^EQ[0-9]{3}$') THEN
        RAISE_APPLICATION_ERROR(-20010, 'Invalid serial number format');
    END IF;

    -- Check department exists
    SELECT COUNT(*) INTO v_count
    FROM departments
    WHERE department_id = p_department_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20011, 'Department does not exist');
    END IF;

    -- Check supplier exists
    SELECT COUNT(*) INTO v_count
    FROM supplier_details
    WHERE supplier_id = p_supplier_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20012, 'Supplier does not exist');
    END IF;

    -- Insert
    INSERT INTO lab_equipment (
        serial_number,
        equipment_name,
        equipment_cost,
        department_id,
        supplier_id
    )
    VALUES (
        p_serial_number,
        p_name,
        p_cost,
        p_department_id,
        p_supplier_id
    );

END;
/