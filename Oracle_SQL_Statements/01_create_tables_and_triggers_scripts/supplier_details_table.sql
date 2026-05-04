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