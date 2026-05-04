CREATE OR REPLACE PROCEDURE add_material (
    p_reference_number   VARCHAR2,
    p_name               VARCHAR2,
    p_description        VARCHAR2,
    p_supplier_id        NUMBER,
    p_cost               NUMBER
)
IS
    v_count NUMBER;
BEGIN
    -- Validate reference format
    IF NOT REGEXP_LIKE(p_reference_number, '^MA[0-9]{3}$') THEN
        RAISE_APPLICATION_ERROR(-20100, 'Invalid reference number format');
    END IF;

    -- Check supplier exists
    SELECT COUNT(*) INTO v_count
    FROM supplier_details
    WHERE supplier_id = p_supplier_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20101, 'Supplier does not exist');
    END IF;

    -- Check duplicate material name
    SELECT COUNT(*) INTO v_count
    FROM lab_materials
    WHERE material_name = p_name;

    IF v_count > 0 THEN
        RAISE_APPLICATION_ERROR(-20102, 'Material name already exists');
    END IF;

    -- Insert
    INSERT INTO lab_materials (
        reference_number,
        material_name,
        material_description,
        supplier_id,
        material_cost
    )
    VALUES (
        p_reference_number,
        p_name,
        p_description,
        p_supplier_id,
        p_cost
    );

END;
/