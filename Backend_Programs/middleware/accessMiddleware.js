const ROLE_PRIORITY = {
    viewer: 1,
    editor: 2,
    admin: 3,
};

function accessMode(requiredRole) {
    return (req, res, next) => {
        const headerRole = String(req.headers['x-user-role'] || 'viewer').toLowerCase();
        const role = ROLE_PRIORITY[headerRole] ? headerRole : 'viewer';
        const needed = String(requiredRole || 'Viewer').toLowerCase();

        req.user = {
            role,
            username: String(req.headers['x-username'] || role),
        };

        if (ROLE_PRIORITY[role] >= (ROLE_PRIORITY[needed] || ROLE_PRIORITY.viewer)) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied for current role.' });
    };
}

module.exports = { accessMode };