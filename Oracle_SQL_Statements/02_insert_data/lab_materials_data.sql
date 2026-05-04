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