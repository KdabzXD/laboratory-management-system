-- purchase_details
CREATE TABLE purchase_details (
   purchase_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   reference_number VARCHAR2(5) NOT NULL,
   material_quantity NUMBER NOT NULL CHECK (material_quantity > 0),
   supplier_id NUMBER NOT NULL,
   purchase_date DATE DEFAULT TRUNC(SYSDATE),

   FOREIGN KEY (reference_number) REFERENCES lab_materials (reference_number),
   FOREIGN KEY (supplier_id) REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_purchase_details_biu
BEFORE INSERT OR UPDATE ON purchase_details
FOR EACH ROW
DECLARE
  v_count NUMBER;
BEGIN
  :NEW.reference_number := UPPER(TRIM(:NEW.reference_number));

  IF :NEW.purchase_date IS NULL THEN
    :NEW.purchase_date := TRUNC(SYSDATE);
  END IF;

  IF NOT REGEXP_LIKE(:NEW.reference_number, '^MA[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20700, 'Reference number must follow format MA001');
  END IF;

  IF :NEW.material_quantity <= 0 THEN
    RAISE_APPLICATION_ERROR(-20701, 'Purchase quantity must be greater than zero');
  END IF;

  IF :NEW.material_quantity > 1000 THEN
    RAISE_APPLICATION_ERROR(-20702, 'Purchase quantity is unusually high and needs review');
  END IF;

  IF TRUNC(:NEW.purchase_date) > TRUNC(SYSDATE) THEN
    RAISE_APPLICATION_ERROR(-20703, 'Purchase date cannot be in the future');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20704, 'Supplier is required');
  END IF;

  SELECT COUNT(*)
  INTO v_count
  FROM lab_materials
  WHERE reference_number = :NEW.reference_number
    AND supplier_id = :NEW.supplier_id;

  IF v_count = 0 THEN
    RAISE_APPLICATION_ERROR(
      -20705,
      'Purchase supplier must match the material supplier'
    );
  END IF;
END;
/


