-- department specialization
  INSERT INTO department_specialization (specialization_name, department_id)
  SELECT 'Microbiology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Zoology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Botany', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Genetics', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Molecular Biology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Ecology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Evolutionary Biology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL
  SELECT 'Marine Biology', (SELECT department_id FROM departments WHERE department_name='Biology') FROM dual
  UNION ALL

  SELECT 'Organic Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Inorganic Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Analytical Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Physical Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Biochemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Industrial Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Environmental Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL
  SELECT 'Polymer Chemistry', (SELECT department_id FROM departments WHERE department_name='Chemistry') FROM dual
  UNION ALL

  SELECT 'Astrophysics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Quantum Mechanics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Particle Physics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Nuclear Physics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Optics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Thermodynamics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Solid State Physics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual
  UNION ALL
  SELECT 'Biophysics', (SELECT department_id FROM departments WHERE department_name='Physics') FROM dual;