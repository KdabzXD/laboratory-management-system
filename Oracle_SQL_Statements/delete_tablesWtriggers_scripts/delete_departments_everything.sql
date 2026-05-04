DROP TABLE departments CASCADE CONSTRAINTS;

DROP TRIGGER trg_department_clean_data;
DROP TRIGGER trg_department_biu;
DROP TRIGGER trg_department_no_delete;
DROP TRIGGER trg_department_audit;