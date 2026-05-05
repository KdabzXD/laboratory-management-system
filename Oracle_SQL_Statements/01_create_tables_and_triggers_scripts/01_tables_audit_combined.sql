-- =========================================
-- DROP AUDIT TABLES (RESET SECTION)
-- =========================================

DROP TABLE purchase_details_audit CASCADE CONSTRAINTS;
DROP TABLE material_requests_audit CASCADE CONSTRAINTS;
DROP TABLE equipment_assignment_audit CASCADE CONSTRAINTS;
DROP TABLE lab_materials_audit CASCADE CONSTRAINTS;
DROP TABLE lab_equipment_audit CASCADE CONSTRAINTS;
DROP TABLE scientist_audit CASCADE CONSTRAINTS;
DROP TABLE department_specialization_audit CASCADE CONSTRAINTS;
DROP TABLE department_audit CASCADE CONSTRAINTS;
DROP TABLE supplier_audit CASCADE CONSTRAINTS;


CREATE TABLE supplier_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY,
  supplier_id NUMBER NOT NULL,
  action_type VARCHAR2(20),
  action_date DATE,
  FOREIGN KEY (supplier_id) REFERENCES supplier_details (supplier_id)
);

--TRIGGER
CREATE OR REPLACE TRIGGER trg_supplier_audit_insert
AFTER INSERT ON supplier_details
FOR EACH ROW
BEGIN
  INSERT INTO supplier_audit (supplier_id, action_type, action_date)
  VALUES (:NEW.supplier_id, 'INSERT', SYSDATE);
END;
/

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


CREATE TABLE lab_materials_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference_number VARCHAR2(5),
  old_material_name VARCHAR2(50),
  new_material_name VARCHAR2(50),
  old_material_description VARCHAR2(250),
  new_material_description VARCHAR2(250),
  old_supplier_id NUMBER,
  new_supplier_id NUMBER,
  old_material_cost NUMBER,
  new_material_cost NUMBER,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_lab_materials_audit
AFTER INSERT OR UPDATE ON lab_materials
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO lab_materials_audit (
      reference_number,
      new_material_name,
      new_material_description,
      new_supplier_id,
      new_material_cost,
      action_type
    )
    VALUES (
      :NEW.reference_number,
      :NEW.material_name,
      :NEW.material_description,
      :NEW.supplier_id,
      :NEW.material_cost,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO lab_materials_audit (
      reference_number,
      old_material_name,
      new_material_name,
      old_material_description,
      new_material_description,
      old_supplier_id,
      new_supplier_id,
      old_material_cost,
      new_material_cost,
      action_type
    )
    VALUES (
      :OLD.reference_number,
      :OLD.material_name,
      :NEW.material_name,
      :OLD.material_description,
      :NEW.material_description,
      :OLD.supplier_id,
      :NEW.supplier_id,
      :OLD.material_cost,
      :NEW.material_cost,
      'UPDATE'
    );
  END IF;
END;
/

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
AFTER INSERT OR UPDATE ON material_requests
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
  END IF;
END;
/

CREATE TABLE purchase_details_audit (
  audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  purchase_id NUMBER,
  reference_number VARCHAR2(5),
  old_material_quantity NUMBER,
  new_material_quantity NUMBER,
  old_supplier_id NUMBER,
  new_supplier_id NUMBER,
  old_purchase_date DATE,
  new_purchase_date DATE,
  action_type VARCHAR2(10),
  action_date TIMESTAMP DEFAULT SYSTIMESTAMP
);

CREATE OR REPLACE TRIGGER trg_purchase_details_audit
AFTER INSERT OR UPDATE ON purchase_details
FOR EACH ROW
BEGIN
  IF INSERTING THEN
    INSERT INTO purchase_details_audit (
      purchase_id,
      reference_number,
      new_material_quantity,
      new_supplier_id,
      new_purchase_date,
      action_type
    )
    VALUES (
      :NEW.purchase_id,
      :NEW.reference_number,
      :NEW.material_quantity,
      :NEW.supplier_id,
      :NEW.purchase_date,
      'INSERT'
    );
  ELSIF UPDATING THEN
    INSERT INTO purchase_details_audit (
      purchase_id,
      reference_number,
      old_material_quantity,
      new_material_quantity,
      old_supplier_id,
      new_supplier_id,
      old_purchase_date,
      new_purchase_date,
      action_type
    )
    VALUES (
      :OLD.purchase_id,
      :NEW.reference_number,
      :OLD.material_quantity,
      :NEW.material_quantity,
      :OLD.supplier_id,
      :NEW.supplier_id,
      :OLD.purchase_date,
      :NEW.purchase_date,
      'UPDATE'
    );
  END IF;
END;
/