const express = require('express');
const router = express.Router();
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');
const dummyController = require('../controllers/dummyController');

router.get('/', accessMode('Viewer'), dummyController.getAll);

router.post('/', accessMode('Editor'), checkPIN, dummyController.addItem);

router.put('/:id', accessMode('Editor'), checkPIN, dummyController.updateItem);

router.delete('/:id', accessMode('Editor'), checkPIN, dummyController.deleteItem);

module.exports = router;