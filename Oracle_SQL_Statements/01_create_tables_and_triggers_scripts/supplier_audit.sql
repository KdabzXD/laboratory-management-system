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