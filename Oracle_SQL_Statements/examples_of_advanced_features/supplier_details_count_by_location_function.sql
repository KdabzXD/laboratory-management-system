CREATE OR REPLACE FUNCTION count_suppliers_by_location (
  p_location IN NVARCHAR2
)
RETURN NUMBER
AS
  v_count NUMBER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM supplier_details
  WHERE supplier_location = INITCAP(TRIM(p_location));

  RETURN v_count;
END;
/

/*
EXAMPLE USE
SELECT count_suppliers_by_location('nairobi') AS nairobi_suppliers
FROM dual;
*/