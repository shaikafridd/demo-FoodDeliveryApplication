const express = require('express');
const router = express.Router();
const { getAllPayments, verifyPayment } = require('../controllers/paymentController');

router.get('/', getAllPayments);
router.post('/verify', verifyPayment);

module.exports = router;
