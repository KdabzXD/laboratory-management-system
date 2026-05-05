--FUNCTIONS

-- Age of scientist
CREATE OR REPLACE FUNCTION fn_scientist_age_category(p_age NUMBER)
RETURN VARCHAR2
AS
BEGIN
  IF p_age < 30 THEN RETURN 'Junior';
  ELSIF p_age < 50 THEN RETURN 'Mid-career';
  ELSE RETURN 'Senior';
  END IF;
END;
/

-- Total cost of materials requested by a scientist
CREATE OR REPLACE FUNCTION fn_total_material_cost(p_employee_id VARCHAR2)
RETURN NUMBER
AS
  v_total NUMBER;
BEGIN
  SELECT SUM(m.material_cost * r.material_quantity)
  INTO v_total
  FROM material_requests r
  JOIN lab_materials m ON r.reference_number = m.reference_number
  WHERE r.employee_id = p_employee_id;

  RETURN NVL(v_total,0);
END;
/

-- Equipment assigned count per scientist
CREATE OR REPLACE FUNCTION fn_equipment_count(p_employee_id VARCHAR2)
RETURN NUMBER
AS
  v_count NUMBER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM equipment_assignment
  WHERE employee_id = p_employee_id;

  RETURN v_count;
END;
/

-- Function: validate email format
CREATE OR REPLACE FUNCTION fn_validate_email(p_email VARCHAR2)
RETURN VARCHAR2
AS
BEGIN
  IF REGEXP_LIKE(p_email, '^[^@]+@[^@]+\.[^@]+$') THEN
    RETURN 'VALID';
  ELSE
    RETURN 'INVALID';
  END IF;
END;
/

-- Function: calculate scientist workload (requests + assignments)
CREATE OR REPLACE FUNCTION fn_scientist_workload(p_employee_id VARCHAR2)
RETURN NUMBER
AS
  v_total NUMBER;
BEGIN
  SELECT (SELECT COUNT(*) FROM material_requests WHERE employee_id = p_employee_id)
       + (SELECT COUNT(*) FROM equipment_assignment WHERE employee_id = p_employee_id)
  INTO v_total
  FROM dual;

  RETURN v_total;
END;
/

-- Function: supplier total purchases
CREATE OR REPLACE FUNCTION fn_supplier_total_purchases(p_supplier_id NUMBER)
RETURN NUMBER
AS
  v_total NUMBER;
BEGIN
  SELECT SUM(material_quantity)
  INTO v_total
  FROM purchase_details
  WHERE supplier_id = p_supplier_id;

  RETURN NVL(v_total,0);
END;
/

-- Function: average equipment cost per department
CREATE OR REPLACE FUNCTION fn_avg_equipment_cost(p_department_id NUMBER)
RETURN NUMBER
AS
  v_avg NUMBER;
BEGIN
  SELECT AVG(equipment_cost)
  INTO v_avg
  FROM lab_equipment
  WHERE department_id = p_department_id;

  RETURN NVL(v_avg,0);
END;
/

-- Function: material request frequency
CREATE OR REPLACE FUNCTION fn_material_request_count(p_reference_number VARCHAR2)
RETURN NUMBER
AS
  v_count NUMBER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM material_requests
  WHERE reference_number = p_reference_number;

  RETURN v_count;
END;
/


