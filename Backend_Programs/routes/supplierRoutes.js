const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), supplierController.getAll);

router.post('/', accessMode('Editor'), checkPIN, supplierController.create);
router.put('/:supplierId', accessMode('Editor'), checkPIN, supplierController.update);
router.delete('/:supplierId', accessMode('Editor'), checkPIN, supplierController.remove);

module.exports = router;
