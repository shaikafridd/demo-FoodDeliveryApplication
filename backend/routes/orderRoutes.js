const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByRestaurant, updateOrderStatus } = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;
