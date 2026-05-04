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

