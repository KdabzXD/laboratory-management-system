CREATE OR REPLACE VIEW v_scientist_details_masked AS
SELECT
    employee_id,
    scientist_name,
    scientist_age,

    -- MASK EMAIL (first char + domain only)
    REGEXP_REPLACE(scientist_email,
        '(^.).*(@.*$)',
        '\1****\2'
    ) AS scientist_email,

    -- MASK PHONE (show first 4 digits only)
    SUBSTR(phone_number, 1, 4) || '****' AS phone_number,

    gender_id,
    specialization_id,
    department_id
FROM scientist_details;