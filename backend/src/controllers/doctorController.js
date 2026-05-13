const Patient = require('../models/Patient');
const Resource = require('../models/Resource');

const getDashboard = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      patientsToday: await Patient.countDocuments({ createdAt: { $gte: today } }),
      critical: await Patient.countDocuments({ triageLevel: 'Red', status: { $ne: 'Discharged' } }),
      stable: await Patient.countDocuments({ triageLevel: 'Green', status: { $ne: 'Discharged' } }),
      awaitingTriage: await Patient.countDocuments({ status: 'Waiting' }),
    };

    const inventory = await Resource.find({ 
      managedBy: req.user._id,
      type: 'Medicine',
    }).lean();

    const alerts = await require('../models/Alert').find({ status: { $ne: 'Resolved' } })
      .populate('createdBy', 'name')
      .sort({ severity: 1 })
      .limit(10)
      .lean();

    res.json({ success: true, stats, patients, inventory, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addPatient = async (req, res) => {
  try {
    const { name, age, gender, condition, triageLevel, coordinates, notes, vitals } = req.body;
    if (!name || !condition || !triageLevel) {
      return res.status(400).json({ success: false, message: 'Name, condition, and triage level are required.' });
    }

    const patient = await Patient.create({
      name, age, gender, condition, triageLevel, notes, vitals,
      location: coordinates ? { type: 'Point', coordinates } : undefined,
      assignedDoctor: req.user._id,
      status: 'Waiting',
    });

    req.app.get('io')?.to(`doctor_${req.user._id}`).emit('patient_added', { patient });
    res.status(201).json({ success: true, message: 'Patient added to queue.', patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByIdAndUpdate(id, req.body, { new: true });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found.' });
    req.app.get('io')?.to(`doctor_${req.user._id}`).emit('patient_updated', { patient });
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assignedDoctor', 'name')
      .sort({ triageLevel: 1, createdAt: -1 })
      .lean();
    res.json({ success: true, patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, addPatient, updatePatient, getAllPatients };
