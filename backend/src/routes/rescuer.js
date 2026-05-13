const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { getDashboard, createAlert, updateAlertStatus, getMapAlerts } = require('../controllers/rescuerController');

router.use(authenticate, requireRole('rescuer'));
router.get('/dashboard', getDashboard);
router.post('/alerts', createAlert);
router.patch('/alerts/:id/status', updateAlertStatus);
router.get('/map/alerts', getMapAlerts);

module.exports = router;
