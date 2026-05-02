const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), materialController.getAll);
router.get('/requests', accessMode('Viewer'), materialController.getRequests);

router.post('/requests', accessMode('Editor'), checkPIN, materialController.createRequest);
router.put('/requests/:requestId', accessMode('Editor'), checkPIN, materialController.updateRequest);
router.delete('/requests/:requestId', accessMode('Editor'), checkPIN, materialController.deleteRequest);

router.post('/', accessMode('Admin'), materialController.create);
router.put('/:referenceNumber', accessMode('Admin'), materialController.update);
router.delete('/:referenceNumber', accessMode('Admin'), materialController.remove);

module.exports = router;
