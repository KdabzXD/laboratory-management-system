CREATE TABLE equipment_assignment_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  assignment_id NUMBER,
  serial_number VARCHAR2(5),
  employee_id VARCHAR2(5),
  old_assignment_date DATE,
  new_assignment_date DATE,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_equipment_assignment_audit
AFTER INSERT OR UPDATE ON equipment_assignment
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO equipment_assignment_audit (
      assignment_id,
      serial_number,
      employee_id,
      new_assignment_date,
      action_type
    )
    VALUES (
      :NEW.assignment_id,
      :NEW.serial_number,
      :NEW.employee_id,
      :NEW.assignment_date,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO equipment_assignment_audit (
      assignment_id,
      serial_number,
      employee_id,
      old_assignment_date,
      new_assignment_date,
      action_type
    )
    VALUES (
      :OLD.assignment_id,
      :NEW.serial_number,
      :NEW.employee_id,
      :OLD.assignment_date,
      :NEW.assignment_date,
      'UPDATE'
    );
  END IF;
END;
/