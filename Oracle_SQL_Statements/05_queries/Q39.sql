--39. Find scientists older than average age. (REPORT)
SELECT * FROM scientist_details
WHERE scientist_age > (SELECT AVG(scientist_age) FROM scientist_details);
