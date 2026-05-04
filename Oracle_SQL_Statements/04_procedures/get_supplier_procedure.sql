CREATE OR REPLACE PROCEDURE get_supplier (
    p_supplier_id      IN NUMBER,
    p_supplier_name    OUT NVARCHAR2,
    p_supplier_email   OUT NVARCHAR2
)
IS
BEGIN
    SELECT supplier_name, supplier_email
    INTO p_supplier_name, p_supplier_email
    FROM supplier_details
    WHERE supplier_id = p_supplier_id;
END;
/