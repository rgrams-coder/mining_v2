const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Subscription = require('./models/Subscription');

// Load environment variables
dotenv.config();

//(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)

// Connect to MongoDB
console.log('Attempting to connect to MongoDB for data initialization...');
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  })
  .then(() => console.log('MongoDB connected successfully for initialization'))
  .catch(err => {
    console.error('MongoDB connection error during initialization:', err.message);
    console.log('Please ensure that:');
    console.log(' - MongoDB is running on your local machine');
    console.log(' - Your connection string in .env file is correct');
    console.log(' - If using Atlas, whitelist your IP address');
    process.exit(1); // Exit if DB connection fails during initialization
  });

// Initialize data
const initializeData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Subscription.deleteMany({});

    // Create subscription plans
    const freePlan = await Subscription.create({
      name: 'free',
      price: 0,
      description: 'Free access to limited books',
      features: ['Access to free books', 'Create reading lists']
    });

    const basicPlan = await Subscription.create({
      name: 'basic',
      price: 9.99,
      description: 'Access to most books',
      features: ['Access to free and basic books', 'Create reading lists', 'Bookmark favorites']
    });

    const premiumPlan = await Subscription.create({
      name: 'premium',
      price: 19.99,
      description: 'Full access to all books',
      features: ['Access to all books', 'Create reading lists', 'Bookmark favorites', 'Offline reading']
    });

    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      subscription: 'premium'
    });

    // Create regular user
    const regularUser = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user',
      subscription: 'free'
    });

    // Create some books
    const freeBook = await Book.create({
      title: 'Introduction to Reading',
      author: 'John Smith',
      description: 'A beginner\'s guide to reading effectively.',
      accessLevel: 'free'
    });

    const basicBook = await Book.create({
      title: 'Advanced Reading Techniques',
      author: 'Jane Doe',
      description: 'Take your reading skills to the next level with these advanced techniques.',
      accessLevel: 'basic'
    });

    const premiumBook = await Book.create({
      title: 'Expert Reading Mastery',
      author: 'Robert Johnson',
      description: 'Become a reading master with these expert tips and strategies.',
      accessLevel: 'premium'
    });

    console.log('Database initialized with sample data');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing data:', err);
    process.exit(1);
  }
};

initializeData();