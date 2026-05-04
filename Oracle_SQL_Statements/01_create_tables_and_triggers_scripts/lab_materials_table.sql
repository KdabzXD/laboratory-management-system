-- lab_materials
CREATE TABLE lab_materials (
    reference_number VARCHAR2(5) PRIMARY KEY,
    material_name VARCHAR2(50) NOT NULL UNIQUE,
    material_description VARCHAR2(250) NOT NULL,
    supplier_id NUMBER NOT NULL,
    material_cost NUMBER NOT NULL CHECK (material_cost >= 0),

    CHECK (REGEXP_LIKE(reference_number, '^MA[0-9]{3}$')),

    FOREIGN KEY (supplier_id)
        REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_lab_materials_biu
BEFORE INSERT OR UPDATE ON lab_materials
FOR EACH ROW
BEGIN
  :NEW.reference_number := UPPER(TRIM(:NEW.reference_number));
  :NEW.material_name := INITCAP(TRIM(:NEW.material_name));
  :NEW.material_description := TRIM(:NEW.material_description);

  IF :NEW.reference_number IS NULL THEN
    RAISE_APPLICATION_ERROR(-20400, 'Reference number cannot be empty');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.reference_number, '^MA[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20401, 'Reference number must follow format MA001');
  END IF;

  IF :NEW.material_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20402, 'Material name cannot be empty');
  END IF;

  IF LENGTH(:NEW.material_name) < 2 THEN
    RAISE_APPLICATION_ERROR(-20403, 'Material name must be at least 2 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.material_name, '^[A-Za-z0-9 .''&()/-]+$') THEN
    RAISE_APPLICATION_ERROR(-20404, 'Material name contains invalid characters');
  END IF;

  IF :NEW.material_description IS NULL THEN
    RAISE_APPLICATION_ERROR(-20405, 'Material description cannot be empty');
  END IF;

  IF LENGTH(:NEW.material_description) < 1 THEN
    RAISE_APPLICATION_ERROR(-20406, 'Material description must be at least 3 characters');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20407, 'Supplier is required');
  END IF;

  IF :NEW.material_cost < 0 THEN
    RAISE_APPLICATION_ERROR(-20408, 'Material cost cannot be negative');
  END IF;
END;
/

--TRIGGER FOR: CHECKING THAT MATERIAL COST DOESN'T GO BELOW HALF
CREATE OR REPLACE TRIGGER trg_lab_materials_cost_check
BEFORE UPDATE OF material_cost ON lab_materials
FOR EACH ROW
BEGIN
  IF :NEW.material_cost < (:OLD.material_cost * 0.5) THEN
    RAISE_APPLICATION_ERROR(
      -20410,
      'Material cost cannot be reduced by more than 50%'
    );
  END IF;
END;
/