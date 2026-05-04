CREATE OR REPLACE PROCEDURE reassign_equipment (
    p_serial_number VARCHAR2,
    p_new_employee  VARCHAR2
)
IS
BEGIN
    -- Remove old assignment
    DELETE FROM equipment_assignment
    WHERE serial_number = p_serial_number;

    -- Assign to new scientist
    INSERT INTO equipment_assignment (
        serial_number,
        employee_id,
        assignment_date
    )
    VALUES (
        p_serial_number,
        p_new_employee,
        SYSDATE
    );
END;
/