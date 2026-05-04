CREATE OR REPLACE PROCEDURE update_scientist (
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
BEGIN
    UPDATE scientist_details
    SET scientist_name = p_name,
        scientist_age = p_age,
        scientist_email = p_email,
        phone_number = p_phone,
        gender_id = p_gender_id,
        specialization_id = p_specialization_id,
        department_id = p_department_id
    WHERE employee_id = p_employee_id;

    COMMIT;
END;
/