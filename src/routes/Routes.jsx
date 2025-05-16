import Layout from "../component/layout/Layout"
import Features from '../features/Features'
import Login from "../authentication/Login"
import Register from "../authentication/UserSignUp"
import RegisterTherapist from "../authentication/RegisterTherapist"
import ClientDashboard from "../pages/dashboard/ClientDashboard"
import Chat from "../pages/chat"
import TherapistDashboard from "../pages/dashboard/TherapistDashboard"
import OTPVerification from "../authentication/OTPVerification"
import PaymentForm from "../components/payment/PaymentForm"
import { Navigate } from 'react-router-dom'
import TalkToTherapist from "../components/therapist/TalkToTherapist"

// Protected Route Component
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-based Protected Route Component
// eslint-disable-next-line react/prop-types
const RoleProtectedRoute = ({ children, allowedRole }) => {

  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('userRole');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (userRole !== allowedRole) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }
  
  return children;
};

export const Routes = [
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path:"/",
                element: <Features/>,
            }
        ]       
    },

    {
        path: "/register/client",
        element: <Register/>
    },

    {
        path: "/register/therapist",
        element: <RegisterTherapist/>
    },

    {
        path: "/login",
        element: <Login/>
    },
    
    {
        path: "/verify-otp",
        element: <OTPVerification/>
    },

    {
        path: "/client/dashboard",
        element: (
            <RoleProtectedRoute allowedRole="client">
                <ClientDashboard />
            </RoleProtectedRoute>
        )
    },

    {
        path: "/chats",
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        )
    },

    {
        path: "/therapist/dashboard",
        element: (
            <RoleProtectedRoute allowedRole="therapist">
                <TherapistDashboard />
            </RoleProtectedRoute>
        )
    },

    {
        path: "/payment",
        element: (
            <RoleProtectedRoute allowedRole="client">
                <PaymentForm />
            </RoleProtectedRoute>
        )
    },

    {
        path: "/talk-to-therapist",
        element: (
            <RoleProtectedRoute allowedRole="client">
                <TalkToTherapist />
            </RoleProtectedRoute>
        )
    }
]