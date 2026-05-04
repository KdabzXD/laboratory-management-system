-- scientist_details
CREATE TABLE scientist_details (
    employee_id VARCHAR2(5) NOT NULL PRIMARY KEY,
    scientist_name VARCHAR2(50) NOT NULL,
    scientist_age NUMBER NOT NULL CHECK (scientist_age BETWEEN 18 AND 100),
    scientist_email VARCHAR2(70) NOT NULL UNIQUE,
    phone_number VARCHAR2(10) NOT NULL UNIQUE,
    gender_id NUMBER NOT NULL,
    specialization_id NUMBER NOT NULL,
    department_id NUMBER NOT NULL,

    CHECK (REGEXP_LIKE(employee_id, '^SC[0-9]{3}$')),
    CHECK (REGEXP_LIKE(scientist_email, '^[^@]+@[^@]+\.[^@]+$')),
    CHECK (REGEXP_LIKE(phone_number, '^[0-9]{10}$')),

    FOREIGN KEY (gender_id) REFERENCES gender (gender_id),
    FOREIGN KEY (specialization_id) REFERENCES department_specialization (specialization_id),
    FOREIGN KEY (department_id) REFERENCES departments (department_id)
);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_scientist_biu
BEFORE INSERT OR UPDATE ON scientist_details
FOR EACH ROW
BEGIN
  :NEW.employee_id := UPPER(TRIM(:NEW.employee_id));
  :NEW.scientist_name := INITCAP(TRIM(:NEW.scientist_name));
  :NEW.scientist_email := LOWER(TRIM(:NEW.scientist_email));
  :NEW.phone_number := TRIM(:NEW.phone_number);

  IF LENGTH(:NEW.scientist_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20200, 'Scientist name must be at least 3 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.scientist_name, '^[A-Za-z .''-]+$') THEN
    RAISE_APPLICATION_ERROR(-20201, 'Scientist name contains invalid characters');
  END IF;

  IF :NEW.scientist_age < 18 OR :NEW.scientist_age > 100 THEN
    RAISE_APPLICATION_ERROR(-20202, 'Scientist age must be between 18 and 100');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.employee_id, '^SC[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20203, 'Employee ID must follow format SC001');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.phone_number, '^[0-9]{10}$') THEN
    RAISE_APPLICATION_ERROR(-20204, 'Phone number must be exactly 10 digits');
  END IF;
END;
/

--TRIGGER FOR: DEPARTMENT MATCHING THE SPECIALIZATION
CREATE OR REPLACE TRIGGER trg_scientist_dept_spec_match
BEFORE INSERT OR UPDATE ON scientist_details
FOR EACH ROW
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM department_specialization
  WHERE specialization_id = :NEW.specialization_id
    AND department_id = :NEW.department_id;

  IF v_count = 0 THEN
    RAISE_APPLICATION_ERROR(
      -20205,
      'Scientist department must match the specialization department'
    );
  END IF;
END;
/

--TRIGGER FOR: PREVENT DELETE
CREATE OR REPLACE TRIGGER trg_scientist_no_delete
BEFORE DELETE ON scientist_details
FOR EACH ROW
BEGIN
  RAISE_APPLICATION_ERROR(-20206, 'Deleting scientist records is not allowed');
END;
/
