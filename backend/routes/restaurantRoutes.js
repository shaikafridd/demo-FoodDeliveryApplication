const express = require('express');
const router = express.Router();
const { registerRestaurant, getAllRestaurants, getRestaurantById } = require('../controllers/restaurantController');

router.post('/register', registerRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

module.exports = router;
