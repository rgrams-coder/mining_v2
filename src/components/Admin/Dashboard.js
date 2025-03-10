import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h3>Users Management</h3>
          <p>Manage user accounts and permissions</p>
        </div>
        <div className="dashboard-card">
          <h3>Books Management</h3>
          <p>Add, edit, or remove books from the library</p>
        </div>
        <div className="dashboard-card">
          <h3>Subscription Management</h3>
          <p>Monitor and manage subscription plans</p>
        </div>
        <div className="dashboard-card">
          <h3>Analytics</h3>
          <p>View usage statistics and reports</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;