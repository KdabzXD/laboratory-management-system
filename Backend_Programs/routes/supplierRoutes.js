const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), supplierController.getAll);

router.post('/', accessMode('Admin'), supplierController.create);
router.put('/:supplierId', accessMode('Admin'), supplierController.update);
router.delete('/:supplierId', accessMode('Admin'), supplierController.remove);

module.exports = router;
