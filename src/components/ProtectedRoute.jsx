import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../utils/auth';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();


  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log('Not authenticated, redirecting to login');
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole && !hasRole(requiredRole)) {
    console.log('Unauthorized role, redirecting to unauthorized page');
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute; 