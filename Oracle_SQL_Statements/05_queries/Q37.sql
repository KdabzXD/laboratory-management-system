--37. Gender groups with more than 5 scientists. 
SELECT gender_id, COUNT(*) AS total_scientists
FROM scientist_details 
GROUP BY gender_id
HAVING COUNT(*) > 5;
