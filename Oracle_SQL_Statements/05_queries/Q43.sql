--43. Find the most expensive equipment.
SELECT * FROM lab_equipment
WHERE equipment_cost = (SELECT MAX(equipment_cost) FROM lab_equipment);
