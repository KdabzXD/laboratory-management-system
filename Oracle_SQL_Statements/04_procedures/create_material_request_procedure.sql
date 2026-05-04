CREATE OR REPLACE PROCEDURE create_material_request (
    p_reference_number VARCHAR2,
    p_employee_id      VARCHAR2,
    p_quantity         NUMBER
)
IS
    v_count NUMBER;
BEGIN
    -- Validate quantity
    IF p_quantity <= 0 THEN
        RAISE_APPLICATION_ERROR(-20300, 'Quantity must be greater than zero');
    END IF;

    -- Check material exists
    SELECT COUNT(*) INTO v_count
    FROM lab_materials
    WHERE reference_number = p_reference_number;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20301, 'Material does not exist');
    END IF;

    -- Check scientist exists
    SELECT COUNT(*) INTO v_count
    FROM scientist_details
    WHERE employee_id = p_employee_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20302, 'Scientist does not exist');
    END IF;

    -- Prevent duplicate request for same day (matches your UNIQUE INDEX logic)
    SELECT COUNT(*) INTO v_count
    FROM material_requests
    WHERE reference_number = p_reference_number
      AND employee_id = p_employee_id
      AND TRUNC(request_date) = TRUNC(SYSDATE);

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20303, 'Request already made today for this material');
    END IF;

    -- Insert request
    INSERT INTO material_requests (
        reference_number,
        employee_id,
        request_date,
        material_quantity
    )
    VALUES (
        p_reference_number,
        p_employee_id,
        SYSDATE,
        p_quantity
    );

END;
/