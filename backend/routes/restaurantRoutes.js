const express = require('express');
const router = express.Router();
const { 
  registerRestaurant, 
  getAllRestaurants, 
  getRestaurantById, 
  updateRestaurantStatus, 
  deleteRestaurant 
} = require('../controllers/restaurantController');

router.post('/register', registerRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.patch('/:id/status', updateRestaurantStatus);
router.delete('/:id', deleteRestaurant);

module.exports = router;
