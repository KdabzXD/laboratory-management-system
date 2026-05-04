CREATE OR REPLACE PROCEDURE get_scientist (
    p_employee_id IN VARCHAR2,
    p_name        OUT VARCHAR2,
    p_age         OUT NUMBER,
    p_email       OUT VARCHAR2
)
IS
BEGIN
    SELECT scientist_name, scientist_age, scientist_email
    INTO p_name, p_age, p_email
    FROM scientist_details
    WHERE employee_id = p_employee_id;
END;
/