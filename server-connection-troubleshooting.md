# Server Connection Troubleshooting Guide

## Problem: Server Not Connected

The server is having trouble connecting to MongoDB. Here are the steps to fix this issue:

### 1. Verify MongoDB is Running

```bash
# For Linux/Mac
sudo systemctl status mongodb
# or
brew services list | grep mongodb

# For Windows
# Check in Services application if MongoDB is running
```

If MongoDB is not running, start it:

```bash
# For Linux/Mac
sudo systemctl start mongodb
# or
brew services start mongodb-community

# For Windows
# Start MongoDB service from Services application
```

### 2. Check MongoDB Connection String

Ensure the connection string in your `.env` file is correct:
```
MONGODB_URI=mongodb://localhost:27017/bookstore
```

If you're using MongoDB Atlas:
- Update the connection string to your Atlas connection string
- Make sure your IP address is whitelisted in the Atlas dashboard

### 3. Verify Network Configuration

- Ensure port 27017 is accessible
- Check for any firewall rules that might be blocking the connection

### 4. Enhanced Error Handling

If you want to add additional debugging to the server.js file, update the mongoose connection section with more detailed error logging.

### 5. MongoDB Installation

If MongoDB is not installed:

```bash
# For Ubuntu/Debian
sudo apt-get install mongodb

# For macOS
brew tap mongodb/brew
brew install mongodb-community

# For Windows
# Download installer from MongoDB website
```

### 6. Alternative Remote MongoDB

If you can't run MongoDB locally, consider using MongoDB Atlas:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and update the `.env` file