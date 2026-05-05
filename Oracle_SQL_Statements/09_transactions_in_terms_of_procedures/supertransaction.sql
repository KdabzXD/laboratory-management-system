BEGIN
    SAVEPOINT full_process;

    -- 1. Request material
    INSERT INTO material_requests (
        reference_number,
        employee_id,
        request_date,
        material_quantity
    )
    VALUES ('MA010', 'SC003', SYSDATE, 3);

    -- 2. Assign equipment
    INSERT INTO equipment_assignment (
        serial_number,
        employee_id,
        assignment_date
    )
    VALUES ('EQ003', 'SC003', SYSDATE);

    -- 3. Purchase record
    INSERT INTO purchase_details (
        reference_number,
        material_quantity,
        supplier_id,
        purchase_date
    )
    VALUES ('MA010', 3, 1, SYSDATE);

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO full_process;
        DBMS_OUTPUT.PUT_LINE('Full transaction failed - rollback executed');
END;
/