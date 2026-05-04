CREATE TABLE lab_equipment_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  serial_number VARCHAR2(5),
  old_equipment_name VARCHAR2(50),
  new_equipment_name VARCHAR2(50),
  old_equipment_cost NUMBER,
  new_equipment_cost NUMBER,
  old_department_id NUMBER,
  new_department_id NUMBER,
  old_supplier_id NUMBER,
  new_supplier_id NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_lab_equipment_audit
AFTER INSERT OR UPDATE ON lab_equipment
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO lab_equipment_audit (
      serial_number,
      new_equipment_name,
      new_equipment_cost,
      new_department_id,
      new_supplier_id,
      action_type
    )
    VALUES (
      :NEW.serial_number,
      :NEW.equipment_name,
      :NEW.equipment_cost,
      :NEW.department_id,
      :NEW.supplier_id,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO lab_equipment_audit (
      serial_number,
      old_equipment_name,
      new_equipment_name,
      old_equipment_cost,
      new_equipment_cost,
      old_department_id,
      new_department_id,
      old_supplier_id,
      new_supplier_id,
      action_type
    )
    VALUES (
      :OLD.serial_number,
      :OLD.equipment_name,
      :NEW.equipment_name,
      :OLD.equipment_cost,
      :NEW.equipment_cost,
      :OLD.department_id,
      :NEW.department_id,
      :OLD.supplier_id,
      :NEW.supplier_id,
      'UPDATE'
    );
  END IF;
END;
/
