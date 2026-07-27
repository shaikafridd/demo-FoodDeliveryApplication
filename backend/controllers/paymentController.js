const Payment = require('../models/Payment');
const Order = require('../models/Order');

/**
 * @desc    Verify 0%-Commission Payment Receipt
 * @route   POST /api/payments/verify
 * @access  Public
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, restaurantId, amount, paymentMethod } = req.body;

    const transactionRef = `UPI-TXN-${Date.now().toString().slice(-8)}`;

    const payment = await Payment.create({
      orderId,
      restaurantId,
      amount,
      paymentMethod: paymentMethod || 'UPI',
      transactionRef,
      commissionFee: 0,
      status: 'Success',
    });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'Paid', orderStatus: 'Preparing' });
    }

    res.status(201).json({
      success: true,
      message: 'Instant UPI Payout verified. ₹0 commission charged!',
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
