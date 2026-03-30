const express = require('express');
const router = express.Router();
const queriesController = require('../controllers/queriesController');
const { accessMode } = require('../middleware/accessMiddleware');

router.get('/', accessMode('Viewer'), queriesController.getAllQueries);
router.get('/:id', accessMode('Viewer'), queriesController.runQueryById);
router.post('/reports/material-requests', accessMode('Viewer'), queriesController.runMaterialRequestReport);

module.exports = router;
