-- SCIENTISTS
INSERT INTO scientist_details (employee_id, scientist_name, scientist_age, scientist_email, phone_number, gender_id, specialization_id, department_id) 
SELECT 'SC001','Dr. Kamau Mwangi',45,'kamau1@mail.co.ke','0710000001',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Microbiology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC002','Dr. Achieng Odhiambo',50,'achieng2@mail.co.ke','0710000002',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Biochemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC003','Dr. Otieno Onyango',40,'otieno3@mail.co.ke','0710000003',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Particle Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC004','Dr. Wanjiku Njeri',55,'wanjiku4@mail.co.ke','0710000004',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Zoology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC005','Dr. Kiptoo Cheruiyot',35,'kiptoo5@mail.co.ke','0710000005',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Genetics'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC006','Dr. Naliaka Wekesa',60,'naliaka6@mail.co.ke','0710000006',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Biophysics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC007','Dr. Mutiso Kilonzo',42,'mutiso7@mail.co.ke','0710000007',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Ecology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC008','Dr. Wambui Kariuki',48,'wambui8@mail.co.ke','0710000008',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Environmental Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC009','Dr. Kipchoge Rotich',38,'kipchoge9@mail.co.ke','0710000009',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Organic Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC010','Dr. Auma Ouma',52,'auma10@mail.co.ke','0710000010',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Quantum Mechanics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC011','Dr. Njuguna Maina',44,'njuguna11@mail.co.ke','0710000011',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Industrial Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC012','Dr. Chebet Jepchirchir',47,'chebet12@mail.co.ke','0710000012',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Solid State Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC013','Dr. Muthoni Waithera',41,'muthoni13@mail.co.ke','0710000013',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Zoology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC014','Dr. Barasa Wanyonyi',53,'barasa14@mail.co.ke','0710000014',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Environmental Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC015','Dr. Atieno Achieng',39,'atieno15@mail.co.ke','0710000015',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Ecology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC016','Dr. Koskei Langat',46,'koskei16@mail.co.ke','0710000016',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Microbiology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC017','Dr. Mwikali Nzisa',43,'mwikali17@mail.co.ke','0710000017',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Analytical Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC018','Dr. Simiyu Wafula',49,'simiyu18@mail.co.ke','0710000018',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Quantum Mechanics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC019','Dr. Kiprono Bett',37,'kiprono19@mail.co.ke','0710000019',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Particle Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC020','Dr. Moraa Nyaboke',51,'moraa20@mail.co.ke','0710000020',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Botany'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC021','Dr. Karanja Gitau',41,'karanja21@mail.co.ke','0710000021',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Ecology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC022','Dr. Njeri Wambui',36,'njeri22@mail.co.ke','0710000022',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Biochemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC023','Dr. Ouma Otieno',47,'ouma23@mail.co.ke','0710000023',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Evolutionary Biology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC024','Dr. Kiprotich Rono',39,'kiprotich24@mail.co.ke','0710000024',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Nuclear Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC025','Dr. Wekesa Barasa',45,'wekesa25@mail.co.ke','0710000025',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Microbiology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC026','Dr. Cheruiyot Kiptoo',42,'cheruiyot26@mail.co.ke','0710000026',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Organic Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC027','Dr. Nyongesa Simiyu',44,'nyongesa27@mail.co.ke','0710000027',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Quantum Mechanics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC028','Dr. Akinyi Achieng',38,'akinyi28@mail.co.ke','0710000028',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Ecology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC029','Dr. Mutua Nzomo',50,'mutua29@mail.co.ke','0710000029',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Industrial Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC030','Dr. Kiplimo Rotich',41,'kiplimo30@mail.co.ke','0710000030',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Particle Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC031','Dr. Jepkemboi Chebet',37,'jep31@mail.co.ke','0710000031',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Zoology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC032','Dr. Mwende Mutiso',46,'mwende32@mail.co.ke','0710000032',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Biochemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC033','Dr. Otieno Ochieng',43,'otieno33@mail.co.ke','0710000033',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Ecology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC034','Dr. Naliaka Wanjiru',39,'naliaka34@mail.co.ke','0710000034',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Zoology'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC035','Dr. Kiptoo Korir',52,'kiptoo35@mail.co.ke','0710000035',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Industrial Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC036','Dr. Barasa Wafula',48,'barasa36@mail.co.ke','0710000036',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Biophysics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC037','Dr. Moraa Kemunto',40,'moraa37@mail.co.ke','0710000037',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Botany'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual
UNION ALL

SELECT 'SC038','Dr. Kibet Kiprono',45,'kibet38@mail.co.ke','0710000038',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Analytical Chemistry'),
(SELECT department_id FROM departments WHERE department_name='Chemistry')
FROM dual
UNION ALL

SELECT 'SC039','Dr. Auma Nyaboke',42,'auma39@mail.co.ke','0710000039',
(SELECT gender_id FROM gender WHERE gender_name='Female'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Particle Physics'),
(SELECT department_id FROM departments WHERE department_name='Physics')
FROM dual
UNION ALL

SELECT 'SC040','Dr. Kariuki Maina',47,'kariuki40@mail.co.ke','0710000040',
(SELECT gender_id FROM gender WHERE gender_name='Male'),
(SELECT specialization_id FROM department_specialization WHERE specialization_name='Genetics'),
(SELECT department_id FROM departments WHERE department_name='Biology')
FROM dual;