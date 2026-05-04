CREATE OR REPLACE PROCEDURE update_material (
    p_reference_number   VARCHAR2,
    p_name               VARCHAR2,
    p_description        VARCHAR2,
    p_cost               NUMBER
)
IS
BEGIN
    UPDATE lab_materials
    SET
        material_name = p_name,
        material_description = p_description,
        material_cost = p_cost
    WHERE reference_number = p_reference_number;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20110, 'Material not found');
    END IF;

END;
/