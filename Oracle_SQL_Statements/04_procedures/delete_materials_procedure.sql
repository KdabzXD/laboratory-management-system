CREATE OR REPLACE PROCEDURE delete_material (
    p_reference_number VARCHAR2
)
IS
BEGIN
    DELETE FROM lab_materials
    WHERE reference_number = p_reference_number;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20120, 'Material not found');
    END IF;

END;
/