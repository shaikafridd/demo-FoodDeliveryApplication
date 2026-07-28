const Menu = require('../models/Menu');

/**
 * @desc    Get All Menu Items
 * @route   GET /api/menu
 * @access  Public
 */
exports.getAllMenuItems = async (req, res) => {
  try {
    const items = await Menu.find().sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Menu Items for a Restaurant
 * @route   GET /api/menu/:restaurantId
 * @access  Public
 */
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    let query = {};
    if (restaurantId && restaurantId.length === 24) {
      query = { restaurantId };
    }
    const items = await Menu.find(query);
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
    const { restaurantId, name, description, price, category, isAvailable } = req.body;
    const menuItem = await Menu.create({
      restaurantId: restaurantId && restaurantId.length === 24 ? restaurantId : '66a5e1234567890123456789',
      name,
      description: description || 'Freshly prepared delicious item',
      price: Number(price) || 150,
      category: category || 'Main Course',
      isAvailable: isAvailable !== false,
    });
    res.status(201).json({ success: true, menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Menu Item
 * @route   PUT /api/menu/:id
 * @access  Public / Admin
 */
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable } = req.body;
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, isAvailable },
      { new: true }
    );
    res.json({ success: true, menuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle Menu Stock Availability
 * @route   PATCH /api/menu/:id/stock
 * @access  Public / Admin
 */
exports.toggleMenuStock = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ success: true, menuItem: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Menu Item
 * @route   DELETE /api/menu/:id
 * @access  Public / Admin
 */
exports.deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
