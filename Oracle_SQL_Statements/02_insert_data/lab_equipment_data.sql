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