CREATE TABLE material_requests_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  request_id NUMBER,
  reference_number VARCHAR2(5),
  employee_id VARCHAR2(5),
  old_request_date DATE,
  new_request_date DATE,
  old_material_quantity NUMBER,
  new_material_quantity NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_material_requests_audit
AFTER INSERT OR UPDATE OR DELETE ON material_requests
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO material_requests_audit (
      request_id,
      reference_number,
      employee_id,
      new_request_date,
      new_material_quantity,
      action_type
    )
    VALUES (
      :NEW.request_id,
      :NEW.reference_number,
      :NEW.employee_id,
      :NEW.request_date,
      :NEW.material_quantity,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO material_requests_audit (
      request_id,
      reference_number,
      employee_id,
      old_request_date,
      new_request_date,
      old_material_quantity,
      new_material_quantity,
      action_type
    )
    VALUES (
      :OLD.request_id,
      :NEW.reference_number,
      :NEW.employee_id,
      :OLD.request_date,
      :NEW.request_date,
      :OLD.material_quantity,
      :NEW.material_quantity,
      'UPDATE'
    );
  ELSIF DELETING THEN
    INSERT INTO material_requests_audit (
      request_id,
      reference_number,
      employee_id,
      old_request_date,
      old_material_quantity,
      action_type
    )
    VALUES (
      :OLD.request_id,
      :OLD.reference_number,
      :OLD.employee_id,
      :OLD.request_date,
      :OLD.material_quantity,
      'DELETE'
    );
  END IF;
END;
/
