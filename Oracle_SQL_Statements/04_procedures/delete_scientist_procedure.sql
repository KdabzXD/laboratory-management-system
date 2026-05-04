CREATE OR REPLACE PROCEDURE delete_scientist_safe (
    p_employee_id IN VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    -- Check equipment assignments
    SELECT COUNT(*) INTO v_count
    FROM equipment_assignment
    WHERE employee_id = p_employee_id;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20061,
            'Scientist has assigned equipment'
        );
    END IF;

    -- Check material requests
    SELECT COUNT(*) INTO v_count
    FROM material_requests
    WHERE employee_id = p_employee_id;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(
            -20062,
            'Scientist has material requests'
        );
    END IF;

    DELETE FROM scientist_details
    WHERE employee_id = p_employee_id;

    COMMIT;
END;
/