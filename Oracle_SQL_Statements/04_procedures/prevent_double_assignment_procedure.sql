CREATE OR REPLACE PROCEDURE assign_equipment (
    p_serial_number VARCHAR2,
    p_employee_id   VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    -- Check if already assigned
    SELECT COUNT(*) INTO v_count
    FROM equipment_assignment
    WHERE serial_number = p_serial_number;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20040, 'Equipment already assigned');
    END IF;

    -- Assign
    INSERT INTO equipment_assignment (
        serial_number,
        employee_id,
        assignment_date
    )
    VALUES (
        p_serial_number,
        p_employee_id,
        SYSDATE
    );

END;
/