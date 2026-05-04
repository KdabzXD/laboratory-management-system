CREATE OR REPLACE PROCEDURE add_scientist (
    p_employee_id       IN VARCHAR2,
    p_name              IN VARCHAR2,
    p_age               IN NUMBER,
    p_email             IN VARCHAR2,
    p_phone             IN VARCHAR2,
    p_gender_id         IN NUMBER,
    p_specialization_id IN NUMBER,
    p_department_id     IN NUMBER
)
IS
    v_count NUMBER;
BEGIN
    -- Check specialization belongs to department
    SELECT COUNT(*) INTO v_count
    FROM department_specialization
    WHERE specialization_id = p_specialization_id
      AND department_id = p_department_id;

    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(
            -20060,
            'Specialization does not belong to the given department'
        );
    END IF;

    INSERT INTO scientist_details (
        employee_id,
        scientist_name,
        scientist_age,
        scientist_email,
        phone_number,
        gender_id,
        specialization_id,
        department_id
    )
    VALUES (
        p_employee_id,
        p_name,
        p_age,
        p_email,
        p_phone,
        p_gender_id,
        p_specialization_id,
        p_department_id
    );

    COMMIT;
END;
/