import {
  FaHome,
  FaUserFriends,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaCreditCard,
  FaCalendarAlt
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth, getUserData } from '../../utils/auth';
import { useState, useEffect } from 'react';

const SideBar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        mode: 'cors'
      });

      // Always clear auth and redirect, regardless of server response
      clearAuth();
      navigate('/login');
    } catch (err) {

      console.error('Logout failed:', err);
    }
  };

  const isTherapist = userData?.role === 'therapist';

  const UserSettings = async  ()=> {
    if(isTherapist){
      navigate('/therapist/settings')
    }else {
      navigate('/client/settings')
    }
  }

  const therapistMenuItems = [
    { icon: <FaHome />, label: 'Home', to: '/therapist/dashboard' },
    { icon: <FaCalendarAlt />, label: 'Manage Sessions', to: '/therapist/sessions' },
    { icon: <FaComments />, label: 'Chat', to: '/chats' },
    { icon: <FaUser />, label: 'Profile', to: '/therapist/profile' },
    { icon: <FaCreditCard />, label: 'Payments', to: '/payment' },
  ];

  const clientMenuItems = [
    { icon: <FaHome />, label: 'Home', to: '/client/dashboard' },
    { icon: <FaUserFriends />, label: 'Talk to a therapist', to: '/talk-to-therapist' },
    { icon: <FaComments />, label: 'Chat', to: '/chats' },
    { icon: <FaUser />, label: 'Profile', to: '/client/profile' },
    { icon: <FaCreditCard />, label: 'Payments', to: '/payment-history' },
  ];

  const menuItems = isTherapist ? therapistMenuItems : clientMenuItems;

  // Get initials for avatar
  const getInitials = () => {
    if (!userData) return '';
    const { firstName, lastName } = userData;
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  // Get full name
  const getFullName = () => {
    if (!userData) return '';
    const { firstName, lastName } = userData;
    return `${firstName || ''} ${lastName || ''}`.trim();
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#111827" }}>
      {/* Logo and Brand */}
      <div className="p-3 md:p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white">Anon Therapy</h1>
            <p className="text-xs text-gray-400">{isTherapist ? 'Therapist Portal' : 'Client Portal'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left no-underline ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`
            }
            end
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile and Settings */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{getInitials()}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{getFullName()}</p>
            <p className="text-xs text-gray-400">{isTherapist ? 'Licensed Therapist' : 'Client'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <button onClick={UserSettings} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <FaCog className="text-sm" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="text-sm" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
