const sql = require('mssql/msnodesqlv8');
const { poolPromise } = require('../config/db');
const logActivity = require('../utils/logger');

exports.getAll = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				m.reference_number,
				m.material_name,
				m.material_description,
				m.supplier_id,
				s.supplier_name,
				s.supplier_email,
				m.material_cost,
				m.stock_quantity,
				m.reorder_level,
				m.created_at
			FROM lab_materials m
			JOIN supplier_details s ON s.supplier_id = m.supplier_id
			ORDER BY m.reference_number
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch materials', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const {
			reference_number,
			material_name,
			material_description,
			supplier_id,
			material_cost,
			stock_quantity,
			reorder_level,
		} = req.body;

		const pool = await poolPromise;
		await pool
			.request()
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('material_name', sql.VarChar(50), material_name)
			.input('material_description', sql.VarChar(250), material_description)
			.input('supplier_id', sql.Int, supplier_id)
			.input('material_cost', sql.Int, material_cost)
			.input('stock_quantity', sql.Int, stock_quantity || 100)
			.input('reorder_level', sql.Int, reorder_level || 20)
			.query(`
				INSERT INTO lab_materials
				(reference_number, material_name, material_description, supplier_id, material_cost, stock_quantity, reorder_level)
				VALUES
				(@reference_number, @material_name, @material_description, @supplier_id, @material_cost, @stock_quantity, @reorder_level)
			`);

		await logActivity({
			activityType: 'Material Created',
			description: `Material ${material_name} (${reference_number}) added`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Material created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create material', error: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { referenceNumber } = req.params;
		const {
			material_name,
			material_description,
			supplier_id,
			material_cost,
			stock_quantity,
			reorder_level,
		} = req.body;

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('reference_number', sql.VarChar(5), referenceNumber)
			.input('material_name', sql.VarChar(50), material_name)
			.input('material_description', sql.VarChar(250), material_description)
			.input('supplier_id', sql.Int, supplier_id)
			.input('material_cost', sql.Int, material_cost)
			.input('stock_quantity', sql.Int, stock_quantity)
			.input('reorder_level', sql.Int, reorder_level)
			.query(`
				UPDATE lab_materials
				SET material_name = @material_name,
						material_description = @material_description,
						supplier_id = @supplier_id,
						material_cost = @material_cost,
						stock_quantity = @stock_quantity,
						reorder_level = @reorder_level
				WHERE reference_number = @reference_number
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Material not found' });
		}

		await logActivity({
			activityType: 'Material Updated',
			description: `Material ${referenceNumber} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Material updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update material', error: err.message });
	}
};

exports.remove = async (req, res) => {
	try {
		const { referenceNumber } = req.params;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('reference_number', sql.VarChar(5), referenceNumber)
			.query('DELETE FROM lab_materials WHERE reference_number = @reference_number');

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Material not found' });
		}

		await logActivity({
			activityType: 'Material Deleted',
			description: `Material ${referenceNumber} deleted`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Material deleted successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete material', error: err.message });
	}
};

exports.getRequests = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				mr.request_id,
				mr.reference_number,
				m.material_name,
				mr.employee_id,
				s.scientist_name,
				mr.request_date,
				mr.material_quantity,
				mr.status_id,
				st.status_name,
				mr.created_at
			FROM material_requests mr
			JOIN lab_materials m ON m.reference_number = mr.reference_number
			JOIN scientist_details s ON s.employee_id = mr.employee_id
			LEFT JOIN status_types st ON st.status_id = mr.status_id
			ORDER BY mr.request_date DESC, mr.request_id DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch material requests', error: err.message });
	}
};

exports.createRequest = async (req, res) => {
	try {
		const { reference_number, employee_id, request_date, material_quantity, status_id } = req.body;
		const pool = await poolPromise;
		await pool
			.request()
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('employee_id', sql.VarChar(5), employee_id)
			.input('request_date', sql.Date, request_date || null)
			.input('material_quantity', sql.Int, material_quantity)
			.input('status_id', sql.Int, status_id || null)
			.query(`
				INSERT INTO material_requests
				(reference_number, employee_id, request_date, material_quantity, status_id)
				VALUES
				(@reference_number, @employee_id, COALESCE(@request_date, GETDATE()), @material_quantity, @status_id)
			`);

		await logActivity({
			activityType: 'Material Request Created',
			description: `Request for material ${reference_number} by ${employee_id} created`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Material request created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create material request', error: err.message });
	}
};

exports.updateRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const { reference_number, employee_id, request_date, material_quantity, status_id } = req.body;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('request_id', sql.Int, Number(requestId))
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('employee_id', sql.VarChar(5), employee_id)
			.input('request_date', sql.Date, request_date)
			.input('material_quantity', sql.Int, material_quantity)
			.input('status_id', sql.Int, status_id || null)
			.query(`
				UPDATE material_requests
				SET reference_number = @reference_number,
						employee_id = @employee_id,
						request_date = @request_date,
						material_quantity = @material_quantity,
						status_id = @status_id
				WHERE request_id = @request_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Material request not found' });
		}

		await logActivity({
			activityType: 'Material Request Updated',
			description: `Material request ${requestId} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Material request updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update material request', error: err.message });
	}
};

exports.deleteRequest = async (req, res) => {
	try {
		const { requestId } = req.params;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('request_id', sql.Int, Number(requestId))
			.query('DELETE FROM material_requests WHERE request_id = @request_id');

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Material request not found' });
		}

		await logActivity({
			activityType: 'Material Request Deleted',
			description: `Material request ${requestId} deleted`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Material request deleted successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete material request', error: err.message });
	}
};
