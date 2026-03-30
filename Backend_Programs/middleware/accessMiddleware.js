// Backend_Programs/middleware/accessMiddleware.js

// Role-based access middleware
function accessMode(role) {
    return (req, res, next) => {
        // Simulate user role, in real app get from req.user or JWT
        const userRole = req.headers['x-user-role'] || 'Viewer'; // Example: pass role in header

        if (role === 'Viewer' && userRole === 'Viewer') {
            return next();
        }

        if (role === 'Editor' && (userRole === 'Editor' || userRole === 'Admin')) {
            return next();
        }

        if (role === 'Admin' && userRole === 'Admin') {
            return next();
        }

        return res.status(403).json({ message: 'Access denied' });
    };
}

module.exports = { accessMode }; // ✅ must export as object