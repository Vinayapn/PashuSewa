const Resource = require('../models/Resource');
const User = require('../models/User');
const Alert = require('../models/Alert');
const Animal = require('../models/Animal');

const getDashboard = async (req, res) => {
  try {
    const resources = await Resource.find({ managedBy: req.user._id }).lean();
    const volunteers = await User.find({ role: 'rescuer', isActive: true }).select('name email phone').lean();
    const animals = await Animal.find({ ngo: req.user._id }).lean();
    
    const stats = {
      sheltersActive: resources.filter(r => r.type === 'Shelter' && r.status === 'Available').length,
      totalVolunteers: volunteers.length,
      totalResources: resources.length,
      criticalResources: resources.filter(r => r.status === 'Critical' || r.status === 'Depleted').length,
      totalAnimalsSaved: animals.filter(a => a.status === 'Adopted').length,
      totalActiveCampaigns: 0, // Placeholder for now
    };

    const alerts = await Alert.find({ status: { $ne: 'Resolved' } })
      .populate('createdBy', 'name')
      .sort({ severity: 1 })
      .limit(10)
      .lean();

    res.json({ success: true, stats, resources, volunteers, alerts, animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const { name, type, quantity, unit, coordinates, address, notes } = req.body;
    if (!name || !type || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Name, type, and quantity are required.' });
    }

    let status = 'Available';
    if (quantity === 0) status = 'Depleted';
    else if (quantity < 10) status = 'Critical';
    else if (quantity < 30) status = 'Low';

    const resource = await Resource.create({
      name, type, quantity, unit: unit || 'units', status,
      location: coordinates ? { type: 'Point', coordinates } : undefined,
      address, notes, managedBy: req.user._id,
    });

    req.app.get('io')?.emit('resource_updated', { resource });
    res.status(201).json({ success: true, message: 'Resource added.', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.quantity !== undefined) {
      if (updates.quantity === 0) updates.status = 'Depleted';
      else if (updates.quantity < 10) updates.status = 'Critical';
      else if (updates.quantity < 30) updates.status = 'Low';
      else updates.status = 'Available';
    }
    const resource = await Resource.findByIdAndUpdate(id, updates, { new: true });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    req.app.get('io')?.emit('resource_updated', { resource });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const broadcast = async (req, res) => {
  try {
    const { message, priority } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message is required.' });
    
    req.app.get('io')?.emit('broadcast_announcement', {
      from: { name: req.user.name, role: req.user.role, id: req.user._id },
      message,
      priority: priority || 'normal',
      timestamp: new Date(),
    });

    res.json({ success: true, message: 'Broadcast sent to all users.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Animal Adoption Controllers
const getAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ ngo: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, animals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAnimal = async (req, res) => {
  try {
    const animal = await Animal.create({ ...req.body, ngo: req.user._id });
    res.status(201).json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, animal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAnimal = async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id);
    if (!animal) return res.status(404).json({ success: false, message: 'Animal not found' });
    res.json({ success: true, message: 'Animal removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getDashboard, 
  createResource, 
  updateResource, 
  broadcast,
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal
};

