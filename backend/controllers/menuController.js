const Menu = require('../models/Menu');

/**
 * @desc    Get Menu Items for a Restaurant
 * @route   GET /api/menu/:restaurantId
 * @access  Public
 */
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const items = await Menu.find({ restaurantId: req.params.restaurantId, isAvailable: true });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add new Menu Item
 * @route   POST /api/menu
 * @access  Public / Admin
 */
exports.createMenuItem = async (req, res) => {
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
};
