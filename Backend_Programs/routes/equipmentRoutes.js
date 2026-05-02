const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { accessMode } = require('../middleware/accessMiddleware');
const { checkPIN } = require('../middleware/pinMiddleware');

router.get('/', accessMode('Viewer'), equipmentController.getAll);
router.get('/assignments', accessMode('Viewer'), equipmentController.getAssignments);

router.post('/assignments', accessMode('Editor'), checkPIN, equipmentController.createAssignment);
router.put('/assignments/:assignmentId', accessMode('Editor'), checkPIN, equipmentController.updateAssignment);
router.delete('/assignments/:assignmentId', accessMode('Editor'), checkPIN, equipmentController.deleteAssignment);

router.post('/', accessMode('Admin'), equipmentController.create);
router.put('/:serialNumber', accessMode('Admin'), equipmentController.update);
router.delete('/:serialNumber', accessMode('Admin'), equipmentController.remove);

module.exports = router;
