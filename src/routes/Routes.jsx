import Layout from "../component/layout/Layout"
import Features from '../features/Features'
import Login from "../authentication/Login"
import Register from "../authentication/UserSignUp"
import RegisterTherapist from "../authentication/RegisterTherapist"
import ClientDashboard from "../pages/dashboard/ClientDashboard"
import Chat from "../pages/chat/index.jsx"
import TherapistDashboard from "../pages/dashboard/TherapistDashboard"
import OTPVerification from "../authentication/OTPVerification"
import PaymentForm from "../components/payment/PaymentForm"
import TalkToTherapist from "../components/therapist/TalkToTherapist"
import SubscriptionPlans from "../components/subscription/SubscriptionPlans"
import ProtectedRoute from '../components/ProtectedRoute'
import Unauthorized from '../pages/Unauthorized'
import PaymentHistory from "../components/payment/PaymentHistory"
import ClientProfile from "../components/profile/ClientProfile"
import ClientSettings from "../components/settings/ClientSettings.jsx"
import TherapistProfile from "../components/profile/TherapistProfile"
import TherapistSettings from "../components/settings/TherapistSettings"
import SessionManagement from "../components/therapist/SessionManagement"

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
            <ProtectedRoute requiredRole="client">
                <ClientDashboard />
            </ProtectedRoute>
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
            <ProtectedRoute requiredRole="therapist">
                <TherapistDashboard />
            </ProtectedRoute>
        )
    },

    {
        path: "/payment",
        element: (
            <ProtectedRoute requiredRole="client">
                <PaymentForm />
            </ProtectedRoute>
        )
    },

    {
        path: "/payment-history",
        element: (
            <ProtectedRoute requiredRole="client">
                <PaymentHistory />
            </ProtectedRoute>
        )
    },

    {
        path: "/subscribe",
        element: (
            <ProtectedRoute requiredRole="client">
                <SubscriptionPlans />
            </ProtectedRoute>
        )
    },

    {
        path: "/talk-to-therapist",
        element: (
            <ProtectedRoute requiredRole="client">
                <TalkToTherapist />
            </ProtectedRoute>
        )
    },

    {
        path: "/client/profile",
        element: (
            <ProtectedRoute requiredRole="client">
                <ClientProfile />
            </ProtectedRoute>
        )
    },

    {
        path: "/therapist/profile",
        element: (
            <ProtectedRoute requiredRole="therapist">
                <TherapistProfile />
            </ProtectedRoute>
        )
    },


    {
        path: "/client/settings",
        element: (
            <ProtectedRoute requiredRole="client">
                <ClientSettings />
            </ProtectedRoute>
        )
    },

    {
        path: "/therapist/settings",
        element: (
            <ProtectedRoute requiredRole="therapist">
                <TherapistSettings />
            </ProtectedRoute>
        )
    },

    {
        path: "/therapist/sessions",
        element: (
            <ProtectedRoute requiredRole="therapist">
                <SessionManagement />
            </ProtectedRoute>
        )
    },

    {
        path: '/unauthorized',
        element: <Unauthorized />
    }
]