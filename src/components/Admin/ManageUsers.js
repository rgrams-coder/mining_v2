import React, { useState, useEffect } from 'react';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch users from an API
    const fetchUsers = async () => {
      try {
        // Mock data for demonstration
        const mockUsers = [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
          { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
        ];
        
        setUsers(mockUsers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    // In a real app, this would call an API to delete the user
    setUsers(users.filter(user => user.id !== userId));
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      <div className="users-list">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;