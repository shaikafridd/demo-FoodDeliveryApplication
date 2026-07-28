const express = require('express');
const router = express.Router();
const { 
  getAllMenuItems, 
  getMenuByRestaurant, 
  createMenuItem, 
  updateMenuItem, 
  toggleMenuStock, 
  deleteMenuItem 
} = require('../controllers/menuController');

router.get('/', getAllMenuItems);
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', createMenuItem);
router.put('/:id', updateMenuItem);
router.patch('/:id/stock', toggleMenuStock);
router.delete('/:id', deleteMenuItem);

module.exports = router;
