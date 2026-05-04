CREATE OR REPLACE PROCEDURE assign_equipment (
    p_serial_number VARCHAR2,
    p_employee_id   VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    -- Check equipment exists
    SELECT COUNT(*) INTO v_count
    FROM lab_equipment
    WHERE serial_number = p_serial_number;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20200, 'Equipment does not exist');
    END IF;

    -- Check scientist exists
    SELECT COUNT(*) INTO v_count
    FROM scientist_details
    WHERE employee_id = p_employee_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20201, 'Scientist does not exist');
    END IF;

    -- Prevent duplicate active assignment
    SELECT COUNT(*) INTO v_count
    FROM equipment_assignment
    WHERE serial_number = p_serial_number
      AND employee_id = p_employee_id;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20202, 'This assignment already exists');
    END IF;

    -- Insert assignment
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