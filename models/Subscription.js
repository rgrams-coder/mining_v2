const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['free', 'basic', 'premium'],
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  razorpayPlanId: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);