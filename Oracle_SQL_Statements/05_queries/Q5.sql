--5. Scientists with their full profile. (REPORT)
SELECT s.employee_id, s.scientist_name, s.scientist_age, g.gender_name, d.department_name, sp.specialization_name
FROM scientist_details s
JOIN gender g ON s.gender_id = g.gender_id
JOIN departments d ON s.department_id = d.department_id
JOIN department_specialization sp ON s.specialization_id = sp.specialization_id
ORDER BY d.department_name, s.scientist_name;
