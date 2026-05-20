const Alert = require('../models/Alert');
const User = require('../models/User');

// Get rescuer's active alerts and stats
const getDashboard = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: { $in: ['Pending', 'Active', 'InProgress'] } })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(20);

    const stats = {
      totalActive: await Alert.countDocuments({ status: 'Active' }),
      totalSOS: await Alert.countDocuments({ type: 'SOS', status: { $ne: 'Resolved' } }),
      resolvedToday: await Alert.countDocuments({
        status: 'Resolved',
        updatedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
      teamMembers: await User.countDocuments({ role: 'rescuer', isActive: true }),
    };

    res.json({ success: true, alerts, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create SOS Alert
const createAlert = async (req, res) => {
  try {
    const { title, description, type, severity, coordinates, address, victims } = req.body;
    if (!title || !description || !coordinates) {
      return res.status(400).json({ success: false, message: 'Title, description, and location are required.' });
    }

    const alert = await Alert.create({
      title,
      description,
      type: type || 'SOS',
      severity: severity || 'High',
      location: { type: 'Point', coordinates },
      address,
      victims: victims || 0,
      createdBy: req.user._id,
      status: 'Pending',
    });

    // Emit via socket (handled in socket layer)
    req.app.get('io')?.emit('alert_created', { alert });

    res.status(201).json({ success: true, message: 'Alert created successfully.', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update alert status
const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      id,
      { status, $addToSet: { assignedTo: req.user._id } },
      { new: true }
    ).populate('createdBy', 'name role');

    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });

    req.app.get('io')?.emit('alert_updated', { alert });

    res.json({ success: true, message: 'Alert updated.', alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all alerts on map
const getMapAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ status: { $ne: 'Resolved' } })
      .select('title type severity status location address createdAt')
      .lean();
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update alert details
const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, severity, address, description } = req.body;

    const alert = await Alert.findById(id);
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' });

    // Check if user is the creator (optional but good practice)
    if (alert.createdBy.toString() !== req.user._id.toString() && !alert.assignedTo.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this alert.' });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      id,
      { title, type, severity, address, description },
      { new: true }
    ).populate('createdBy', 'name role');

    req.app.get('io')?.emit('alert_updated', { alert: updatedAlert });

    res.json({ success: true, message: 'Alert updated successfully.', alert: updatedAlert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard, createAlert, updateAlertStatus, getMapAlerts, updateAlert };
