import Layout from "../component/layout/Layout"
import Features from '../features/Features'
import Login from "../authentication/Login"
import Register from "../authentication/UserSignUp"
import Home from "../pages/dashboard/userDashboard"
import Chat from "../pages/chat"
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
        path: "/register",
        element: <Register/>
    },

    {
        path: "/login",
        element: <Login/>
    },
    
    {
        path: "/home",
        element: <Home/>
    },

    {
        path: "/chat",
        element: <Chat/>
    }

]