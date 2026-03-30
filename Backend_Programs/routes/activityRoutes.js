const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { accessMode } = require('../middleware/accessMiddleware');

router.get('/', accessMode('Viewer'), activityController.getRecentActivity);

module.exports = router;
