import { Navigate } from 'react-router-dom';
import { hasRole } from '../utils/auth.js'


const ProtectedRoute = ({ children, requiredRole = null }) => {

  // No client-side auth verification. Server will protect API routes.

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