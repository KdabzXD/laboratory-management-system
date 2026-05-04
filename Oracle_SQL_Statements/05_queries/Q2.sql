--2. Show scientists, the equipment assigned to them, and the assignment date.
SELECT s.scientist_name, d.department_name, e.equipment_name, ea.assignment_date
FROM equipment_assignment ea
JOIN scientist_details s ON ea.employee_id = s.employee_id
JOIN lab_equipment e ON ea.serial_number = e.serial_number
JOIN departments d ON s.department_id = d.department_id
ORDER BY s.scientist_name;