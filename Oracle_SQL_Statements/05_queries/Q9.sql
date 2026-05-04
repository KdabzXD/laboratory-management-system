--9. All assignments with the scientist name and equipment name. 
SELECT ea.assignment_id, s.scientist_name, e.equipment_name
FROM equipment_assignment ea
JOIN scientist_details s ON ea.employee_id = s.employee_id 
JOIN lab_equipment e ON ea.serial_number = e.serial_number;
