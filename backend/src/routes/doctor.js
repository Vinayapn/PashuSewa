const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { getDashboard, addPatient, updatePatient, getAllPatients } = require('../controllers/doctorController');

router.use(authenticate, requireRole('doctor'));
router.get('/dashboard', getDashboard);
router.get('/patients', getAllPatients);
router.post('/patients', addPatient);
router.patch('/patients/:id', updatePatient);

module.exports = router;
