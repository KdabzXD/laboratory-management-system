CREATE OR REPLACE VIEW v_supplier_details_masked AS
SELECT
    supplier_id,
    supplier_name,

    -- MASK ADDRESS (optional partial hiding)
    SUBSTR(supplier_address, 1, 3) || '****' AS supplier_address,

    supplier_location,
    supplier_description,

    -- MASK EMAIL
    REGEXP_REPLACE(supplier_email,
        '(^.).*(@.*$)',
        '\1****\2'
    ) AS supplier_email,

    -- MASK PHONE (first 4 digits only)
    SUBSTR(supplier_contact, 1, 4) || '****' AS supplier_contact
FROM supplier_details;