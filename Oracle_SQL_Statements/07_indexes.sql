--INDEXES
-- Supplier lookups
CREATE INDEX idx_supplier_location ON supplier_details(supplier_location);
CREATE INDEX idx_supplier_contact ON supplier_details(supplier_contact);

-- Scientist lookups
CREATE INDEX idx_scientist_email ON scientist_details(scientist_email);
CREATE INDEX idx_scientist_dept ON scientist_details(department_id);
CREATE INDEX idx_scientist_spec ON scientist_details(specialization_id);

-- Equipment lookups
CREATE INDEX idx_equipment_supplier ON lab_equipment(supplier_id);
CREATE INDEX idx_equipment_dept ON lab_equipment(department_id);

-- Materials lookups
CREATE INDEX idx_material_supplier ON lab_materials(supplier_id);

-- Requests and purchases
CREATE INDEX idx_request_employee ON material_requests(employee_id);
CREATE INDEX idx_purchase_supplier ON purchase_details(supplier_id);

-- Supplier indexes
CREATE INDEX idx_supplier_name ON supplier_details(supplier_name);
CREATE INDEX idx_supplier_email ON supplier_details(supplier_email);

-- Department indexes
CREATE INDEX idx_department_name ON departments(department_name);

-- Specialization indexes
CREATE INDEX idx_specialization_name ON department_specialization(specialization_name);
CREATE INDEX idx_specialization_dept ON department_specialization(department_id);

-- Scientist indexes
CREATE INDEX idx_scientist_name ON scientist_details(scientist_name);
CREATE INDEX idx_scientist_gender ON scientist_details(gender_id);

-- Equipment indexes
CREATE INDEX idx_equipment_name ON lab_equipment(equipment_name);
CREATE INDEX idx_equipment_cost ON lab_equipment(equipment_cost);

-- Materials indexes
CREATE INDEX idx_material_name ON lab_materials(material_name);
CREATE INDEX idx_material_cost ON lab_materials(material_cost);

-- Assignment indexes
CREATE INDEX idx_assignment_employee ON equipment_assignment(employee_id);
CREATE INDEX idx_assignment_date ON equipment_assignment(assignment_date);

-- Request indexes
CREATE INDEX idx_request_date ON material_requests(request_date);
CREATE INDEX idx_request_quantity ON material_requests(material_quantity);

-- Purchase indexes
CREATE INDEX idx_purchase_date ON purchase_details(purchase_date);
CREATE INDEX idx_purchase_quantity ON purchase_details(material_quantity);
