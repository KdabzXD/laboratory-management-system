--42. List suppliers who never supplied materials.
SELECT *
FROM supplier_details sd
WHERE NOT EXISTS (
  SELECT 1
  FROM lab_materials lm
  WHERE lm.supplier_id = sd.supplier_id
);