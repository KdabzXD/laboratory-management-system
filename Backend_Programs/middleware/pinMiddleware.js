async function checkPIN(req, res, next) {
    try {
        if (req.user && req.user.role === 'admin') {
            return next();
        }

        const pin = String(req.headers['x-pin'] || '');
        if (!pin) {
            return res.status(401).json({ message: 'Missing PIN.' });
        }

        const expectedPin = process.env.EDITOR_PIN || '87654321';
        if (!expectedPin || pin !== expectedPin) {
            return res.status(401).json({ message: 'Invalid PIN.' });
        }

        return next();
    } catch (err) {
        return res.status(500).json({ message: 'Failed to validate PIN', error: err.message });
    }
}

module.exports = { checkPIN };
