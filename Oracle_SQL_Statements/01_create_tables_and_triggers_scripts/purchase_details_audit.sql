CREATE TABLE purchase_details_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  purchase_id NUMBER,
  reference_number VARCHAR2(5),
  old_material_quantity NUMBER,
  new_material_quantity NUMBER,
  old_supplier_id NUMBER,
  new_supplier_id NUMBER,
  old_purchase_date DATE,
  new_purchase_date DATE,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_purchase_details_audit
AFTER INSERT OR UPDATE ON purchase_details
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO purchase_details_audit (
      purchase_id,
      reference_number,
      new_material_quantity,
      new_supplier_id,
      new_purchase_date,
      action_type
    )
    VALUES (
      :NEW.purchase_id,
      :NEW.reference_number,
      :NEW.material_quantity,
      :NEW.supplier_id,
      :NEW.purchase_date,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO purchase_details_audit (
      purchase_id,
      reference_number,
      old_material_quantity,
      new_material_quantity,
      old_supplier_id,
      new_supplier_id,
      old_purchase_date,
      new_purchase_date,
      action_type
    )
    VALUES (
      :OLD.purchase_id,
      :NEW.reference_number,
      :OLD.material_quantity,
      :NEW.material_quantity,
      :OLD.supplier_id,
      :NEW.supplier_id,
      :OLD.purchase_date,
      :NEW.purchase_date,
      'UPDATE'
    );
  END IF;
END;
/