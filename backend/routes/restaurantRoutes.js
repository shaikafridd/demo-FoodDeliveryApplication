const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Register Restaurant (Lead Capture Form)
router.post('/register', async (req, res) => {
  try {
    const { name, ownerName, email, phone, city, category } = req.body;
    if (!name || !ownerName || !phone) {
      return res.status(400).json({ success: false, message: 'Name, Owner Name, and Phone are required' });
    }

    const restaurant = await Restaurant.create({
      name,
      ownerName,
      email: email || `${phone}@menulink.in`,
      phone,
      city: city || 'Hyderabad',
      category: category || 'Restaurant',
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Restaurant onboarded successfully! Demo menu and UPI link active.',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List all restaurants
router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
