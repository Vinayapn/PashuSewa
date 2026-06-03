const Patient = require('../models/Patient');
const Resource = require('../models/Resource');
const Appointment = require('../models/Appointment');
const Alert = require('../models/Alert');

const getDashboard = async (req, res) => {
  try {
    const patients = await Patient.find({ assignedDoctor: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      patientsToday: await Patient.countDocuments({ assignedDoctor: req.user._id, createdAt: { $gte: today } }),
      critical: await Patient.countDocuments({ assignedDoctor: req.user._id, triageLevel: 'Red', status: { $ne: 'Discharged' } }),
      stable: await Patient.countDocuments({ assignedDoctor: req.user._id, triageLevel: 'Green', status: { $ne: 'Discharged' } }),
      awaitingTriage: await Patient.countDocuments({ assignedDoctor: req.user._id, status: 'Waiting' }),
    };

    const inventory = await Resource.find({ 
      managedBy: req.user._id,
      type: 'Medicine',
    }).lean();

    const alerts = await Alert.find({ status: { $ne: 'Resolved' } })
      .populate('createdBy', 'name')
      .sort({ severity: 1 })
      .limit(10)
      .lean();

    const appointments = await Appointment.find({ assignedDoctor: req.user._id })
      .sort({ date: 1, time: 1 })
      .lean();

    res.json({ success: true, stats, patients, inventory, alerts, appointments });
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
    const patient = await Patient.findOneAndUpdate(
      { _id: id, assignedDoctor: req.user._id },
      req.body,
      { new: true }
    );
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found or not assigned to you.' });
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

// ─── APPOINTMENTS ───
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ assignedDoctor: req.user._id }).sort({ date: 1, time: 1 });
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({ ...req.body, assignedDoctor: req.user._id });
    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, assignedDoctor: req.user._id },
      req.body,
      { new: true }
    );
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found.' });
    res.json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── RESOURCES (MEDICINE STOCK) ───
const addResource = async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, managedBy: req.user._id, type: 'Medicine' });
    res.status(201).json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findOneAndUpdate(
      { _id: req.params.id, managedBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getDashboard, 
  addPatient, 
  updatePatient, 
  getAllPatients,
  getAppointments,
  addAppointment,
  updateAppointment,
  addResource,
  updateResource
};