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