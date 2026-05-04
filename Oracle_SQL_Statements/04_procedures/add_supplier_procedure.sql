CREATE OR REPLACE PROCEDURE add_supplier (
    p_supplier_name        IN NVARCHAR2,
    p_supplier_address     IN NVARCHAR2,
    p_supplier_location    IN NVARCHAR2,
    p_supplier_description IN NVARCHAR2,
    p_supplier_email       IN NVARCHAR2,
    p_supplier_contact     IN NVARCHAR2
)
IS
BEGIN
    INSERT INTO supplier_details (
        supplier_name,
        supplier_address,
        supplier_location,
        supplier_description,
        supplier_email,
        supplier_contact
    )
    VALUES (
        p_supplier_name,
        p_supplier_address,
        p_supplier_location,
        p_supplier_description,
        p_supplier_email,
        p_supplier_contact
    );

    COMMIT;
END;
/