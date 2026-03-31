const sql = require('mssql/msnodesqlv8');
const { poolPromise } = require('../config/db');
const logActivity = require('../utils/logger');

async function getStatusIdByName(pool, statusName) {
	const normalized = String(statusName || '').toLowerCase();
	if (!normalized) return null;

	const result = await pool
		.request()
		.input('status_name', sql.VarChar(20), normalized)
		.query(`
			SELECT TOP 1 status_id
			FROM status_types
			WHERE LOWER(status_name) = @status_name
		`);

	return result.recordset[0]?.status_id || null;
}

exports.getStatusTypes = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT status_id, status_name
			FROM status_types
			ORDER BY status_id
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch purchase status types', error: err.message });
	}
};

exports.getAll = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				p.purchase_id,
				p.reference_number,
				m.material_name,
				p.material_quantity,
				p.supplier_id,
				s.supplier_name,
				p.purchase_date,
				p.status_id,
				st.status_name,
				p.created_at,
				(p.material_quantity * m.material_cost) AS total_cost
			FROM purchase_details p
			JOIN lab_materials m ON m.reference_number = p.reference_number
			JOIN supplier_details s ON s.supplier_id = p.supplier_id
			LEFT JOIN status_types st ON st.status_id = p.status_id
			ORDER BY p.purchase_date DESC, p.purchase_id DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch purchases', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { reference_number, material_quantity, supplier_id, purchase_date, status_id } = req.body;
		const pool = await poolPromise;
		let finalStatusId = status_id || null;

		if (!finalStatusId) {
			finalStatusId = await getStatusIdByName(pool, 'Pending');
		}

		await pool
			.request()
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('material_quantity', sql.Int, material_quantity)
			.input('supplier_id', sql.Int, supplier_id)
			.input('purchase_date', sql.Date, purchase_date || null)
			.input('status_id', sql.Int, finalStatusId)
			.query(`
				INSERT INTO purchase_details
				(reference_number, material_quantity, supplier_id, purchase_date, status_id)
				VALUES
				(@reference_number, @material_quantity, @supplier_id, COALESCE(@purchase_date, GETDATE()), @status_id)
			`);

		await logActivity({
			activityType: 'Purchase Created',
			description: `Purchase for ${reference_number} created`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Purchase created successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create purchase', error: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { purchaseId } = req.params;
		const { reference_number, material_quantity, supplier_id, purchase_date, status_id } = req.body;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('purchase_id', sql.Int, Number(purchaseId))
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('material_quantity', sql.Int, material_quantity)
			.input('supplier_id', sql.Int, supplier_id)
			.input('purchase_date', sql.Date, purchase_date)
			.input('status_id', sql.Int, status_id || null)
			.query(`
				UPDATE purchase_details
				SET reference_number = @reference_number,
						material_quantity = @material_quantity,
						supplier_id = @supplier_id,
						purchase_date = @purchase_date,
						status_id = @status_id
				WHERE purchase_id = @purchase_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Purchase not found' });
		}

		await logActivity({
			activityType: 'Purchase Updated',
			description: `Purchase ${purchaseId} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Purchase updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update purchase', error: err.message });
	}
};

exports.remove = async (req, res) => {
	try {
		const { purchaseId } = req.params;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('purchase_id', sql.Int, Number(purchaseId))
			.query('DELETE FROM purchase_details WHERE purchase_id = @purchase_id');

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Purchase not found' });
		}

		await logActivity({
			activityType: 'Purchase Deleted',
			description: `Purchase ${purchaseId} deleted`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Purchase deleted successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete purchase', error: err.message });
	}
};

exports.updateStatus = async (req, res) => {
	try {
		const { purchaseId } = req.params;
		const { status_id, status_name } = req.body;

		const pool = await poolPromise;
		let finalStatusId = status_id || null;

		if (!finalStatusId && status_name) {
			finalStatusId = await getStatusIdByName(pool, status_name);
		}

		if (!finalStatusId) {
			return res.status(400).json({ message: 'A valid status_id or status_name is required.' });
		}

		const result = await pool
			.request()
			.input('purchase_id', sql.Int, Number(purchaseId))
			.input('status_id', sql.Int, finalStatusId)
			.query(`
				UPDATE purchase_details
				SET status_id = @status_id
				WHERE purchase_id = @purchase_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Purchase not found' });
		}

		await logActivity({
			activityType: 'Purchase Status Updated',
			description: `Purchase ${purchaseId} status changed to ${finalStatusId}`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Purchase status updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update purchase status', error: err.message });
	}
};
