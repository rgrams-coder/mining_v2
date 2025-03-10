# Library App Backend

This is the backend API for the Library App, providing endpoints for authentication, user management, book management, and subscription handling.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/library_app
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

3. Initialize the database with sample data (optional):
   ```
   node db-init.js
   ```

4. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/user` - Get current user data (requires token)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user (admin or own profile)
- `PUT /api/users/:id` - Update user (admin or own profile)
- `DELETE /api/users/:id` - Delete user (admin only)

### Books
- `GET /api/books` - Get all books (filtered by user subscription)
- `GET /api/books/:id` - Get specific book (checks user subscription access)
- `POST /api/books` - Create a new book (admin only)
- `PUT /api/books/:id` - Update a book (admin only)
- `DELETE /api/books/:id` - Delete a book (admin only)

### Subscriptions
- `GET /api/subscriptions` - Get all subscription plans
- `GET /api/subscriptions/:name` - Get specific subscription plan
- `POST /api/subscriptions` - Create a subscription plan (admin only)
- `PUT /api/subscriptions/:name` - Update a subscription plan (admin only)
- `DELETE /api/subscriptions/:name` - Delete a subscription plan (admin only)
- `PUT /api/subscriptions/user/:id` - Update user subscription

## Default Users

After running the db-init.js script, you'll have these users available:

1. Admin User
   - Email: admin@example.com
   - Password: admin123

2. Regular User
   - Email: user@example.com
   - Password: user123