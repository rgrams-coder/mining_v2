import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

function Navbar({ isAuthenticated, isAdmin }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Force a refresh to update auth state
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Library System</Link>
      </div>
      <ul className="navbar-nav">
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/library">Browse Library</Link>
            </li>
            <li className="nav-item">
              <Link to="/subscription">My Subscription</Link>
            </li>
            <li className="nav-item">
              <Link to="/profile">Profile</Link>
            </li>
            {isAdmin && (
              <li className="nav-item admin-dropdown">
                <span>Admin</span>
                <div className="dropdown-content">
                  <Link to="/admin">Dashboard</Link>
                  <Link to="/admin/users">Manage Users</Link>
                  <Link to="/admin/books">Manage Books</Link>
                </div>
              </li>
            )}
            <li className="nav-item">
              <button onClick={handleLogout} className="nav-link-button">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;