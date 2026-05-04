const { poolPromise } = require('./config/db');

async function testConnection() {
	let pool;
	try {
		pool = await poolPromise;
		const result = await pool.request().query('SELECT table_name FROM user_tables FETCH FIRST 1 ROWS ONLY');
		console.log('Oracle query successful:', result.recordset);
	} catch (err) {
		console.error('Database query failed:', err);
		process.exitCode = 1;
	} finally {
		if (pool) {
			await pool.close(0);
		}
	}
}

testConnection();
