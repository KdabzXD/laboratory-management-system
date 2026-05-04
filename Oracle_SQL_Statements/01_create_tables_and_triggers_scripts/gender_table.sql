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

