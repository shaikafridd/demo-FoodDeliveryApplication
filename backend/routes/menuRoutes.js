const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get Menu for a specific Restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const items = await Menu.find({ restaurantId: req.params.restaurantId, isAvailable: true });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add new Menu Item
router.post('/', async (req, res) => {
  try {
    const { restaurantId, name, description, price, category } = req.body;
    const menuItem = await Menu.create({
      restaurantId,
      name,
      description,
      price,
      category: category || 'Main Course',
    });
    res.status(201).json({ success: true, menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
