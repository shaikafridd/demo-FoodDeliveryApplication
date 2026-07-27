const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create new order (from Chat Widget / Digital Menu)
router.post('/', async (req, res) => {
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
});

// Get orders by Restaurant ID
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Order Status
router.patch('/:id/status', async (req, res) => {
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
});

module.exports = router;
