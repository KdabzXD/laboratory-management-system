const express = require('express');
const router = express.Router();
const scientistController = require('../controllers/scientistController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), scientistController.getAll);
router.get('/metadata', accessMode('Viewer'), scientistController.getMetadata);

router.post('/', accessMode('Editor'), checkPIN, scientistController.create);
router.put('/:employeeId', accessMode('Editor'), checkPIN, scientistController.update);
router.delete('/:employeeId', accessMode('Editor'), checkPIN, scientistController.remove);

module.exports = router;
