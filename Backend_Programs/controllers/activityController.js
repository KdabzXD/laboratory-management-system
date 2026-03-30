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

		return res.json(result.recordset);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to fetch activity logs', error: err.message });
	}
};
