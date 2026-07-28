const Order = require('../models/Order');

/**
 * @desc    Get All Customer Orders (for Admin)
 * @route   GET /api/orders
 * @access  Public / Admin
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get Orders by Restaurant ID
 * @route   GET /api/orders/restaurant/:restaurantId
 * @access  Public / Admin
 */
exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create new Customer Order
 * @route   POST /api/orders
 * @access  Public
 */
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, customerName, customerPhone, deliveryAddress, items, totalAmount, orderStatus } = req.body;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    // Map items if array of strings or objects
    const formattedItems = Array.isArray(items) ? items.map(item => {
      if (typeof item === 'string') {
        return { name: item, price: 100, quantity: 1 };
      }
      return {
        name: item.name || 'Food Item',
        price: item.price || 100,
        quantity: item.quantity || 1,
      };
    }) : [];

    const order = await Order.create({
      orderNumber,
      restaurantId: restaurantId && restaurantId.length === 24 ? restaurantId : '66a5e1234567890123456789',
      customerName: customerName || 'Guest Customer',
      customerPhone: customerPhone || '9876543210',
      deliveryAddress: deliveryAddress || 'Direct Delivery / Table Order',
      items: formattedItems,
      totalAmount: totalAmount || 250,
      orderStatus: orderStatus || 'Received',
      paymentStatus: 'Paid',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update Order Status
 * @route   PATCH /api/orders/:id/status
 * @access  Public / Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(orderStatus && { orderStatus }), ...(paymentStatus && { paymentStatus }) },
      { new: true }
    );
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete Order Record
 * @route   DELETE /api/orders/:id
 * @access  Public / Admin
 */
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
