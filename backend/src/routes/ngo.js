const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/authMiddleware');
const { 
  getDashboard, 
  createResource, 
  updateResource, 
  broadcast,
  getAnimals,
  createAnimal,
  updateAnimal,
  deleteAnimal
} = require('../controllers/ngoController');

const {
  getCampaigns, createCampaign, updateCampaign, deleteCampaign,
  getDonations, createDonation, updateDonation, deleteDonation,
  getVolunteers, createVolunteer, updateVolunteer, deleteVolunteer,
} = require('../controllers/ngoDataController');

router.use(authenticate, requireRole('ngo'));
router.get('/dashboard', getDashboard);
router.post('/resources', createResource);
router.patch('/resources/:id', updateResource);
router.post('/broadcast', broadcast);

// Animal Routes
router.get('/animals', getAnimals);
router.post('/animals', createAnimal);
router.patch('/animals/:id', updateAnimal);
router.delete('/animals/:id', deleteAnimal);

// Campaign Routes
router.get('/campaigns', getCampaigns);
router.post('/campaigns', createCampaign);
router.put('/campaigns/:id', updateCampaign);
router.delete('/campaigns/:id', deleteCampaign);

// Donation Routes
router.get('/donations', getDonations);
router.post('/donations', createDonation);
router.put('/donations/:id', updateDonation);
router.delete('/donations/:id', deleteDonation);

// Volunteer Routes
router.get('/volunteers', getVolunteers);
router.post('/volunteers', createVolunteer);
router.put('/volunteers/:id', updateVolunteer);
router.delete('/volunteers/:id', deleteVolunteer);

module.exports = router;
