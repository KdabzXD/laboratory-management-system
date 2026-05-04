--10. Material requests with scientist names, department name, quantity and request date. (REPORT)
SELECT mr.request_id, s.scientist_name, d.department_name, lm.material_name, mr.material_quantity, mr.request_date
FROM material_requests mr
JOIN scientist_details s ON mr.employee_id = s.employee_id
JOIN departments d ON s.department_id = d.department_id
JOIN lab_materials lm ON mr.reference_number = lm.reference_number
ORDER BY mr.request_date DESC;
