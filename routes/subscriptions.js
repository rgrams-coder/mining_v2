const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Payment = require('../models/Payment');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

// @route   GET /api/subscriptions
// @desc    Get all subscription plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/subscriptions/:name
// @desc    Get subscription plan by name
// @access  Public
router.get('/:name', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ name: req.params.name });
    
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/subscriptions
// @desc    Create a subscription plan (admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const { name, price, description, features } = req.body;
    
    // Check if subscription plan already exists
    let subscription = await Subscription.findOne({ name });
    if (subscription) {
      return res.status(400).json({ msg: 'Subscription plan already exists' });
    }
    
    // Create new subscription plan
    subscription = new Subscription({
      name,
      price,
      description,
      features
    });
    
    await subscription.save();
    
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/subscriptions/:name
// @desc    Update a subscription plan (admin only)
// @access  Private/Admin
router.put('/:name', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const { price, description, features } = req.body;
    
    // Find subscription plan
    let subscription = await Subscription.findOne({ name: req.params.name });
    
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    // Update fields
    if (price) subscription.price = price;
    if (description) subscription.description = description;
    if (features) subscription.features = features;
    
    await subscription.save();
    
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/subscriptions/:name
// @desc    Delete a subscription plan (admin only)
// @access  Private/Admin
router.delete('/:name', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Find subscription plan
    const subscription = await Subscription.findOne({ name: req.params.name });
    
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    // Check if this plan is in use
    const usersWithSubscription = await User.countDocuments({ subscription: req.params.name });
    if (usersWithSubscription > 0) {
      return res.status(400).json({ 
        msg: 'Cannot delete subscription plan that is in use by users' 
      });
    }
    
    await subscription.remove();
    
    res.json({ msg: 'Subscription plan removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/subscriptions/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', auth, async (req, res) => {
  try {
    const { subscriptionId, currency = 'INR' } = req.body;
    
    // Find the subscription
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    // Create Razorpay order
    const options = {
      amount: Math.round(subscription.price * 100), // amount in smallest currency unit (paise)
      currency,
      receipt: `receipt_order_${new Date().getTime()}`,
      notes: {
        subscriptionId: subscription._id.toString(),
        userId: req.user.id
      }
    };
    
    const order = await razorpay.orders.create(options);
    
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subscriptionName: subscription.name
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/subscriptions/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      subscriptionId
    } = req.body;
    
    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");
      
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      return res.status(400).json({ msg: 'Payment verification failed' });
    }
    
    // Create payment record
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    // Get payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    
    const payment = new Payment({
      user: req.user.id,
      subscription: subscriptionId,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      amount: paymentDetails.amount / 100, // Convert from paise to rupees
      currency: paymentDetails.currency,
      status: 'captured'
    });
    
    await payment.save();
    
    // Update user subscription
    const user = await User.findById(req.user.id);
    user.subscription = subscription.name;
    await user.save();
    
    res.json({ 
      success: true,
      payment,
      subscription: subscription.name
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/subscriptions/user/:id
// @desc    Update user subscription
// @access  Private
router.put('/user/:id', auth, async (req, res) => {
  try {
    const { subscription } = req.body;
    
    // Check if user is authorized (admin or own profile)
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Check if subscription plan exists
    const subscriptionPlan = await Subscription.findOne({ name: subscription });
    if (!subscriptionPlan) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    
    // Update user subscription
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.subscription = subscription;
    await user.save();
    
    res.json({ 
      msg: 'Subscription updated',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscription: user.subscription
      }
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;