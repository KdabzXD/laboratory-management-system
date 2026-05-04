DROP TABLE department_specialization CASCADE CONSTRAINTS;

DROP TRIGGER trg_dept_spec_biu;
DROP TRIGGER trg_dept_spec_no_delete;
DROP TRIGGER trg_dept_spec_audit;