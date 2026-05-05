BEGIN
    SAVEPOINT update_scientist;

    UPDATE scientist_details
    SET scientist_email = 'updated@mail.com'
    WHERE employee_id = 'SC001';

    -- Safety check example
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'Scientist not found');
    END IF;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK TO update_scientist;
        DBMS_OUTPUT.PUT_LINE('Update failed and rolled back');
END;
/