--SESSION CONTROL PACKAGE FOR BACKEND
CREATE OR REPLACE PACKAGE security_ctx AS
    PROCEDURE set_role(p_role VARCHAR2);
    FUNCTION get_role RETURN VARCHAR2;
END security_ctx;
/

CREATE OR REPLACE PACKAGE BODY security_ctx AS
    g_role VARCHAR2(20);

    PROCEDURE set_role(p_role VARCHAR2) IS
    BEGIN
        g_role := p_role;
    END;

    FUNCTION get_role RETURN VARCHAR2 IS
    BEGIN
        RETURN g_role;
    END;
END;
/

--CREATE ROLES TABLE AND INSERT DATA
CREATE TABLE app_users (
    role_name VARCHAR2(20) PRIMARY KEY,
    pin VARCHAR2(8) NOT NULL
);

INSERT INTO app_users VALUES ('ADMIN', '12345678');
INSERT INTO app_users VALUES ('EDITOR', '87654321');
INSERT INTO app_users VALUES ('VIEWER', '00000000');

COMMIT;

--ROLE LOGIN PROCEDURE
CREATE OR REPLACE PROCEDURE login_user (
    p_role IN VARCHAR2,
    p_pin  IN VARCHAR2
) AS
    v_pin VARCHAR2(8);
BEGIN
    SELECT pin INTO v_pin
    FROM app_users
    WHERE role_name = p_role;

    IF v_pin = p_pin THEN
        security_ctx.set_role(p_role);
    ELSE
        RAISE_APPLICATION_ERROR(-20001, 'Invalid PIN');
    END IF;

EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20002, 'Role does not exist');
END;
/

--SUPPLIER SECURITY
CREATE OR REPLACE TRIGGER trg_supplier_security
BEFORE INSERT OR UPDATE OR DELETE ON supplier_details
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() <> 'ADMIN' THEN
        RAISE_APPLICATION_ERROR(-20010, 'Only ADMIN can modify supplier data');
    END IF;
END;
/

--SCIENTIST SECURITY
CREATE OR REPLACE TRIGGER trg_scientist_security
BEFORE INSERT OR UPDATE OR DELETE ON scientist_details
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() <> 'ADMIN' THEN
        RAISE_APPLICATION_ERROR(-20011, 'Only ADMIN can modify scientist data');
    END IF;
END;
/

--EQUIPMENT ASSIGNMENT SECURITY
CREATE OR REPLACE TRIGGER trg_equipment_assignment_security
BEFORE INSERT OR UPDATE OR DELETE ON equipment_assignment
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() NOT IN ('ADMIN', 'EDITOR') THEN
        RAISE_APPLICATION_ERROR(-20012, 'No permission to modify assignments');
    END IF;
END;
/

--MATERIAL REQUEST SECURITY
CREATE OR REPLACE TRIGGER trg_material_requests_security
BEFORE INSERT OR UPDATE OR DELETE ON material_requests
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() NOT IN ('ADMIN', 'EDITOR') THEN
        RAISE_APPLICATION_ERROR(-20013, 'No permission to modify requests');
    END IF;
END;
/

--PURCHASE DETAILS SECURITY
CREATE OR REPLACE TRIGGER trg_purchase_security
BEFORE INSERT OR UPDATE OR DELETE ON purchase_details
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() NOT IN ('ADMIN', 'EDITOR') THEN
        RAISE_APPLICATION_ERROR(-20014, 'No permission to modify purchases');
    END IF;
END;
/

--LAB EQUIPMENT SECURITY
CREATE OR REPLACE TRIGGER trg_equipment_master_security
BEFORE INSERT OR UPDATE OR DELETE ON lab_equipment
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() <> 'ADMIN' THEN
        RAISE_APPLICATION_ERROR(-20015, 'Only ADMIN can modify equipment');
    END IF;
END;
/

--LAB MATERIALS SECURITY
CREATE OR REPLACE TRIGGER trg_materials_security
BEFORE INSERT OR UPDATE OR DELETE ON lab_materials
FOR EACH ROW
BEGIN
    IF security_ctx.get_role() <> 'ADMIN' THEN
        RAISE_APPLICATION_ERROR(-20016, 'Only ADMIN can modify materials');
    END IF;
END;
/