// Load environment variables from .env file
require('dotenv').config();

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using Mongoose
 */
const connectDB = async () => {
  try {
    // MongoDB URI from .env or fallback to localhost
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localfallback';

    // Mongoose connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Time to wait for initial connection
      socketTimeoutMS: 10000, // Reduced timeout for better responsiveness
    };

    // Attempt connection
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Event listeners for extra info or debugging
    mongoose.connection.on('connected', () => {
      console.log('🔗 Mongoose connected to the database.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose disconnected from the database.');
    });

    return conn;
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err.message);

    // More detailed error handling
    switch (err.name) {
      case 'MongooseServerSelectionError':
        console.error('🚫 Server selection error – Is MongoDB running?');
        break;
      case 'MongoNetworkError':
        console.error('🌐 Network error – Check your internet or MongoDB host.');
        break;
      case 'MongoParseError':
        console.error('🧩 URI parsing error – Check your MongoDB connection string.');
        break;
      default:
        console.error('🛑 Unknown database connection error.');
        break;
    }

    process.exit(1);
  }
};

// Graceful shutdown on Ctrl+C
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Mongoose connection closed due to app termination.');
  process.exit(0);
});

// Export the function to be used in other files
module.exports = connectDB;
