import { FaHome, FaCalendarAlt, FaUserFriends, FaComments, FaFileMedical, FaChartLine, FaCog, FaSignOutAlt, FaUserMd, FaUser, FaBlog, FaCreditCard } from 'react-icons/fa';
import { useState } from 'react';

const SideBar = ({ isTherapist = true }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const therapistMenuItems = [
    { icon: <FaHome />, label: 'Home', id: 'dashboard' },
    { icon: <FaUserFriends />, label: 'Talk to a therapist', id: 'clients' },
    { icon: <FaComments />, label: 'Chat', id: 'messages' },
    { icon: <FaBlog />, label: 'Blog', id: 'blog' },
    { icon: <FaUser />, label: 'Profile', id: 'profile' },
    { icon: <FaCreditCard />, label: 'Payments', id: 'payments' },
  ];

  const clientMenuItems = [
    { icon: <FaHome />, label: 'Home', id: 'dashboard' },
    { icon: <FaUserFriends />, label: 'Talk to a therapist', id: 'clients' },
    { icon: <FaComments />, label: 'Chat', id: 'messages' },
    { icon: <FaBlog />, label: 'Blog', id: 'blog' },
    { icon: <FaUser />, label: 'Profile', id: 'profile' },
    { icon: <FaCreditCard />, label: 'Payments', id: 'payments' },
  ];

  const menuItems = isTherapist ? therapistMenuItems : clientMenuItems;

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
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeItem === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile and Settings */}
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{isTherapist ? 'AN' : 'SJ'}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{isTherapist ? 'Dr. Nelson' : 'Sarah Johnson'}</p>
            <p className="text-xs text-gray-400">{isTherapist ? 'Licensed Therapist' : 'Client'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
            <FaCog className="text-sm" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900 hover:text-white transition-colors">
            <FaSignOutAlt className="text-sm" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
