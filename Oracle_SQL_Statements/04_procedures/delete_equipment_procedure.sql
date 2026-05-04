CREATE OR REPLACE PROCEDURE delete_equipment (
    p_serial_number VARCHAR2
)
IS
BEGIN
    DELETE FROM lab_equipment
    WHERE serial_number = p_serial_number;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20030, 'Equipment not found');
    END IF;

END;
/