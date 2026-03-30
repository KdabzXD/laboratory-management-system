const sql = require('mssql/msnodesqlv8');
const { poolPromise } = require('../config/db');

exports.getRecentActivity = async (req, res) => {
	try {
		const limit = Number(req.query.limit || 20);
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('limit', sql.Int, Number.isNaN(limit) ? 20 : limit)
			.query(`
				SELECT TOP (@limit)
					activity_id,
					activity_type,
					description,
					performed_by,
					activity_time
				FROM activity_logs
				ORDER BY activity_time DESC
			`);

		if (result.recordset.length > 0) {
			return res.json(result.recordset);
		}

		const fallback = await pool
			.request()
			.input('limit', sql.Int, Number.isNaN(limit) ? 20 : limit)
			.query(`
				WITH feed AS (
					SELECT
						CAST(ea.assignment_id AS VARCHAR(50)) AS activity_id,
						'Assignment Created' AS activity_type,
						CONCAT('Equipment ', e.equipment_name, ' assigned to ', s.scientist_name) AS description,
						'system' AS performed_by,
						ea.assignment_date AS activity_time
					FROM equipment_assignment ea
					JOIN lab_equipment e ON e.serial_number = ea.serial_number
					JOIN scientist_details s ON s.employee_id = ea.employee_id

					UNION ALL

					SELECT
						CAST(mr.request_id AS VARCHAR(50)) AS activity_id,
						'Material Request Created' AS activity_type,
						CONCAT(s.scientist_name, ' requested ', mr.material_quantity, ' of ', m.material_name) AS description,
						'system' AS performed_by,
						mr.request_date AS activity_time
					FROM material_requests mr
					JOIN scientist_details s ON s.employee_id = mr.employee_id
					JOIN lab_materials m ON m.reference_number = mr.reference_number

					UNION ALL

					SELECT
						CAST(p.purchase_id AS VARCHAR(50)) AS activity_id,
						'Purchase Created' AS activity_type,
						CONCAT('Purchase for ', p.material_quantity, ' of ', m.material_name, ' from ', sp.supplier_name) AS description,
						'system' AS performed_by,
						p.purchase_date AS activity_time
					FROM purchase_details p
					JOIN lab_materials m ON m.reference_number = p.reference_number
					JOIN supplier_details sp ON sp.supplier_id = p.supplier_id
				)
				SELECT TOP (@limit)
					activity_id,
					activity_type,
					description,
					performed_by,
					activity_time
				FROM feed
				WHERE activity_time IS NOT NULL
				ORDER BY activity_time DESC
			`);

		return res.json(fallback.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch activity logs', error: err.message });
	}
};
