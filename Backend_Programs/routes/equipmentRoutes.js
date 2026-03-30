const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), equipmentController.getAll);
router.get('/assignments', accessMode('Viewer'), equipmentController.getAssignments);

router.post('/', accessMode('Editor'), checkPIN, equipmentController.create);
router.put('/:serialNumber', accessMode('Editor'), checkPIN, equipmentController.update);
router.delete('/:serialNumber', accessMode('Editor'), checkPIN, equipmentController.remove);

router.post('/assignments', accessMode('Editor'), checkPIN, equipmentController.createAssignment);
router.put('/assignments/:assignmentId', accessMode('Editor'), checkPIN, equipmentController.updateAssignment);
router.delete('/assignments/:assignmentId', accessMode('Editor'), checkPIN, equipmentController.deleteAssignment);

module.exports = router;
