const Restaurant = require('../models/Restaurant');

/**
 * @desc    Register a new Restaurant / Outlet Lead
 * @route   POST /api/restaurants/register
 * @access  Public
 */
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, ownerName, email, phone, city, category } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Business Name and Phone Number are required' });
    }

    const restaurant = await Restaurant.create({
      name,
      ownerName: ownerName || name,
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

/**
 * @desc    Update Restaurant Status
 * @route   PATCH /api/restaurants/:id/status
 * @access  Public / Admin
 */
exports.updateRestaurantStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Restaurant
 * @route   DELETE /api/restaurants/:id
 * @access  Public / Admin
 */
exports.deleteRestaurant = async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
