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


module.exports = router;
