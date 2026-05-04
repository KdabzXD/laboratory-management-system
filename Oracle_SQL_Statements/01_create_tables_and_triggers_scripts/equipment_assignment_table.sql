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