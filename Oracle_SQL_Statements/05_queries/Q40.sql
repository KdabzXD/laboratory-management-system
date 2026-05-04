--40. Find equipment that costs more than the average cost. (REPORT)
SELECT * FROM lab_equipment
WHERE equipment_cost > (SELECT AVG(equipment_cost) FROM lab_equipment);

