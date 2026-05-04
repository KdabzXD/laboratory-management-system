DROP TABLE scientist_details CASCADE CONSTRAINTS;

DROP TRIGGER trg_scientist_biu;
DROP TRIGGER trg_scientist_dept_spec_match;
DROP TRIGGER trg_scientist_no_delete;
DROP TRIGGER trg_scientist_audit;