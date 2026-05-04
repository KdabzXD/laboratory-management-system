CREATE TABLE department_specialization_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  specialization_id NUMBER,
  old_specialization_name VARCHAR2(70),
  new_specialization_name VARCHAR2(70),
  old_department_id NUMBER,
  new_department_id NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

--TRIGGER
CREATE OR REPLACE TRIGGER trg_dept_spec_audit
AFTER INSERT OR UPDATE ON department_specialization
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO department_specialization_audit (
      specialization_id,
      new_specialization_name,
      new_department_id,
      action_type
    )
    VALUES (
      :NEW.specialization_id,
      :NEW.specialization_name,
      :NEW.department_id,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO department_specialization_audit (
      specialization_id,
      old_specialization_name,
      new_specialization_name,
      old_department_id,
      new_department_id,
      action_type
    )
    VALUES (
      :OLD.specialization_id,
      :OLD.specialization_name,
      :NEW.specialization_name,
      :OLD.department_id,
      :NEW.department_id,
      'UPDATE'
    );
  END IF;
END;
/
