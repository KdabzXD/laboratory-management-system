const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), materialController.getAll);
router.get('/requests', accessMode('Viewer'), materialController.getRequests);

router.post('/', accessMode('Editor'), checkPIN, materialController.create);
router.put('/:referenceNumber', accessMode('Editor'), checkPIN, materialController.update);
router.delete('/:referenceNumber', accessMode('Editor'), checkPIN, materialController.remove);

router.post('/requests', accessMode('Editor'), checkPIN, materialController.createRequest);
router.put('/requests/:requestId', accessMode('Editor'), checkPIN, materialController.updateRequest);
router.delete('/requests/:requestId', accessMode('Editor'), checkPIN, materialController.deleteRequest);

module.exports = router;
