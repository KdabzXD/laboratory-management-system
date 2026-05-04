-- departments
CREATE TABLE departments (
    department_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR2(50) NOT NULL UNIQUE
);

--TRIGGER FOR: DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_department_clean_data
BEFORE INSERT OR UPDATE ON departments
FOR EACH ROW
BEGIN
  :NEW.department_name := INITCAP(TRIM(:NEW.department_name));
END;
/

--TRIGGER FOR: BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_department_biu
BEFORE INSERT OR UPDATE ON departments
FOR EACH ROW
BEGIN
  :NEW.department_name := INITCAP(TRIM(:NEW.department_name));

  IF :NEW.department_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20100, 'Department name cannot be empty');
  END IF;

  IF LENGTH(:NEW.department_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20101, 'Department name must be at least 3 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.department_name, '^[A-Za-z ]+$') THEN
    RAISE_APPLICATION_ERROR(-20102, 'Department name can only contain letters and spaces');
  END IF;
END;
/

--TRIGGER FOR: SAFE DELETE
CREATE OR REPLACE TRIGGER trg_department_no_delete
BEFORE DELETE ON departments
FOR EACH ROW
BEGIN
  RAISE_APPLICATION_ERROR(-20103, 'Deleting departments is not allowed');
END;
/