-- supplier_details
CREATE TABLE supplier_details (
   supplier_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   supplier_name NVARCHAR2(50) NOT NULL UNIQUE,
   supplier_address NVARCHAR2(100) NOT NULL,
   supplier_location NVARCHAR2(50) NOT NULL,
   supplier_description NVARCHAR2(250) NOT NULL,
   supplier_email NVARCHAR2(70) NOT NULL UNIQUE,
   supplier_contact NVARCHAR2(10) NOT NULL UNIQUE,
   CHECK (REGEXP_LIKE(supplier_email, '^[^@]+@[^@]+\.[^@]+$')),
   CHECK (REGEXP_LIKE(supplier_contact, '^[0-9]{10}$'))
);

-- TRIGGER FOR: DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_supplier_clean_data
BEFORE INSERT OR UPDATE ON supplier_details
FOR EACH ROW
BEGIN
  -- Remove extra spaces
  :NEW.supplier_name := TRIM(:NEW.supplier_name);
  :NEW.supplier_address := TRIM(:NEW.supplier_address);
  :NEW.supplier_email := TRIM(:NEW.supplier_email);

  -- Standardize case
  :NEW.supplier_name := INITCAP(:NEW.supplier_name);
  :NEW.supplier_location := INITCAP(:NEW.supplier_location);

  -- Emails should be lowercase
  :NEW.supplier_email := LOWER(:NEW.supplier_email);
END;
/

-- TRIGGER FOR: BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_supplier_validate
BEFORE INSERT OR UPDATE ON supplier_details
FOR EACH ROW
BEGIN
  -- Prevent fake emails
  IF :NEW.supplier_email NOT LIKE '%@%.%' THEN
    RAISE_APPLICATION_ERROR(-20010, 'Invalid email format');
  END IF;

  -- Prevent unrealistic names
  IF LENGTH(:NEW.supplier_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20011, 'Supplier name too short');
  END IF;

  -- Prevent certain locations (example rule)
  IF :NEW.supplier_location IS NULL THEN
    RAISE_APPLICATION_ERROR(-20012, 'Location cannot be empty');
  END IF;
END;
/

--TRIGGER FOR: SAFE DELETION
CREATE OR REPLACE TRIGGER trg_supplier_no_delete
BEFORE DELETE ON supplier_details
FOR EACH ROW
BEGIN
  RAISE_APPLICATION_ERROR(-20020, 'Deleting suppliers is not allowed');
END;
/

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

-- gender
CREATE TABLE gender (
    gender_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    gender_name VARCHAR2(15) NOT NULL UNIQUE
);

--TRIGGER FOR: BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_gender_biu
BEFORE INSERT OR UPDATE ON gender
FOR EACH ROW
BEGIN
  :NEW.gender_name := INITCAP(TRIM(:NEW.gender_name));

  IF :NEW.gender_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20110, 'Gender name cannot be empty');
  END IF;

  IF :NEW.gender_name NOT IN ('Male', 'Female', 'Other') THEN
    RAISE_APPLICATION_ERROR(-20113, 'Gender must be Male, Female, or Other');
  END IF;
END;
/

--TRIGGER FOR: PREVENT DELETE
CREATE OR REPLACE TRIGGER trg_gender_no_delete
BEFORE DELETE ON gender
FOR EACH ROW
BEGIN
  RAISE_APPLICATION_ERROR(-20114, 'Deleting gender records is not allowed');
END;
/

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


CREATE TABLE lab_equipment (
    serial_number VARCHAR2(5) NOT NULL PRIMARY KEY,
    equipment_name VARCHAR2(50) NOT NULL,
    equipment_cost NUMBER NOT NULL CHECK (equipment_cost >= 0),
    department_id NUMBER NOT NULL,
    supplier_id NUMBER NOT NULL,

    CHECK (REGEXP_LIKE(serial_number, '^EQ[0-9]{3}$')),

    FOREIGN KEY (department_id) REFERENCES departments (department_id),
    FOREIGN KEY (supplier_id) REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_lab_equipment_biu
BEFORE INSERT OR UPDATE ON lab_equipment
FOR EACH ROW
BEGIN
  :NEW.serial_number := UPPER(TRIM(:NEW.serial_number));
  :NEW.equipment_name := INITCAP(TRIM(:NEW.equipment_name));

  IF :NEW.equipment_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20300, 'Equipment name cannot be empty');
  END IF;

  IF LENGTH(:NEW.equipment_name) < 3 THEN
    RAISE_APPLICATION_ERROR(-20301, 'Equipment name must be at least 3 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.equipment_name, '^[A-Za-z0-9 .''&()/-]+$') THEN
    RAISE_APPLICATION_ERROR(-20302, 'Equipment name contains invalid characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.serial_number, '^EQ[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20303, 'Serial number must follow format EQ001');
  END IF;

  IF :NEW.equipment_cost < 0 THEN
    RAISE_APPLICATION_ERROR(-20304, 'Equipment cost cannot be negative');
  END IF;

  IF :NEW.department_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20305, 'Department is required');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20306, 'Supplier is required');
  END IF;
END;
/

--TRIGGER FOR: PREVENTING COST FROM BEING REDUCED TO LESS THAN HALF ITS ORIGINAL VALUE
CREATE OR REPLACE TRIGGER trg_lab_equipment_cost_check
BEFORE UPDATE OF equipment_cost ON lab_equipment
FOR EACH ROW
BEGIN
  IF :NEW.equipment_cost < (:OLD.equipment_cost * 0.5) THEN
    RAISE_APPLICATION_ERROR(
      -20308,
      'Equipment cost cannot be reduced by more than 50%'
    );
  END IF;
END;
/


-- lab_materials
CREATE TABLE lab_materials (
    reference_number VARCHAR2(5) PRIMARY KEY,
    material_name VARCHAR2(50) NOT NULL UNIQUE,
    material_description VARCHAR2(250) NOT NULL,
    supplier_id NUMBER NOT NULL,
    material_cost NUMBER NOT NULL CHECK (material_cost >= 0),

    CHECK (REGEXP_LIKE(reference_number, '^MA[0-9]{3}$')),

    FOREIGN KEY (supplier_id)
        REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_lab_materials_biu
BEFORE INSERT OR UPDATE ON lab_materials
FOR EACH ROW
BEGIN
  :NEW.reference_number := UPPER(TRIM(:NEW.reference_number));
  :NEW.material_name := INITCAP(TRIM(:NEW.material_name));
  :NEW.material_description := TRIM(:NEW.material_description);

  IF :NEW.reference_number IS NULL THEN
    RAISE_APPLICATION_ERROR(-20400, 'Reference number cannot be empty');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.reference_number, '^MA[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20401, 'Reference number must follow format MA001');
  END IF;

  IF :NEW.material_name IS NULL THEN
    RAISE_APPLICATION_ERROR(-20402, 'Material name cannot be empty');
  END IF;

  IF LENGTH(:NEW.material_name) < 2 THEN
    RAISE_APPLICATION_ERROR(-20403, 'Material name must be at least 2 characters');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.material_name, '^[A-Za-z0-9 .''&()/-]+$') THEN
    RAISE_APPLICATION_ERROR(-20404, 'Material name contains invalid characters');
  END IF;

  IF :NEW.material_description IS NULL THEN
    RAISE_APPLICATION_ERROR(-20405, 'Material description cannot be empty');
  END IF;

  IF LENGTH(:NEW.material_description) < 1 THEN
    RAISE_APPLICATION_ERROR(-20406, 'Material description must be at least 3 characters');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20407, 'Supplier is required');
  END IF;

  IF :NEW.material_cost < 0 THEN
    RAISE_APPLICATION_ERROR(-20408, 'Material cost cannot be negative');
  END IF;
END;
/

--TRIGGER FOR: CHECKING THAT MATERIAL COST DOESN'T GO BELOW HALF
CREATE OR REPLACE TRIGGER trg_lab_materials_cost_check
BEFORE UPDATE OF material_cost ON lab_materials
FOR EACH ROW
BEGIN
  IF :NEW.material_cost < (:OLD.material_cost * 0.5) THEN
    RAISE_APPLICATION_ERROR(
      -20410,
      'Material cost cannot be reduced by more than 50%'
    );
  END IF;
END;
/


-- equipment_assignment
CREATE TABLE equipment_assignment (
   assignment_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   serial_number VARCHAR2(5) NOT NULL,
   employee_id VARCHAR2(5) NOT NULL,
   assignment_date DATE DEFAULT SYSDATE,

   CONSTRAINT UQ_equipment_assignment UNIQUE (serial_number, employee_id, assignment_date),

   FOREIGN KEY (serial_number) REFERENCES lab_equipment (serial_number),
   FOREIGN KEY (employee_id) REFERENCES scientist_details (employee_id)
);

ALTER TABLE equipment_assignment
ADD assignment_day DATE GENERATED ALWAYS AS (TRUNC(assignment_date)) VIRTUAL;

CREATE UNIQUE INDEX uq_equipment_one_assignment_day
ON equipment_assignment (serial_number, assignment_day);


--TRIGGER FOR: DATA NORMALIZATION
CREATE OR REPLACE TRIGGER trg_equipment_assignment_biu
BEFORE INSERT OR UPDATE ON equipment_assignment
FOR EACH ROW
BEGIN
  :NEW.serial_number := UPPER(TRIM(:NEW.serial_number));
  :NEW.employee_id := UPPER(TRIM(:NEW.employee_id));

  IF :NEW.assignment_date IS NULL THEN
    :NEW.assignment_date := SYSDATE;
  END IF;

  IF NOT REGEXP_LIKE(:NEW.serial_number, '^EQ[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20500, 'Serial number must follow format EQ001');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.employee_id, '^SC[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20501, 'Employee ID must follow format SC001');
  END IF;

  IF TRUNC(:NEW.assignment_date) > TRUNC(SYSDATE) THEN
    RAISE_APPLICATION_ERROR(-20502, 'Assignment date cannot be in the future');
  END IF;
END;
/


-- material_requests
CREATE TABLE material_requests (
   request_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   reference_number VARCHAR2(5) NOT NULL,
   employee_id VARCHAR2(5) NOT NULL,
   request_date DATE DEFAULT SYSDATE,
   material_quantity NUMBER NOT NULL CHECK (material_quantity > 0),

   FOREIGN KEY (reference_number) REFERENCES lab_materials (reference_number),
   FOREIGN KEY (employee_id) REFERENCES scientist_details (employee_id)
);

ALTER TABLE material_requests
ADD request_day DATE GENERATED ALWAYS AS (TRUNC(request_date)) VIRTUAL;

CREATE UNIQUE INDEX uq_material_request_day
ON material_requests (reference_number, employee_id, request_day);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_material_requests_biu
BEFORE INSERT OR UPDATE ON material_requests
FOR EACH ROW
BEGIN
  :NEW.reference_number := UPPER(TRIM(:NEW.reference_number));
  :NEW.employee_id := UPPER(TRIM(:NEW.employee_id));

  IF :NEW.request_date IS NULL THEN
    :NEW.request_date := TRUNC(SYSDATE);
  END IF;

  IF NOT REGEXP_LIKE(:NEW.reference_number, '^MA[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20600, 'Reference number must follow format MA001');
  END IF;

  IF NOT REGEXP_LIKE(:NEW.employee_id, '^SC[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20601, 'Employee ID must follow format SC001');
  END IF;

  IF TRUNC(:NEW.request_date) > TRUNC(SYSDATE) THEN
    RAISE_APPLICATION_ERROR(-20602, 'Request date cannot be in the future');
  END IF;

  IF :NEW.material_quantity <= 0 THEN
    RAISE_APPLICATION_ERROR(-20603, 'Material quantity must be greater than zero');
  END IF;

  IF :NEW.material_quantity > 100 THEN
    RAISE_APPLICATION_ERROR(-20604, 'Material quantity is unusually high and needs review');
  END IF;
END;
/


-- purchase_details
CREATE TABLE purchase_details (
   purchase_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
   reference_number VARCHAR2(5) NOT NULL,
   material_quantity NUMBER NOT NULL CHECK (material_quantity > 0),
   supplier_id NUMBER NOT NULL,
   purchase_date DATE DEFAULT TRUNC(SYSDATE),

   FOREIGN KEY (reference_number) REFERENCES lab_materials (reference_number),
   FOREIGN KEY (supplier_id) REFERENCES supplier_details (supplier_id)
);

--TRIGGER FOR: DATA NORMALIZATION AND BUSINESS RULES
CREATE OR REPLACE TRIGGER trg_purchase_details_biu
BEFORE INSERT OR UPDATE ON purchase_details
FOR EACH ROW
DECLARE
  v_count NUMBER;
BEGIN
  :NEW.reference_number := UPPER(TRIM(:NEW.reference_number));

  IF :NEW.purchase_date IS NULL THEN
    :NEW.purchase_date := TRUNC(SYSDATE);
  END IF;

  IF NOT REGEXP_LIKE(:NEW.reference_number, '^MA[0-9]{3}$') THEN
    RAISE_APPLICATION_ERROR(-20700, 'Reference number must follow format MA001');
  END IF;

  IF :NEW.material_quantity <= 0 THEN
    RAISE_APPLICATION_ERROR(-20701, 'Purchase quantity must be greater than zero');
  END IF;

  IF :NEW.material_quantity > 1000 THEN
    RAISE_APPLICATION_ERROR(-20702, 'Purchase quantity is unusually high and needs review');
  END IF;

  IF TRUNC(:NEW.purchase_date) > TRUNC(SYSDATE) THEN
    RAISE_APPLICATION_ERROR(-20703, 'Purchase date cannot be in the future');
  END IF;

  IF :NEW.supplier_id IS NULL THEN
    RAISE_APPLICATION_ERROR(-20704, 'Supplier is required');
  END IF;

  SELECT COUNT(*)
  INTO v_count
  FROM lab_materials
  WHERE reference_number = :NEW.reference_number
    AND supplier_id = :NEW.supplier_id;

  IF v_count = 0 THEN
    RAISE_APPLICATION_ERROR(
      -20705,
      'Purchase supplier must match the material supplier'
    );
  END IF;
END;
/


