CREATE TABLE department_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  department_id NUMBER,
  old_department_name VARCHAR2(50),
  new_department_name VARCHAR2(50),
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_department_audit
AFTER INSERT OR UPDATE ON departments
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO department_audit (
      department_id,
      new_department_name,
      action_type
    )
    VALUES (
      :NEW.department_id,
      :NEW.department_name,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO department_audit (
      department_id,
      old_department_name,
      new_department_name,
      action_type
    )
    VALUES (
      :OLD.department_id,
      :OLD.department_name,
      :NEW.department_name,
      'UPDATE'
    );
  END IF;
END;
/