BEGIN
    SAVEPOINT assign_equipment;

    -- Assign equipment
    INSERT INTO equipment_assignment (
        serial_number,
        employee_id,
        assignment_date
    )
    VALUES (
        'EQ001',
        'SC002',
        SYSDATE
    );

    -- Business rule check (example)
    IF 'EQ001' IS NULL THEN
        RAISE_APPLICATION_ERROR(-20002, 'Invalid equipment');
    END IF;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO assign_equipment;
        DBMS_OUTPUT.PUT_LINE('Transaction failed and rolled back');
END;
/