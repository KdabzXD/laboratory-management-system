BEGIN
    SAVEPOINT purchase_start;

    -- Step 1: Insert purchase record
    INSERT INTO purchase_details (
        reference_number,
        material_quantity,
        supplier_id,
        purchase_date
    )
    VALUES (
        'MA001',
        10,
        1,
        SYSDATE
    );

    -- Step 2: Example business logic (can be extended)
    UPDATE supplier_details
    SET supplier_description = supplier_description
    WHERE supplier_id = 1;

    -- Step 3: Commit only if everything works
    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO purchase_start;
        DBMS_OUTPUT.PUT_LINE('Purchase transaction failed');
END;
/