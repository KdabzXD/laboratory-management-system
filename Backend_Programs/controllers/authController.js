const sql = require('mssql/msnodesqlv8');
const { poolPromise } = require('../config/db');

exports.getRoles = async (_req, res) => {
	try {
		const pool = await poolPromise;
		const result = await pool.request().query('SELECT role_id, role_name FROM user_roles ORDER BY role_id');
		res.json(result.recordset);
	} catch (err) {
		res.status(500).json({ message: 'Failed to load roles', error: err.message });
	}
};

exports.login = async (req, res) => {
	try {
		const { username, pin } = req.body;
		if (!username || !pin) {
			return res.status(400).json({ message: 'username and pin are required' });
		}

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('username', sql.VarChar(50), username)
			.input('pin', sql.VarChar(8), pin)
			.query(`
				SELECT su.user_id, su.username, ur.role_name
				FROM system_users su
				JOIN user_roles ur ON ur.role_id = su.role_id
				WHERE su.username = @username AND su.pin_code = @pin
			`);

		if (result.recordset.length === 0) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		return res.json({ message: 'Login successful', user: result.recordset[0] });
	} catch (err) {
		return res.status(500).json({ message: 'Login failed', error: err.message });
	}
};

exports.verifyEditorPin = async (req, res) => {
	try {
		const { pin } = req.body;
		if (!pin) {
			return res.status(400).json({ message: 'pin is required' });
		}

		const pool = await poolPromise;
		const result = await pool.request().query(`
			SELECT setting_value
			FROM system_settings
			WHERE setting_name = 'editor_pin'
		`);

		const expected = result.recordset[0]?.setting_value;
		if (!expected || expected !== String(pin)) {
			return res.status(401).json({ valid: false, message: 'Invalid editor pin' });
		}

		return res.json({ valid: true, message: 'Editor pin is valid' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to verify editor pin', error: err.message });
	}
};

exports.verifyAdminPin = async (req, res) => {
	try {
		const { username = 'admin', pin } = req.body;
		if (!pin) {
			return res.status(400).json({ message: 'pin is required' });
		}

		const pool = await poolPromise;
		const result = await pool
			.request()
			.input('username', sql.VarChar(50), username)
			.input('pin', sql.VarChar(8), pin)
			.query(`
				SELECT su.user_id
				FROM system_users su
				JOIN user_roles ur ON ur.role_id = su.role_id
				WHERE su.username = @username AND su.pin_code = @pin AND ur.role_name = 'Admin'
			`);

		if (result.recordset.length === 0) {
			return res.status(401).json({ valid: false, message: 'Invalid admin pin' });
		}

		return res.json({ valid: true, message: 'Admin pin is valid' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to verify admin pin', error: err.message });
	}
};
