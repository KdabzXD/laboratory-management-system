CREATE OR REPLACE PROCEDURE update_equipment (
    p_serial_number   VARCHAR2,
    p_name            VARCHAR2,
    p_cost            NUMBER
)
IS
BEGIN
    UPDATE lab_equipment
    SET
        equipment_name = p_name,
        equipment_cost = p_cost
    WHERE serial_number = p_serial_number;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20020, 'Equipment not found');
    END IF;

END;
/