const { poolPromise, sql } = require('../config/db');
const logActivity = require('../utils/logger');

async function getStatusIdByName(pool, statusName) {
	const normalized = String(statusName || '').toLowerCase();
	if (!normalized) return null;
	return normalized.includes('complete') ? 2 : 1;
}

exports.getStatusTypes = async (_req, res) => {
	try {
		return res.json([
			{ status_id: 1, status_name: 'Pending' },
			{ status_id: 2, status_name: 'Completed' },
		]);
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
				s.supplier_email,
				p.purchase_date,
				NULL AS status_id,
				'Pending' AS status_name,
				p.purchase_date AS created_at,
				(p.material_quantity * m.material_cost) AS total_cost
			FROM purchase_details p
			JOIN lab_materials m ON m.reference_number = p.reference_number
			JOIN supplier_details s ON s.supplier_id = p.supplier_id
			ORDER BY p.purchase_date DESC, p.purchase_id DESC
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch purchases', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const { reference_number, material_quantity, supplier_id, purchase_date } = req.body;
		const pool = await poolPromise;

		await pool
			.request()
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('material_quantity', sql.Int, material_quantity)
			.input('supplier_id', sql.Int, supplier_id)
			.input('purchase_date', sql.Date, purchase_date || null)
			.query(`
				INSERT INTO purchase_details
				(reference_number, material_quantity, supplier_id, purchase_date)
				VALUES
				(@reference_number, @material_quantity, @supplier_id, COALESCE(TO_DATE(@purchase_date, 'YYYY-MM-DD'), TRUNC(SYSDATE)))
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
		const { reference_number, material_quantity, supplier_id, purchase_date } = req.body;
		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('purchase_id', sql.Int, Number(purchaseId))
			.input('reference_number', sql.VarChar(5), reference_number)
			.input('material_quantity', sql.Int, material_quantity)
			.input('supplier_id', sql.Int, supplier_id)
			.input('purchase_date', sql.Date, purchase_date)
			.query(`
				UPDATE purchase_details
				SET reference_number = @reference_number,
						material_quantity = @material_quantity,
						supplier_id = @supplier_id,
						purchase_date = TO_DATE(@purchase_date, 'YYYY-MM-DD')
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
		const { status_name } = req.body;

		await logActivity({
			activityType: 'Purchase Status Updated',
			description: `Purchase ${purchaseId} status changed to ${status_name || 'Pending'}`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Purchase status updated successfully (client-only).' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update purchase status', error: err.message });
	}
};
