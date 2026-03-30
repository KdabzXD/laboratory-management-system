const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/roles', authController.getRoles);
router.post('/login', authController.login);
router.post('/verify-editor-pin', authController.verifyEditorPin);
router.post('/verify-admin-pin', authController.verifyAdminPin);

module.exports = router;
