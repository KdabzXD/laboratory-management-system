CREATE OR REPLACE PROCEDURE update_supplier (
    p_supplier_id          IN NUMBER,
    p_supplier_name        IN NVARCHAR2,
    p_supplier_address     IN NVARCHAR2,
    p_supplier_location    IN NVARCHAR2,
    p_supplier_description IN NVARCHAR2,
    p_supplier_email       IN NVARCHAR2,
    p_supplier_contact     IN NVARCHAR2
)
IS
BEGIN
    UPDATE supplier_details
    SET supplier_name = p_supplier_name,
        supplier_address = p_supplier_address,
        supplier_location = p_supplier_location,
        supplier_description = p_supplier_description,
        supplier_email = p_supplier_email,
        supplier_contact = p_supplier_contact
    WHERE supplier_id = p_supplier_id;

    COMMIT;
END;
/