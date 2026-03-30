const sql = require('mssql/msnodesqlv8');
const { poolPromise } = require('../config/db');

async function logActivity({ activityType, description, performedBy }) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('activityType', sql.VarChar(50), activityType)
      .input('description', sql.VarChar(255), description)
      .input('performedBy', sql.VarChar(50), performedBy)
      .query(`
        INSERT INTO activity_logs (activity_type, description, performed_by, activity_time)
        VALUES (@activityType, @description, @performedBy, GETDATE())
      `);
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

module.exports = logActivity;