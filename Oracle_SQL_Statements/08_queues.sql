------------------------------------------------------------
-- ===================== ROLES =============================
------------------------------------------------------------

CREATE ROLE lab_manager_role;
CREATE ROLE scientist_role;
CREATE ROLE lab_technician_role;

------------------------------------------------------------
-- ================= LAB MANAGER (FULL ACCESS) =============
------------------------------------------------------------

-- Core tables
GRANT ALL PRIVILEGES ON supplier_details TO lab_manager_role;
GRANT ALL PRIVILEGES ON departments TO lab_manager_role;
GRANT ALL PRIVILEGES ON department_specialization TO lab_manager_role;
GRANT ALL PRIVILEGES ON scientist_details TO lab_manager_role;
GRANT ALL PRIVILEGES ON lab_equipment TO lab_manager_role;
GRANT ALL PRIVILEGES ON lab_materials TO lab_manager_role;
GRANT ALL PRIVILEGES ON equipment_assignment TO lab_manager_role;
GRANT ALL PRIVILEGES ON material_requests TO lab_manager_role;
GRANT ALL PRIVILEGES ON purchase_details TO lab_manager_role;

-- Audit tables
GRANT ALL PRIVILEGES ON supplier_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON department_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON department_specialization_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON scientist_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON lab_equipment_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON lab_materials_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON equipment_assignment_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON material_requests_audit TO lab_manager_role;
GRANT ALL PRIVILEGES ON purchase_details_audit TO lab_manager_role;

-- System privileges (advanced feature marks)
GRANT CREATE TABLE, CREATE VIEW, CREATE SEQUENCE, CREATE TRIGGER TO lab_manager_role;

------------------------------------------------------------
-- ================= SCIENTIST ROLE ========================
------------------------------------------------------------

-- Read reference data
GRANT SELECT ON departments TO scientist_role;
GRANT SELECT ON department_specialization TO scientist_role;
GRANT SELECT ON lab_equipment TO scientist_role;
GRANT SELECT ON lab_materials TO scientist_role;
GRANT SELECT ON supplier_details TO scientist_role;

-- Operational work
GRANT SELECT, INSERT, UPDATE ON material_requests TO scientist_role;
GRANT SELECT ON equipment_assignment TO scientist_role;

-- Audit visibility
GRANT SELECT ON material_requests_audit TO scientist_role;
GRANT SELECT ON equipment_assignment_audit TO scientist_role;

------------------------------------------------------------
-- ================= LAB TECHNICIAN ROLE ===================
------------------------------------------------------------

-- Minimal permissions
GRANT SELECT ON lab_equipment TO lab_technician_role;
GRANT UPDATE ON lab_equipment TO lab_technician_role;

GRANT SELECT ON lab_materials TO lab_technician_role;
GRANT UPDATE ON lab_materials TO lab_technician_role;

GRANT SELECT ON equipment_assignment TO lab_technician_role;

------------------------------------------------------------
-- ================= USER CREATION (OPTIONAL) =============
------------------------------------------------------------

-- NOTE: Only run if you are DBA or have privileges
-- CREATE USER lab_manager IDENTIFIED BY manager123;
-- CREATE USER scientist_user IDENTIFIED BY sci123;
-- CREATE USER technician_user IDENTIFIED BY tech123;

-- GRANT lab_manager_role TO lab_manager;
-- GRANT scientist_role TO scientist_user;
-- GRANT lab_technician_role TO technician_user;

------------------------------------------------------------
-- ================= ORACLE AQ QUEUES ======================
------------------------------------------------------------

------------------------------------------------------------
-- LAB EVENT QUEUE
------------------------------------------------------------

BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'lab_event_queue_table',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE'
  );

  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'lab_event_queue',
    queue_table => 'lab_event_queue_table'
  );

  DBMS_AQADM.START_QUEUE(
    queue_name => 'lab_event_queue'
  );
END;
/

------------------------------------------------------------
-- EQUIPMENT EVENT QUEUE
------------------------------------------------------------

BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'equipment_event_queue_table',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE'
  );

  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'equipment_event_queue',
    queue_table => 'equipment_event_queue_table'
  );

  DBMS_AQADM.START_QUEUE(
    queue_name => 'equipment_event_queue'
  );
END;
/

------------------------------------------------------------
-- MATERIAL REQUEST QUEUE
------------------------------------------------------------

BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'material_request_queue_table',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE'
  );

  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'material_request_queue',
    queue_table => 'material_request_queue_table'
  );

  DBMS_AQADM.START_QUEUE(
    queue_name => 'material_request_queue'
  );
END;
/

------------------------------------------------------------
-- PURCHASE APPROVAL QUEUE
------------------------------------------------------------

BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'purchase_approval_queue_table',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE'
  );

  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'purchase_approval_queue',
    queue_table => 'purchase_approval_queue_table'
  );

  DBMS_AQADM.START_QUEUE(
    queue_name => 'purchase_approval_queue'
  );
END;
/

------------------------------------------------------------
-- SCIENTIST NOTIFICATION QUEUE
------------------------------------------------------------

BEGIN
  DBMS_AQADM.CREATE_QUEUE_TABLE(
    queue_table        => 'scientist_notify_queue_table',
    queue_payload_type => 'SYS.AQ$_JMS_TEXT_MESSAGE'
  );

  DBMS_AQADM.CREATE_QUEUE(
    queue_name  => 'scientist_notify_queue',
    queue_table => 'scientist_notify_queue_table'
  );

  DBMS_AQADM.START_QUEUE(
    queue_name => 'scientist_notify_queue'
  );
END;
/