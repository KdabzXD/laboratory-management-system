-- department_specialization
CREATE TABLE department_specialization (
    specialization_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    specialization_name VARCHAR2(70) NOT NULL,
    department_id NUMBER NOT NULL,
    CONSTRAINT UQ_specialization UNIQUE (specialization_name, department_id),
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
);

--TRIGGER FOR: BUSSINESS RULES AND DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_dept_spec_biu
BEFORE INSERT OR UPDATE ON department_specialization
FOR EACH ROW
BEGIN
  :NEW.specialization_name := INITCAP(TRIM(:NEW.specialization_name));

  IF :NEW.specialization_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20120, 'Specialization name cannot be empty');
  END IF;

  IF LENGTH(:NEW.specialization_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20121, 'Specialization name must be at least 3 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.specialization_name, '^[A-Za-z0-9 &/-]+$') THEN
    RAISE_APPLICATION_ERROR(-20122, 'Specialization name contains invalid characters');
  END IF;

  IF :NEW.department_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20123, 'Department is required');
  END IF;
END;
/

--TRIGGER FOR: PREVENT DELETE
CREATE OR REPLACE TRIGGER trg_dept_spec_no_delete
BEFORE DELETE ON department_specialization
FOR EACH ROW
BEGIN
  RAISE_APPLICATION_ERROR(-20124, 'Deleting department specializations is not allowed');
END;
/
