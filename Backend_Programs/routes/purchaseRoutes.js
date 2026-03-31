const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), purchaseController.getAll);
router.get('/status-types', accessMode('Viewer'), purchaseController.getStatusTypes);

router.post('/', accessMode('Editor'), checkPIN, purchaseController.create);
router.put('/:purchaseId', accessMode('Editor'), checkPIN, purchaseController.update);
router.patch('/:purchaseId/status', accessMode('Editor'), checkPIN, purchaseController.updateStatus);
router.delete('/:purchaseId', accessMode('Editor'), checkPIN, purchaseController.remove);

module.exports = router;
