DROP TABLE supplier_details CASCADE CONSTRAINTS;
DROP TABLE supplier_audit CASCADE CONSTRAINTS;

DROP TRIGGER trg_supplier_clean_data;
DROP TRIGGER trg_supplier_validate;
DROP TRIGGER trg_supplier_no_delete;
DROP TRIGGER trg_supplier_audit_insert;