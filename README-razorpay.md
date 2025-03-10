# Razorpay Payment Integration

This document outlines the implementation details for Razorpay payment integration.

## Setup Instructions

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Obtain your API keys from the Razorpay Dashboard
3. Update the `.env` file with your Razorpay API keys:
   ```
   RAZORPAY_KEY_ID=rzp_test_yourKeyId
   RAZORPAY_KEY_SECRET=yourKeySecret
   REACT_APP_RAZORPAY_KEY_ID=rzp_test_yourKeyId
   ```

## Implementation Details

### Backend
- Payment creation endpoint: `POST /api/subscriptions/create-order`
- Payment verification endpoint: `POST /api/subscriptions/verify-payment`
- Payment model tracks all transaction details
- Subscription model updated to include Razorpay plan ID

### Frontend
- Razorpay checkout integration in Subscription component
- Dynamic loading of Razorpay script
- Handling of payment success/failure scenarios

## Testing

To test the payment flow:
1. Use Razorpay's test mode credentials
2. For test payments, use any of these card numbers:
   - 4111 1111 1111 1111 (Visa)
   - 5267 3181 8797 5449 (Mastercard)
   - Any future date for expiry
   - Any 3 digits for CVV
   - Any name

## Security Considerations

- Payment verification is done on the server-side using cryptographic signatures
- API keys are stored in environment variables, not in the code
- User authentication is required for payment operations