import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './Subscription.css';

function Subscription() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Basic',
      price: 9.99,
      description: 'Access to basic library content',
      features: ['Access to 1000+ books', 'Read online', 'One device at a time']
    },
    {
      id: 2,
      name: 'Standard',
      price: 14.99,
      description: 'Full access to library content',
      features: ['Access to all books', 'Download for offline reading', 'Two devices at a time']
    },
    {
      id: 3,
      name: 'Premium',
      price: 19.99,
      description: 'Everything plus exclusive content',
      features: ['Access to all books', 'Early access to new releases', 'Unlimited devices', 'Exclusive author interviews']
    }
  ]);

  useEffect(() => {
    // In a real app, fetch subscription status from API
    const fetchSubscriptionStatus = async () => {
      try {
        // Simulating API call
        // const response = await fetch('/api/subscription/status');
        // const data = await response.json();
        // setSubscriptionStatus(data);
        
        // Mock data
        setTimeout(() => {
          setSubscriptionStatus({
            active: true,
            plan: 'Standard',
            renewalDate: '2023-12-31'
          });
            setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  
  const handleSubscribe = async (planId) => {
    try {
      setLoading(true);
      
      // First, check if Razorpay script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection');
        setLoading(false);
        return;
      }
      
      // Create order on server
      const selectedPlan = plans.find(plan => plan.id === planId);
      const response = await axios.post('/api/subscriptions/create-order', {
        subscriptionId: selectedPlan.id,
        currency: 'INR'
      });
      
      const { orderId, amount, currency, subscriptionName } = response.data;
      
      // Open Razorpay payment form
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Mining Library',
        description: `${subscriptionName} Subscription`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const { data } = await axios.post('/api/subscriptions/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              subscriptionId: selectedPlan.id
            });
            
            // Update UI
            setSubscriptionStatus({
              active: true,
              plan: selectedPlan.name,
              renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
            });
            
            alert('Payment successful! Your subscription is now active.');
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
          setLoading(false);
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
        },
        theme: {
          color: '#3399cc'
        }
      };
      
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to create subscription. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        // In a real app, make API call to cancel subscription
        setLoading(true);
        setTimeout(() => {
          setSubscriptionStatus({
            ...subscriptionStatus,
            active: false
          });
          setLoading(false);
          alert('Subscription cancelled successfully.');
        }, 1000);
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Failed to cancel subscription. Please try again.');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading subscription information...</div>;
  }

  return (
    <div className="subscription-container">
      <h1>Subscription Management</h1>
      
      {subscriptionStatus && subscriptionStatus.active ? (
        <div className="current-subscription">
          <h2>Current Subscription</h2>
          <div className="subscription-details">
            <p><strong>Plan:</strong> {subscriptionStatus.plan}</p>
            <p><strong>Renewal Date:</strong> {subscriptionStatus.renewalDate}</p>
            <p><strong>Status:</strong> <span className="active-status">Active</span></p>
            <button className="cancel-button" onClick={handleCancel}>Cancel Subscription</button>
          </div>
        </div>
      ) : (
        <>
          <div className="no-subscription">
            <h2>You don't have an active subscription</h2>
            <p>Please select a subscription plan to access the library.</p>
          </div>
          <div className="subscription-plans">
            <h2>Available Plans</h2>
            <div className="plans-grid">
              {plans.map(plan => (
                <div key={plan.id} className="plan-card">
                  <h3>{plan.name}</h3>
                  <p className="price">${plan.price}<span>/month</span></p>
                  <p className="description">{plan.description}</p>
                  <ul className="features">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleSubscribe(plan.id)} className="subscribe-button">
                    Subscribe Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Subscription;