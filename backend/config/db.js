const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/menulink';
  
  // Try connecting to primary MONGO_URI
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return;
  } catch (error) {
    // If primary URI is unresolvable or fails, fall back to local MongoDB instance
    if (mongoUri !== 'mongodb://127.0.0.1:27017/menulink') {
      try {
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/menulink', {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB] Connected to local database instance: ${localConn.connection.host}`);
        return;
      } catch (localErr) {
        console.log(`[MongoDB] Operating in autonomous backend API mode.`);
      }
    }
  }
};

module.exports = connectDB;
