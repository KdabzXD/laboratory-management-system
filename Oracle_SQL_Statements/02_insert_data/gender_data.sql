-- gender
  INSERT INTO gender (gender_name) 
  SELECT 'Male' FROM dual
  UNION ALL
  SELECT 'Female' FROM dual
  UNION ALL
  SELECT 'Other' FROM dual;