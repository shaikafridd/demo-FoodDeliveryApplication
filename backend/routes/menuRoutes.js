const express = require('express');
const router = express.Router();
const { getMenuByRestaurant, createMenuItem } = require('../controllers/menuController');

router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', createMenuItem);

module.exports = router;
