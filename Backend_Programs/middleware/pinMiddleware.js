// Backend_Programs/middleware/pinMiddleware.js

// Dummy PIN check middleware
function checkPIN(req, res, next) {
    const pin = req.headers['x-pin']; // Example: send PIN in header
    if (!pin || pin !== '1234') {
        return res.status(401).json({ message: 'Invalid or missing PIN' });
    }
    next();
}

module.exports = { checkPIN }; // ✅ must export as object