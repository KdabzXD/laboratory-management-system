async function logActivity({ activityType, description, performedBy }) {
	// The supplied Oracle schema does not include an activity_logs table.
	// The dashboard builds its activity feed from assignment, request, and purchase data.
	if (process.env.LOG_ACTIVITY_TO_CONSOLE === 'true') {
		console.log(`[activity] ${activityType}: ${description} by ${performedBy}`);
	}
}

module.exports = logActivity;
