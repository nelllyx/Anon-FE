import { FaHome, FaCalendarAlt, FaUserFriends, FaComments, FaFileMedical, FaChartLine, FaCog, FaSignOutAlt, FaUserMd, FaUser } from 'react-icons/fa';
import { useState } from 'react';

const SideBar = ({ isTherapist = true }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const therapistMenuItems = [
    { icon: <FaHome />, label: 'Dashboard', id: 'dashboard' },
    { icon: <FaCalendarAlt />, label: 'Appointments', id: 'appointments' },
    { icon: <FaUserFriends />, label: 'Clients', id: 'clients' },
    { icon: <FaComments />, label: 'Messages', id: 'messages' },
    { icon: <FaFileMedical />, label: 'Session Notes', id: 'notes' },
    { icon: <FaChartLine />, label: 'Analytics', id: 'analytics' },
  ];

  const clientMenuItems = [
    { icon: <FaHome />, label: 'Dashboard', id: 'dashboard' },
    { icon: <FaCalendarAlt />, label: 'My Sessions', id: 'sessions' },
    { icon: <FaUserMd />, label: 'My Therapist', id: 'therapist' },
    { icon: <FaComments />, label: 'Messages', id: 'messages' },
    { icon: <FaFileMedical />, label: 'My Progress', id: 'progress' },
    { icon: <FaUser />, label: 'Profile', id: 'profile' },
  ];

  const menuItems = isTherapist ? therapistMenuItems : clientMenuItems;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo and Brand */}
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Anon Therapy</h1>
            <p className="text-xs text-gray-500">{isTherapist ? 'Therapist Portal' : 'Client Portal'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeItem === item.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile and Settings */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">{isTherapist ? 'AN' : 'SJ'}</span>
          </div>
          <div>
            <p className="font-medium text-gray-800">{isTherapist ? 'Dr. Nelson' : 'Sarah Johnson'}</p>
            <p className="text-xs text-gray-500">{isTherapist ? 'Licensed Therapist' : 'Client'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <FaCog className="text-lg" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
