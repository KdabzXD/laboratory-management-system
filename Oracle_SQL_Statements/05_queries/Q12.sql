--12. All departments and their specializations. (REPORT)
SELECT d.department_name, sp.specialization_name
FROM departments d
JOIN department_specialization sp ON d.department_id = sp.department_id;
