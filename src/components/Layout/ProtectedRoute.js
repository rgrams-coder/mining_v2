import React from 'react';
import { Navigate } from 'react-router-dom';

// Component for protected routes that redirects to login if not authenticated
function ProtectedRoute({ isAllowed, children, redirectPath = '/login' }) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
}

export default ProtectedRoute;