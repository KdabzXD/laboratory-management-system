const { poolPromise, sql } = require('../config/db');
const logActivity = require('../utils/logger');

exports.getAll = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT
				supplier_id,
				supplier_name,
				supplier_address,
				supplier_location,
				supplier_description,
				supplier_email,
				supplier_contact,
				NULL AS created_at
			FROM supplier_details
			ORDER BY supplier_id
		`);
		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch suppliers', error: err.message });
	}
};

exports.create = async (req, res) => {
	try {
		const {
			supplier_name,
			supplier_address,
			supplier_location,
			supplier_description,
			supplier_email,
			supplier_contact,
		} = req.body;

		const pool = await poolPromise;
		await pool
			.request()
			.input('supplier_name', sql.VarChar(50), supplier_name)
			.input('supplier_address', sql.VarChar(100), supplier_address)
			.input('supplier_location', sql.VarChar(50), supplier_location)
			.input('supplier_description', sql.VarChar(250), supplier_description)
			.input('supplier_email', sql.VarChar(70), supplier_email)
			.input('supplier_contact', sql.VarChar(10), supplier_contact)
			.query(`
				INSERT INTO supplier_details
				(supplier_name, supplier_address, supplier_location, supplier_description, supplier_email, supplier_contact)
				VALUES
				(@supplier_name, @supplier_address, @supplier_location, @supplier_description, @supplier_email, @supplier_contact)
			`);

		const result = await pool
			.request()
			.input('supplier_email', sql.VarChar(70), supplier_email)
			.query('SELECT supplier_id FROM supplier_details WHERE supplier_email = LOWER(TRIM(@supplier_email))');

		await logActivity({
			activityType: 'Supplier Created',
			description: `Supplier ${supplier_name} added`,
			performedBy: req.user?.username || 'system',
		});

		return res.status(201).json({ message: 'Supplier created successfully', supplier_id: result.recordset[0].supplier_id });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create supplier', error: err.message });
	}
};

exports.update = async (req, res) => {
	try {
		const { supplierId } = req.params;
		const {
			supplier_name,
			supplier_address,
			supplier_location,
			supplier_description,
			supplier_email,
			supplier_contact,
		} = req.body;

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('supplier_id', sql.Int, Number(supplierId))
			.input('supplier_name', sql.VarChar(50), supplier_name)
			.input('supplier_address', sql.VarChar(100), supplier_address)
			.input('supplier_location', sql.VarChar(50), supplier_location)
			.input('supplier_description', sql.VarChar(250), supplier_description)
			.input('supplier_email', sql.VarChar(70), supplier_email)
			.input('supplier_contact', sql.VarChar(10), supplier_contact)
			.query(`
				UPDATE supplier_details
				SET supplier_name = @supplier_name,
						supplier_address = @supplier_address,
						supplier_location = @supplier_location,
						supplier_description = @supplier_description,
						supplier_email = @supplier_email,
						supplier_contact = @supplier_contact
				WHERE supplier_id = @supplier_id
			`);

		if (result.rowsAffected[0] === 0) {
			return res.status(404).json({ message: 'Supplier not found' });
		}

		await logActivity({
			activityType: 'Supplier Updated',
			description: `Supplier ${supplierId} updated`,
			performedBy: req.user?.username || 'system',
		});

		return res.json({ message: 'Supplier updated successfully' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to update supplier', error: err.message });
	}
};

exports.remove = async (req, res) => {
	try {
		return res.status(409).json({ message: 'Deleting suppliers is disabled by the Oracle schema.' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to delete supplier', error: err.message });
	}
};
