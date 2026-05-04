const { poolPromise, sql } = require('../config/db');

exports.getRoles = async (_req, res) => {
	try {
		res.json([
			{ role_id: 1, role_name: 'Viewer' },
			{ role_id: 2, role_name: 'Editor' },
			{ role_id: 3, role_name: 'Admin' },
		]);
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

		const normalizedUser = String(username).toLowerCase();
		const adminPin = process.env.ADMIN_PIN || process.env.EDITOR_PIN || '1234';
		const editorPin = process.env.EDITOR_PIN || '1234';
		const validAdmin = normalizedUser === 'admin' && String(pin) === adminPin;
		const validEditor = normalizedUser === 'editor' && String(pin) === editorPin;

		if (!validAdmin && !validEditor) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		return res.json({
			message: 'Login successful',
			user: {
				user_id: validAdmin ? 1 : 2,
				username: normalizedUser,
				role_name: validAdmin ? 'Admin' : 'Editor',
			},
		});
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

		const expected = process.env.EDITOR_PIN || '1234';
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

		const expected = process.env.ADMIN_PIN || process.env.EDITOR_PIN || '1234';
		if (String(username).toLowerCase() !== 'admin' || String(pin) !== expected) {
			return res.status(401).json({ valid: false, message: 'Invalid admin pin' });
		}

		return res.json({ valid: true, message: 'Admin pin is valid' });
	} catch (err) {
		return res.status(500).json({ message: 'Failed to verify admin pin', error: err.message });
	}
};
