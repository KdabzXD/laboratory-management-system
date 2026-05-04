--8. Equipment assignments. (REPORT)
SELECT ea.assignment_id, ea.assignment_date, s.scientist_name, d.department_name, e.equipment_name, e.equipment_cost
FROM equipment_assignment ea
JOIN scientist_details s ON ea.employee_id = s.employee_id
JOIN departments d ON s.department_id = d.department_id
JOIN lab_equipment e ON ea.serial_number = e.serial_number
ORDER BY ea.assignment_date DESC;
