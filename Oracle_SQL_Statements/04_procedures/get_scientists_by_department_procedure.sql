CREATE OR REPLACE PROCEDURE get_scientists_by_department (
    p_department_id IN NUMBER,
    p_result OUT SYS_REFCURSOR
)
IS
BEGIN
    OPEN p_result FOR
        SELECT employee_id, scientist_name, scientist_email
        FROM scientist_details
        WHERE department_id = p_department_id;
END;
/