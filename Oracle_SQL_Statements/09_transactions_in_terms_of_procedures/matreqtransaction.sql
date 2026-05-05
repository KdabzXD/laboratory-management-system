BEGIN
    SAVEPOINT start_request;

    -- Step 1: Insert material request
    INSERT INTO material_requests (
        reference_number,
        employee_id,
        request_date,
        material_quantity
    )
    VALUES (
        'MA009',
        'SC001',
        SYSDATE,
        5
    );

    -- Step 2: Optional validation example (simulate condition)
    IF 5 <= 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'Invalid quantity');
    END IF;

    -- Step 3: If everything is fine
    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO start_request;
        RAISE;
END;
/
