const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { accessMode } = require('../middleware/accessMiddleware');

router.get('/stats', accessMode('Viewer'), dashboardController.getStats);
router.get('/equipment-by-department', accessMode('Viewer'), dashboardController.getEquipmentByDepartment);
router.get('/material-cost-by-supplier', accessMode('Viewer'), dashboardController.getMaterialCostBySupplier);
router.get('/latest-assignments', accessMode('Viewer'), dashboardController.getLatestAssignments);
router.get('/latest-material-requests', accessMode('Viewer'), dashboardController.getLatestMaterialRequests);

module.exports = router;
