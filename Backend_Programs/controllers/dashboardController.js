const { poolPromise, sql } = require('../config/db');

exports.getStats = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				(SELECT COUNT(*) FROM scientist_details) AS total_scientists,
				(SELECT COUNT(*) FROM lab_equipment) AS total_equipment,
				(SELECT COUNT(*) FROM supplier_details) AS total_suppliers,
				(SELECT COUNT(*) FROM purchase_details) AS total_purchases,
				(SELECT NVL(SUM(material_cost), 0) FROM lab_materials) AS total_material_cost
		`);
		return res.json(result.recordset[0]);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch dashboard stats', error: err.message });
	}
};

exports.getEquipmentByDepartment = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT d.department_name, COUNT(*) AS total
			FROM lab_equipment e
			JOIN departments d ON e.department_id = d.department_id
			GROUP BY d.department_name
			ORDER BY total DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch equipment chart data', error: err.message });
	}
};

exports.getMaterialCostBySupplier = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT s.supplier_name, NVL(SUM(m.material_cost), 0) AS total_cost
			FROM supplier_details s
			LEFT JOIN lab_materials m ON m.supplier_id = s.supplier_id
			GROUP BY s.supplier_name
			ORDER BY total_cost DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch supplier cost chart data', error: err.message });
	}
};

exports.getLatestAssignments = async (req, res) => {
	try {
		const limit = Number(req.query.limit || 10);
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('limit', sql.Int, Number.isNaN(limit) ? 10 : limit)
			.query(`
				SELECT TOP (@limit)
					ea.assignment_id,
					ea.serial_number,
					e.equipment_name,
					ea.employee_id,
					s.scientist_name,
					ea.assignment_date,
					'Pending' AS status_name
				FROM equipment_assignment ea
				JOIN lab_equipment e ON ea.serial_number = e.serial_number
				JOIN scientist_details s ON ea.employee_id = s.employee_id
				ORDER BY ea.assignment_date DESC, ea.assignment_id DESC
			`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch latest assignments', error: err.message });
	}
};

exports.getLatestMaterialRequests = async (req, res) => {
	try {
		const limit = Number(req.query.limit || 10);
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('limit', sql.Int, Number.isNaN(limit) ? 10 : limit)
			.query(`
				SELECT TOP (@limit)
					mr.request_id,
					mr.reference_number,
					m.material_name,
					mr.employee_id,
					s.scientist_name,
					mr.request_date,
					mr.material_quantity,
					'Pending' AS status_name
				FROM material_requests mr
				JOIN lab_materials m ON mr.reference_number = m.reference_number
				JOIN scientist_details s ON mr.employee_id = s.employee_id
				ORDER BY mr.request_date DESC, mr.request_id DESC
			`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch latest material requests', error: err.message });
	}
};
