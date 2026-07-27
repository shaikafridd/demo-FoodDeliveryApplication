const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City/Location is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Restaurant', 'Home Chef', 'Tiffin Service', 'Sweet Shop', 'Cloud Kitchen', 'Fast Food'],
    default: 'Restaurant',
  },
  upiId: {
    type: String,
    default: 'merchant@upi',
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Inactive'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
