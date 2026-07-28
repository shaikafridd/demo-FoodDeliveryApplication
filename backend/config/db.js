const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/menulink';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Primary connection failed (${error.message}). Attempting local fallback...`);
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/menulink', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[MongoDB Local] Connected fallback to host: ${conn.connection.host}`);
    } catch (fallbackError) {
      console.warn(`[MongoDB Notice] Operating in autonomous mock data mode.`);
    }
  }
};

module.exports = connectDB;
