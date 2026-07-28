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

    // 2. Create Demo Restaurants
    const r1 = await Restaurant.create({
      name: 'Spice House Restaurant',
      ownerName: 'Shaik Afrid',
      email: 'owner@spicehouse.in',
      phone: '9876543210',
      city: 'Hyderabad',
      category: 'Restaurant',
      upiId: 'spicehouse@upi',
      status: 'Active',
    });

    const r2 = await Restaurant.create({
      name: 'Bawarchi Biryani',
      ownerName: 'Syed Ali',
      email: 'ali@bawarchi.in',
      phone: '9876543211',
      city: 'Hyderabad',
      category: 'Restaurant',
      upiId: 'bawarchi@upi',
      status: 'Active',
    });

    const r3 = await Restaurant.create({
      name: 'Annapurna Tiffins',
      ownerName: 'Venkatesh Rao',
      email: 'venkat@annapurna.in',
      phone: '9876543212',
      city: 'Bengaluru',
      category: 'Tiffin Service',
      upiId: 'annapurna@upi',
      status: 'Active',
    });

    const r4 = await Restaurant.create({
      name: "Mamma's Kitchen",
      ownerName: 'Sunita Sharma',
      email: 'sunita@mammakitchen.in',
      phone: '9876543213',
      city: 'Mumbai',
      category: 'Home Chef',
      upiId: 'mammakitchen@upi',
      status: 'Active',
    });
    console.log('[Seed] 4 Restaurants onboarded.');

    // 3. Create Sample Menu Items
    const menuItems = await Menu.insertMany([
      { restaurantId: r1._id, name: 'Butter Chicken & Naan Combo', price: 280, category: 'Main Course', isAvailable: true },
      { restaurantId: r1._id, name: 'Special Chicken Biryani', price: 320, category: 'Biryani', isAvailable: true },
      { restaurantId: r1._id, name: 'Paneer Butter Masala', price: 240, category: 'Veg Main', isAvailable: true },
      { restaurantId: r1._id, name: 'Mango Lassi', price: 90, category: 'Beverages', isAvailable: true },
      { restaurantId: r2._id, name: 'Hyderabadi Mutton Biryani', price: 380, category: 'Biryani', isAvailable: true },
      { restaurantId: r3._id, name: 'Ghee Karam Masala Dosa', price: 110, category: 'Tiffins', isAvailable: true },
      { restaurantId: r4._id, name: 'Home Style Veg Thali', price: 160, category: 'Thali', isAvailable: true }
    ]);
    console.log(`[Seed] ${menuItems.length} Menu items created`);

    // 4. Create Sample Orders
    const o1 = await Order.create({
      orderNumber: 'ORD-882910',
      restaurantId: r1._id,
      customerName: 'Rahul Sharma',
      customerPhone: '9988776655',
      deliveryAddress: 'Hitec City, Hyderabad',
      items: [
        { menuItemId: menuItems[0]._id, name: menuItems[0].name, price: menuItems[0].price, quantity: 1 },
        { menuItemId: menuItems[3]._id, name: menuItems[3].name, price: menuItems[3].price, quantity: 1 }
      ],
      totalAmount: 370,
      orderStatus: 'Delivered',
      paymentStatus: 'Paid',
    });

    const o2 = await Order.create({
      orderNumber: 'ORD-882911',
      restaurantId: r1._id,
      customerName: 'Priya Verma',
      customerPhone: '9876501234',
      deliveryAddress: 'Jubilee Hills, Hyderabad',
      items: [
        { menuItemId: menuItems[1]._id, name: menuItems[1].name, price: menuItems[1].price, quantity: 2 }
      ],
      totalAmount: 640,
      orderStatus: 'Preparing',
      paymentStatus: 'Paid',
    });

    const o3 = await Order.create({
      orderNumber: 'ORD-882912',
      restaurantId: r2._id,
      customerName: 'Anil Kumar',
      customerPhone: '9123456789',
      deliveryAddress: 'Kukatpally, Hyderabad',
      items: [
        { menuItemId: menuItems[4]._id, name: menuItems[4].name, price: menuItems[4].price, quantity: 1 }
      ],
      totalAmount: 380,
      orderStatus: 'Received',
      paymentStatus: 'Paid',
    });

    console.log('[Seed] 3 Sample Orders created.');

    // 5. Create Sample Payments
    await Payment.create({
      orderId: o1._id,
      restaurantId: r1._id,
      amount: o1.totalAmount,
      paymentMethod: 'UPI',
      transactionRef: 'UPI-TXN-9948201',
      commissionFee: 0,
      status: 'Success',
    });

    await Payment.create({
      orderId: o2._id,
      restaurantId: r1._id,
      amount: o2.totalAmount,
      paymentMethod: 'UPI',
      transactionRef: 'UPI-TXN-9948202',
      commissionFee: 0,
      status: 'Success',
    });

    await Payment.create({
      orderId: o3._id,
      restaurantId: r2._id,
      amount: o3.totalAmount,
      paymentMethod: 'UPI',
      transactionRef: 'UPI-TXN-9948203',
      commissionFee: 0,
      status: 'Success',
    });
    console.log(`[Seed] 3 Sample Payments created with 0% commission fees.`);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
