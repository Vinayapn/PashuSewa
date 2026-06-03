const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Alert = require('../models/Alert');
// ─── GET DASHBOARD STATS ────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsersCount = await User.countDocuments({ role: 'user' });
    const totalNgosCount = await User.countDocuments({ role: 'ngo' });
    const totalDoctorsCount = await User.countDocuments({ role: 'doctor' });
    const totalRescuersCount = await User.countDocuments({ role: 'rescuer' });

    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });

    const totalDonationsArray = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    const totalDonations = totalDonationsArray.length > 0 ? totalDonationsArray[0].totalAmount : 0;

    const totalReports = await Alert.countDocuments();

    res.json({
      success: true,
      data: {
        totalUsers: totalUsersCount,
        totalNgos: totalNgosCount,
        totalDoctors: totalDoctorsCount,
        totalRescuers: totalRescuersCount,
        totalCampaigns,
        activeCampaigns,
        totalDonations,
        totalReports
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET USERS (With Filtering & Pagination) ──────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role && role !== 'all') {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const users = await User.find(query)
      .select('-password -resetOTP -resetOTPExpiry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── UPDATE USER STATUS (Activate/Deactivate) ───────────────────────────────
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot deactivate an admin user' });
    }

    user.isActive = isActive;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── DELETE USER ────────────────────────────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete an admin user' });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET ALERTS / REPORTS ───────────────────────────────────────────────────
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET CAMPAIGNS ─────────────────────────────────────────────────────────
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('createdBy', 'name email organizationName')
      .sort({ date: -1 });
    
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── GET DONATIONS ─────────────────────────────────────────────────────────
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('ngo', 'name email organizationName')
      .sort({ date: -1 });
    
    res.json({ success: true, data: donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
