// utils/logger.js
const db = require('../config/db');

async function logActivity({ actionType, description, performedBy }) {
  try {
    const query = `
      INSERT INTO activity_logs (action_type, description, performed_by, timestamp)
      VALUES (?, ?, ?, GETDATE())
    `;
    await db.query(query, [actionType, description, performedBy]);
    console.log('Activity logged:', actionType, description);
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

module.exports = logActivity;