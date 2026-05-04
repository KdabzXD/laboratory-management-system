CREATE TABLE lab_materials_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference_number VARCHAR2(5),
  old_material_name VARCHAR2(50),
  new_material_name VARCHAR2(50),
  old_material_description VARCHAR2(250),
  new_material_description VARCHAR2(250),
  old_supplier_id NUMBER,
  new_supplier_id NUMBER,
  old_material_cost NUMBER,
  new_material_cost NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_lab_materials_audit
AFTER INSERT OR UPDATE ON lab_materials
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO lab_materials_audit (
      reference_number,
      new_material_name,
      new_material_description,
      new_supplier_id,
      new_material_cost,
      action_type
    )
    VALUES (
      :NEW.reference_number,
      :NEW.material_name,
      :NEW.material_description,
      :NEW.supplier_id,
      :NEW.material_cost,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO lab_materials_audit (
      reference_number,
      old_material_name,
      new_material_name,
      old_material_description,
      new_material_description,
      old_supplier_id,
      new_supplier_id,
      old_material_cost,
      new_material_cost,
      action_type
    )
    VALUES (
      :OLD.reference_number,
      :OLD.material_name,
      :NEW.material_name,
      :OLD.material_description,
      :NEW.material_description,
      :OLD.supplier_id,
      :NEW.supplier_id,
      :OLD.material_cost,
      :NEW.material_cost,
      'UPDATE'
    );
  END IF;
END;
/
