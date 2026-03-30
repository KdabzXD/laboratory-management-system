// Backend_Programs/config/db.cjs
const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const poolPromise = new sql.ConnectionPool({
    server: process.env.DB_SERVER,         // e.g., BAYMAX\SQLEXPRESS
    database: process.env.DB_NAME || process.env.DB_DATABASE,         // e.g., Laboratory_Management_System
    driver: 'ODBC Driver 18 for SQL Server',               // must match installed driver
    options: {
        trustedConnection: true            // Windows Authentication
    }
})
.connect()
.then(pool => {
    console.log('✅ SQL Server Connected via Windows Auth');
    return pool;
})
.catch(err => {
    console.error('❌ SQL Server Connection Failed:', err);
});

module.exports = { poolPromise };