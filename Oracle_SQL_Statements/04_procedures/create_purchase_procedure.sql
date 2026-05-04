CREATE OR REPLACE PROCEDURE create_purchase (
    p_reference_number VARCHAR2,
    p_material_quantity NUMBER,
    p_supplier_id      NUMBER
)
IS
    v_count NUMBER;
BEGIN
    -- Validate quantity
    IF p_material_quantity <= 0 THEN
        RAISE_APPLICATION_ERROR(-20400, 'Quantity must be greater than zero');
    END IF;

    -- Check material exists
    SELECT COUNT(*) INTO v_count
    FROM lab_materials
    WHERE reference_number = p_reference_number;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20401, 'Material does not exist');
    END IF;

    -- Check supplier exists
    SELECT COUNT(*) INTO v_count
    FROM supplier_details
    WHERE supplier_id = p_supplier_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20402, 'Supplier does not exist');
    END IF;

    -- Insert purchase record
    INSERT INTO purchase_details (
        reference_number,
        material_quantity,
        supplier_id,
        purchase_date
    )
    VALUES (
        p_reference_number,
        p_material_quantity,
        p_supplier_id,
        TRUNC(SYSDATE)
    );

END;
/