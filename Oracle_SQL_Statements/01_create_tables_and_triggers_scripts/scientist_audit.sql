CREATE TABLE scientist_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_id VARCHAR2(5),
  old_scientist_name VARCHAR2(50),
  new_scientist_name VARCHAR2(50),
  old_scientist_email VARCHAR2(70),
  new_scientist_email VARCHAR2(70),
  old_department_id NUMBER,
  new_department_id NUMBER,
  old_specialization_id NUMBER,
  new_specialization_id NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_scientist_audit
AFTER INSERT OR UPDATE ON scientist_details
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO scientist_audit (
      employee_id,
      new_scientist_name,
      new_scientist_email,
      new_department_id,
      new_specialization_id,
      action_type
    )
    VALUES (
      :NEW.employee_id,
      :NEW.scientist_name,
      :NEW.scientist_email,
      :NEW.department_id,
      :NEW.specialization_id,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO scientist_audit (
      employee_id,
      old_scientist_name,
      new_scientist_name,
      old_scientist_email,
      new_scientist_email,
      old_department_id,
      new_department_id,
      old_specialization_id,
      new_specialization_id,
      action_type
    )
    VALUES (
      :OLD.employee_id,
      :OLD.scientist_name,
      :NEW.scientist_name,
      :OLD.scientist_email,
      :NEW.scientist_email,
      :OLD.department_id,
      :NEW.department_id,
      :OLD.specialization_id,
      :NEW.specialization_id,
      'UPDATE'
    );
  END IF;
END;
/
