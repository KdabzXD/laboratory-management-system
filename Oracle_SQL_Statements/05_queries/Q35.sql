--35. Materials requested in quantities greater than 50 in total. (REPORT)
SELECT reference_number, SUM(material_quantity) AS total_quantity
FROM material_requests
GROUP BY reference_number
HAVING SUM(material_quantity) > 50;
