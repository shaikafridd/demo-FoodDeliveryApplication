const express = require('express');
const router = express.Router();
const { 
  getAllOrders, 
  getOrdersByRestaurant, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder 
} = require('../controllers/orderController');

router.get('/', getAllOrders);
router.get('/restaurant/:restaurantId', getOrdersByRestaurant);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
