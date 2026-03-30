// Backend_Programs/testDB.cjs
const { poolPromise } = require('./config/db.cjs');

async function testConnection() {
    try {
        const pool = await poolPromise;

        // Simple test query
        const result = await pool.request().query('SELECT TOP 1 * FROM sys.tables'); 
        console.log('Query successful:', result.recordset);

        pool.close(); // close pool after query
    } catch (err) {
        console.error('❌ Database Query Failed:', err);
    }
}

testConnection();