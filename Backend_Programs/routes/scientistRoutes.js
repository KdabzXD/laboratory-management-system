const express = require('express');
const router = express.Router();
const scientistController = require('../controllers/scientistController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), scientistController.getAll);
router.get('/metadata', accessMode('Viewer'), scientistController.getMetadata);

router.post('/', accessMode('Admin'), scientistController.create);
router.put('/:employeeId', accessMode('Admin'), scientistController.update);
router.delete('/:employeeId', accessMode('Admin'), scientistController.remove);

module.exports = router;
