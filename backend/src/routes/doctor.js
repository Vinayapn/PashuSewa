const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { 
  getDashboard, 
  addPatient, 
  updatePatient, 
  getAllPatients,
  getAppointments,
  addAppointment,
  updateAppointment,
  addResource,
  updateResource
} = require('../controllers/doctorController');

router.use(authenticate, requireRole('doctor'));
router.get('/dashboard', getDashboard);
router.get('/patients', getAllPatients);
router.post('/patients', addPatient);
router.patch('/patients/:id', updatePatient);

// Appointments
router.get('/appointments', getAppointments);
router.post('/appointments', addAppointment);
router.patch('/appointments/:id', updateAppointment);

// Resources (Medicine Stock)
router.post('/resources', addResource);
router.patch('/resources/:id', updateResource);

module.exports = router;
