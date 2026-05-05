-- supplier_details
  INSERT INTO supplier_details (supplier_name, supplier_address, supplier_location, supplier_description, supplier_email, supplier_contact)
   SELECT 'Karibu Lab Supplies','Nairobi Rd','Nairobi','Lab equipment','karibu@labs.co.ke','0712345678' FROM dual
   UNION ALL
   SELECT 'Afya Chem Solutions','Mombasa Rd','Mombasa','Chemicals','afyachem@labs.co.ke','0723456789' FROM dual
   UNION ALL
   SELECT 'Bio Kisumu Materials','Kisumu Rd','Kisumu','Biology','bio@labs.co.ke','0734567890' FROM dual
   UNION ALL
   SELECT 'Precision EA','Tech Park','Nairobi','Physics','precision@labs.co.ke','0745678901' FROM dual
   UNION ALL
   SELECT 'Eldo Labware','Eldoret Rd','Eldoret','Glassware','eldo@labs.co.ke','0756789012' FROM dual
   UNION ALL
   SELECT 'Nakuru Science Hub','Nakuru Lane','Nakuru','General','nakuru@labs.co.ke','0767890123' FROM dual
   UNION ALL
   SELECT 'Green Chem Kenya','Industrial Rd','Nairobi','Chemicals','green@labs.co.ke','0778901234' FROM dual
   UNION ALL
   SELECT 'Opti Lab Nairobi','Optics Rd','Nairobi','Optics','opti@labs.co.ke','0789012345' FROM dual
   UNION ALL
   SELECT 'Medi Lab Coast','Coast Rd','Mombasa','Medical','medilab@labs.co.ke','0790123456' FROM dual
   UNION ALL
   SELECT 'Nova Kisumu','Innovation Rd','Kisumu','Scientific','nova@labs.co.ke','0701234567' FROM dual
   UNION ALL
   SELECT 'Eco Lab Kenya','Green Rd','Nairobi','Eco','eco@labs.co.ke','0711111112' FROM dual
   UNION ALL
   SELECT 'Prime Eldoret','Tech Rd','Eldoret','Distributor','prime@labs.co.ke','0722222223' FROM dual;
   
   -- departments
  INSERT INTO departments (department_name) 
  SELECT 'Biology' FROM dual
  UNION ALL 
  SELECT 'Chemistry' FROM dual
  UNION ALL
  SELECT 'Physics' FROM dual;
  
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
  
  -- gender
  INSERT INTO gender (gender_name) 
  SELECT 'Male' FROM dual
  UNION ALL
  SELECT 'Female' FROM dual
  UNION ALL
  SELECT 'Other' FROM dual;
  
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

-- EQUIPMENT
INSERT INTO lab_equipment (serial_number, equipment_name, equipment_cost, department_id, supplier_id)
SELECT 'EQ001','Bunsen Burner',10000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke') FROM dual 
UNION ALL

SELECT 'EQ002','Oscilloscope',80000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ003','PCR Machine',250000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ004','Petri Dish Set',5000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ005','Laser Interferometer',220000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ006','Analytical Balance',35000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ007','Thermodynamics Apparatus',40000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ008','Spectrophotometer',180000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ009','Fume Hood',200000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='green@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ010','Centrifuge',90000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual 
UNION ALL

SELECT 'EQ011','Radiation Detector',150000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ012','Reagent Bottles Set',7000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ013','Dissection Kit',12000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ014','Particle Accelerator Model',500000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ015','Beaker Set',5000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ016','Autoclave',150000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ017','Spectrometer',150000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ018','Microscope',120000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ019','Magnetic Field Generator',95000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ020','Titration Kit',12000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ021','Incubator',70000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ022','Quantum Bench',30000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ023','Telescope',100000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ024','pH Meter',25000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ025','Digital Microscope',150000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ026','Water Bath',30000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ027','Incubator Pro',90000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ028','Gas Chromatograph',200000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ029','X-Ray Unit',400000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ030','Magnetic Stirrer',20000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ031','Centrifuge Pro',95000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ032','Spectrometer Pro',180000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ033','Vacuum Pump',70000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ034','pH Analyzer',30000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ035','Thermal Cycler',220000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ036','Electrophoresis Kit',60000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ037','Density Meter',45000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ038','Radiation Meter',150000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ039','Microscope HD',130000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ040','Lab Freezer',80000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ041','Spectro UV',140000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ042','Gas Analyzer',160000,
(SELECT department_id FROM departments WHERE department_name='Physics'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ043','Heating Mantle',25000,
(SELECT department_id FROM departments WHERE department_name='Chemistry'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke') FROM dual
UNION ALL

SELECT 'EQ044','Autoclave XL',200000,
(SELECT department_id FROM departments WHERE department_name='Biology'),
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke') FROM dual;

INSERT INTO lab_materials (reference_number, material_name, material_description, supplier_id, material_cost)
SELECT 'MA001','Hydrochloric Acid','Acid',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1500 FROM dual
UNION ALL

SELECT 'MA002','Slides','Glass',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
800 FROM dual
UNION ALL

SELECT 'MA003','Gas Tubing','Burner use',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1200 FROM dual
UNION ALL

SELECT 'MA004','Petri Dishes','Culture growth',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
3300 FROM dual
UNION ALL

SELECT 'MA005','Beaker Set','Glassware',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke'),
3500 FROM dual
UNION ALL

SELECT 'MA006','Cuvettes','Spectrometer use',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke'),
2500 FROM dual
UNION ALL

SELECT 'MA007','Agar Powder','Microbial growth',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
1800 FROM dual
UNION ALL

SELECT 'MA008','pH Paper','Acidity test',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
900 FROM dual
UNION ALL

SELECT 'MA009','Copper Wire','Physics use',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke'),
1600 FROM dual
UNION ALL

SELECT 'MA010','Test Tubes','Lab use',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke'),
2200 FROM dual
UNION ALL

SELECT 'MA011','Gloves','Safety',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke'),
700 FROM dual
UNION ALL

SELECT 'MA012','Thermometer','Temperature',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke'),
1500 FROM dual
UNION ALL

SELECT 'MA013','Lens Tissue','Cleaning',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='opti@labs.co.ke'),
600 FROM dual
UNION ALL

SELECT 'MA014','Sodium Chloride','Salt',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
500 FROM dual
UNION ALL

SELECT 'MA015','Gel Packs','Cooling',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
1300 FROM dual
UNION ALL

SELECT 'MA016','Carbon Rods','Electrochemistry',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke'),
1700 FROM dual
UNION ALL

SELECT 'MA017','Distilled Water','Pure water',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke'),
400 FROM dual
UNION ALL

SELECT 'MA018','Ethanol','Solvent',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
2000 FROM dual
UNION ALL

SELECT 'MA019','Coverslips','Microscope',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
900 FROM dual
UNION ALL

SELECT 'MA020','Nitrogen Gas','Gas supply',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='green@labs.co.ke'),
12000 FROM dual
UNION ALL

SELECT 'MA021','Hydrogen Peroxide','Oxidation',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1400 FROM dual
UNION ALL

SELECT 'MA022','Petroleum Jelly','Sealant',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke'),
800 FROM dual
UNION ALL

SELECT 'MA023','Magnets','Magnetism',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='precision@labs.co.ke'),
1100 FROM dual
UNION ALL

SELECT 'MA024','Filter Paper','Filtration',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke'),
950 FROM dual
UNION ALL

SELECT 'MA025','Sulfuric Acid','Acid',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1800 FROM dual
UNION ALL

SELECT 'MA026','Glucose','Sugar',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
900 FROM dual
UNION ALL

SELECT 'MA027','Ethanol 0.95','Solvent',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
2000 FROM dual
UNION ALL

SELECT 'MA028','Sodium Hydroxide','Base',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1600 FROM dual
UNION ALL

SELECT 'MA029','Agarose Gel','DNA work',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
2500 FROM dual
UNION ALL

SELECT 'MA030','Distilled Water XL','Water',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='karibu@labs.co.ke'),
600 FROM dual
UNION ALL         

SELECT 'MA031','Copper Sulfate','Chem',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1200 FROM dual
UNION ALL

SELECT 'MA032','Litmus Paper','Test',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
700 FROM dual
UNION ALL

SELECT 'MA033','Glass Rods','Stirring',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='eldo@labs.co.ke'),
1100 FROM dual
UNION ALL

SELECT 'MA034','Pipette Tips','Disposable',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='opti@labs.co.ke'),
1400 FROM dual
UNION ALL

SELECT 'MA035','Buffer Solution','pH',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1000 FROM dual
UNION ALL

SELECT 'MA036','DNA Kit','Biology',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
3000 FROM dual
UNION ALL

SELECT 'MA037','Protein Assay','Biology',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
2800 FROM dual
UNION ALL

SELECT 'MA038','Filter Membrane','Filter',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='nakuru@labs.co.ke'),
1200 FROM dual
UNION ALL

SELECT 'MA039','Nitric Acid','Acid',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1900 FROM dual
UNION ALL

SELECT 'MA040','Ammonia','Base',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1300 FROM dual
UNION ALL

SELECT 'MA041','Magnesium Ribbon','Chem',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
900 FROM dual
UNION ALL

SELECT 'MA042','Zinc Granules','Chem',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='afyachem@labs.co.ke'),
1000 FROM dual
UNION ALL

SELECT 'MA043','Starch Solution','Test',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
800 FROM dual
UNION ALL

SELECT 'MA044','Iodine Solution','Indicator',
(SELECT supplier_id FROM supplier_details WHERE supplier_email='bio@labs.co.ke'),
850 FROM dual;

-- EQUIPMENT ASSIGNMENT
INSERT INTO equipment_assignment (serial_number, employee_id, assignment_date)
SELECT 'EQ001', 'SC001', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ002', 'SC002', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ003', 'SC003', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ004', 'SC004', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ005', 'SC005', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ025', 'SC006', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ026', 'SC007', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ027', 'SC008', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ028', 'SC009', TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'EQ029', 'SC010', TRUNC(SYSDATE) FROM dual;

-- MATERIAL REQUESTS
INSERT INTO material_requests (
  reference_number,
  employee_id,
  request_date,
  material_quantity
)
SELECT 'MA001', 'SC001', TRUNC(SYSDATE), 5 FROM dual
UNION ALL
SELECT 'MA002', 'SC002', TRUNC(SYSDATE), 10 FROM dual
UNION ALL
SELECT 'MA025', 'SC003', TRUNC(SYSDATE), 7 FROM dual
UNION ALL
SELECT 'MA026', 'SC004', TRUNC(SYSDATE), 4 FROM dual
UNION ALL
SELECT 'MA027', 'SC005', TRUNC(SYSDATE), 6 FROM dual
UNION ALL
SELECT 'MA028', 'SC006', TRUNC(SYSDATE), 3 FROM dual
UNION ALL
SELECT 'MA029', 'SC007', TRUNC(SYSDATE), 8 FROM dual
UNION ALL
SELECT 'MA030', 'SC008', TRUNC(SYSDATE), 2 FROM dual
UNION ALL
SELECT 'MA031', 'SC009', TRUNC(SYSDATE), 9 FROM dual
UNION ALL
SELECT 'MA032', 'SC010', TRUNC(SYSDATE), 5 FROM dual;


-- PURCHASE DETAILS
INSERT INTO purchase_details (reference_number,material_quantity,supplier_id,purchase_date)
SELECT 'MA001', 50,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA002', 30,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA025', 40,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA026', 20,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA027', 15,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA028', 60,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA029', 25,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'bio@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA030', 35,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'karibu@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA031', 45,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual
UNION ALL
SELECT 'MA032', 55,(SELECT supplier_id FROM supplier_details WHERE supplier_email = 'afyachem@labs.co.ke'),TRUNC(SYSDATE) FROM dual;


