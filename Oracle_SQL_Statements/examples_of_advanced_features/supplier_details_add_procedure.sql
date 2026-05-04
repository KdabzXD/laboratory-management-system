CREATE OR REPLACE PROCEDURE add_supplier (
  p_name IN NVARCHAR2,
  p_address IN NVARCHAR2,
  p_location IN NVARCHAR2,
  p_description IN NVARCHAR2,
  p_email IN NVARCHAR2,
  p_contact IN NVARCHAR2
)
AS
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
    p_name,
    p_address,
    p_location,
    p_description,
    p_email,
    p_contact
  );
END;
/
