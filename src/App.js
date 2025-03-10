import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Layout Components
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Layout/ProtectedRoute';

// User Components
import Library from './components/Library/Library';
import BookDetails from './components/Library/BookDetails';
import Subscription from './components/Subscription/Subscription';
import Profile from './components/User/Profile';

// Admin Components
import AdminDashboard from './components/Admin/Dashboard';
import ManageUsers from './components/Admin/ManageUsers';
import ManageBooks from './components/Admin/ManageBooks';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (token) {
      setIsAuthenticated(true);
      setIsAdmin(user && user.role === 'admin');
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <main className="container">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/library" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated}>
                  <Library />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:id" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated}>
                  <BookDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated}>
                  <Subscription />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated}>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated && isAdmin}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated && isAdmin}>
                  <ManageUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated && isAdmin}>
                  <ManageBooks />
                </ProtectedRoute>
              } 
            />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to={isAuthenticated ? "/library" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
