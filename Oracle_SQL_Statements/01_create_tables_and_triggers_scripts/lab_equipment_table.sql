CREATE TABLE lab_equipment (
    serial_number VARCHAR2(5) NOT NULL PRIMARY KEY,
    equipment_name VARCHAR2(50) NOT NULL,
    equipment_cost NUMBER NOT NULL CHECK (equipment_cost >= 0),
    department_id NUMBER NOT NULL,
    supplier_id NUMBER NOT NULL,

    CHECK (REGEXP_LIKE(serial_number, '^EQ[0-9]{3}$')),

    FOREIGN KEY (department_id) REFERENCES departments (department_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_lab_equipment_biu
BEFORE INSERT OR UPDATE ON lab_equipment
FOR EACH ROW
BEGIN
  :NEW.serial_number := UPPER(TRIM(:NEW.serial_number));
  :NEW.equipment_name := INITCAP(TRIM(:NEW.equipment_name));

  IF :NEW.equipment_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20300, 'Equipment name cannot be empty');
  END IF;

  IF LENGTH(:NEW.equipment_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20301, 'Equipment name must be at least 3 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.equipment_name, '^[A-Za-z0-9 .''&()/-]+$') THEN
    RAISE_APPLICATION_ERROR(-20302, 'Equipment name contains invalid characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.serial_number, '^EQ[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20303, 'Serial number must follow format EQ001');
  END IF;

  IF :NEW.equipment_cost < 0 THEN
    RAISE_APPLICATION_ERROR(-20304, 'Equipment cost cannot be negative');
  END IF;

  IF :NEW.department_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20305, 'Department is required');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20306, 'Supplier is required');
  END IF;
END;
/

--TRIGGER FOR: PREVENTING COST FROM BEING REDUCED TO LESS THAN HALF ITS ORIGINAL VALUE
CREATE OR REPLACE TRIGGER trg_lab_equipment_cost_check
BEFORE UPDATE OF equipment_cost ON lab_equipment
FOR EACH ROW
BEGIN
  IF :NEW.equipment_cost < (:OLD.equipment_cost * 0.5) THEN
    RAISE_APPLICATION_ERROR(
      -20308,
      'Equipment cost cannot be reduced by more than 50%'
    );
  END IF;
END;
/
