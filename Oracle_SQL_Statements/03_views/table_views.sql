--DEPARTMENT SPECIALIZATION VIEW
CREATE OR REPLACE VIEW vw_department_specialization AS
SELECT
  ds.specialization_id,
  ds.specialization_name,
  d.department_name
FROM department_specialization ds
JOIN departments d
  ON ds.department_id = d.department_id;
  
--SCIENTIST DETAILS VIEW
CREATE OR REPLACE VIEW vw_scientist_details AS
SELECT
  s.employee_id,
  s.scientist_name,
  s.scientist_age,
  s.scientist_email,
  s.phone_number,
  g.gender_name,
  d.department_name,
  ds.specialization_name
FROM scientist_details s
JOIN gender g
  ON s.gender_id = g.gender_id
JOIN departments d
  ON s.department_id = d.department_id
JOIN department_specialization ds
  ON s.specialization_id = ds.specialization_id;

--LAB EQUIPMENT VIEW
CREATE OR REPLACE VIEW vw_lab_equipment AS
SELECT
  e.serial_number,
  e.equipment_name,
  e.equipment_cost,
  d.department_name,
  s.supplier_name,
  s.supplier_email
FROM lab_equipment e
JOIN departments d
  ON e.department_id = d.department_id
JOIN supplier_details s
  ON e.supplier_id = s.supplier_id;

--LAB MATERIALS VIEW
CREATE OR REPLACE VIEW vw_lab_materials AS
SELECT
  m.reference_number,
  m.material_name,
  m.material_description,
  s.supplier_name,
  s.supplier_email,
  m.material_cost
FROM lab_materials m
JOIN supplier_details s
  ON m.supplier_id = s.supplier_id;

--EQUIPMENT ASSIGNMENT VIEW
CREATE OR REPLACE VIEW vw_equipment_assignment AS
SELECT
  ea.assignment_id,
  ea.serial_number,
  e.equipment_name,
  ea.employee_id,
  sd.scientist_name,
  ea.assignment_date
FROM equipment_assignment ea
JOIN lab_equipment e
  ON ea.serial_number = e.serial_number
JOIN scientist_details sd
  ON ea.employee_id = sd.employee_id;

--MATERIAL REQUESTS VIEW
CREATE OR REPLACE VIEW vw_material_requests AS
SELECT
  mr.request_id,
  mr.reference_number,
  lm.material_name,
  mr.employee_id,
  sd.scientist_name,
  mr.request_date,
  mr.material_quantity
FROM material_requests mr
JOIN lab_materials lm
  ON mr.reference_number = lm.reference_number
JOIN scientist_details sd
  ON mr.employee_id = sd.employee_id;

--PURCHASE DETAILS VIEW
CREATE OR REPLACE VIEW vw_purchase_details AS
SELECT
  p.purchase_id,
  p.reference_number,
  lm.material_name,
  p.material_quantity,
  s.supplier_name,
  s.supplier_email,
  p.purchase_date
FROM purchase_details p
JOIN lab_materials lm
  ON p.reference_number = lm.reference_number
JOIN supplier_details s
  ON p.supplier_id = s.supplier_id;
