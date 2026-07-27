const Order = require('../models/Order');

/**
 * @desc    Create new Customer Order
 * @route   POST /api/orders
 * @access  Public
 */
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, customerName, customerPhone, deliveryAddress, items, totalAmount } = req.body;

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    const order = await Order.create({
      orderNumber,
      restaurantId,
      customerName: customerName || 'Guest User',
      customerPhone: customerPhone || '9876543210',
      deliveryAddress: deliveryAddress || 'Table / Direct Delivery',
      items: items || [],
      totalAmount: totalAmount || 0,
      orderStatus: 'Received',
      paymentStatus: 'Pending',
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
