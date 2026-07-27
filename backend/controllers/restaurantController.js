const Restaurant = require('../models/Restaurant');

/**
 * @desc    Register a new Restaurant / Outlet Lead
 * @route   POST /api/restaurants/register
 * @access  Public
 */
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, ownerName, email, phone, city, category } = req.body;

    if (!name || !ownerName || !phone) {
      return res.status(400).json({ success: false, message: 'Business Name, Owner Name, and Phone Number are required' });
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
      message: 'Restaurant onboarded successfully!',
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all registered Restaurants
 * @route   GET /api/restaurants
 * @access  Public
 */
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json({ success: true, count: restaurants.length, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single Restaurant by ID
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
