--26. Count scientists per gender. (REPORT)
SELECT g.gender_name, COUNT(*) AS total_scientists 
FROM scientist_details s
JOIN gender g ON s.gender_id = g.gender_id
GROUP BY g.gender_name;
