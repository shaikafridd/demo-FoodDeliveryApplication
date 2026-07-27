const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const Order = require('./models/Order');
const Payment = require('./models/Payment');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/menulink');
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await Admin.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});

    // 1. Create Default Admin
    const admin = await Admin.create({
      name: 'Super Admin',
      email: 'admin@menulink.in',
      password: 'adminpassword123',
      role: 'SuperAdmin',
    });
    console.log(`[Seed] Admin created: ${admin.email}`);

    // 2. Create Demo Restaurant
    const restaurant = await Restaurant.create({
      name: 'Spice House Restaurant',
      ownerName: 'Shaik Afrid',
      email: 'owner@spicehouse.in',
      phone: '9876543210',
      city: 'Hyderabad',
      category: 'Restaurant',
      upiId: 'spicehouse@upi',
      status: 'Active',
    });
    console.log(`[Seed] Restaurant created: ${restaurant.name}`);

    // 3. Create Sample Menu Items
    const menuItems = await Menu.insertMany([
      { restaurantId: restaurant._id, name: 'Butter Chicken & Naan', price: 280, category: 'Main Course' },
      { restaurantId: restaurant._id, name: 'Special Chicken Biryani', price: 320, category: 'Biryani' },
      { restaurantId: restaurant._id, name: 'Paneer Butter Masala', price: 240, category: 'Veg Main' },
      { restaurantId: restaurant._id, name: 'Mango Lassi', price: 90, category: 'Beverages' },
    ]);
    console.log(`[Seed] ${menuItems.length} Menu items created`);

    // 4. Create Sample Order
    const order = await Order.create({
      orderNumber: 'ORD-882910',
      restaurantId: restaurant._id,
      customerName: 'Rahul Sharma',
      customerPhone: '9988776655',
      deliveryAddress: 'Hitec City, Jubilee Hills, Hyderabad',
      items: [
        { menuItemId: menuItems[0]._id, name: menuItems[0].name, price: menuItems[0].price, quantity: 1 },
      ],
      totalAmount: 280,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
    });
    console.log(`[Seed] Sample Order created: ${order.orderNumber}`);

    // 5. Create Sample Payment
    await Payment.create({
      orderId: order._id,
      restaurantId: restaurant._id,
      amount: order.totalAmount,
      paymentMethod: 'UPI',
      transactionRef: 'UPI-TXN-9948201',
      commissionFee: 0,
      status: 'Success',
    });
    console.log(`[Seed] Sample Payment record created with 0% commission fee`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
