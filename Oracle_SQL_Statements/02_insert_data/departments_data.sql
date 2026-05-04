-- departments
  INSERT INTO departments (department_name) 
  SELECT 'Biology' FROM dual
  UNION ALL 
  SELECT 'Chemistry' FROM dual
  UNION ALL
  SELECT 'Physics' FROM dual;