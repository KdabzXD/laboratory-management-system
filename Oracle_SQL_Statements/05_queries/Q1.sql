--1. List all scientists with their departments, specialization names and gender. (REPORT)
SELECT s.employee_id, s.scientist_name, g.gender_name, d.department_name, sp.specialization_name
FROM scientist_details s
JOIN gender g ON s.gender_id = g.gender_id
JOIN departments d ON s.department_id = d.department_id
JOIN department_specialization sp 
  ON s.specialization_id = sp.specialization_id;
