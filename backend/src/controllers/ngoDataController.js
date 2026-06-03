const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');

// ---------- Campaign ----------
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user._id }).lean();
    res.json({ success: true, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const { title, desc, raised = 0, goal, status = 'active' } = req.body;
    const campaign = await Campaign.create({
      title,
      desc,
      raised,
      goal,
      status,
      createdBy: req.user._id,
      date: new Date(),
    });
    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const campaign = await Campaign.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updates, { new: true });
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Campaign.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Campaign not found' });
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- Donation ----------
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ createdBy: req.user._id }).lean();
    res.json({ success: true, data: donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDonation = async (req, res) => {
  try {
    const { donor, email, phone, campaign, amount, method, status = 'completed', msg } = req.body;
    const donation = await Donation.create({
      donor,
      email,
      phone,
      campaign,
      amount,
      method,
      status,
      msg,
      createdBy: req.user._id,
      date: new Date(),
    });
    res.status(201).json({ success: true, data: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const donation = await Donation.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updates, { new: true });
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, data: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Donation.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, message: 'Donation deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------- Volunteer ----------
exports.getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ createdBy: req.user._id }).lean();
    res.json({ success: true, data: volunteers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createVolunteer = async (req, res) => {
  try {
    const { name, email, phone, skills = [], status = 'pending', contributions = 0, cases = 0 } = req.body;
    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      skills,
      status,
      contributions,
      cases,
      createdBy: req.user._id,
      joined: new Date(),
    });
    res.status(201).json({ success: true, data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const volunteer = await Volunteer.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updates, { new: true });
    if (!volunteer) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, data: volunteer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Volunteer.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!result) return res.status(404).json({ success: false, message: 'Volunteer not found' });
    res.json({ success: true, message: 'Volunteer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
