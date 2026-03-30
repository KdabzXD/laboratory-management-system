const { poolPromise } = require('../config/db');

async function checkPIN(req, res, next) {
    try {
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        const pin = String(req.headers['x-pin'] || '');
        if (!pin) {
            return res.status(401).json({ message: 'Missing PIN.' });
        }

        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT setting_value
            FROM system_settings
            WHERE setting_name = 'editor_pin'
        `);

        const expectedPin = result.recordset[0]?.setting_value;
        if (!expectedPin || pin !== expectedPin) {
            return res.status(401).json({ message: 'Invalid PIN.' });
        }

        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Failed to validate PIN', error: err.message });
    }
}

module.exports = { checkPIN };