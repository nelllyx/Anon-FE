import { useState, useEffect } from 'react';
import SideBar from '../../component/siderbar/SideBar';
import SessionCard from '../../component/sessionCard/SessionCard';
import { FaCalendarAlt, FaUserFriends, FaChartLine, FaBell, FaBars } from 'react-icons/fa';

const therapistSessions = [
  { 
    therapist: "Akewe Nelson", 
    date: "23-04-2025", 
    time: "6:00 pm", 
    status: "upcoming", 
    client: "Sarah Johnson",
    clientImage: "https://randomuser.me/api/portraits/women/1.jpg",
    duration: "45 mins",
    type: "Video Call",
    notes: "Anxiety management session"
  },
  { 
    therapist: "Akewe Nelson", 
    date: "25-04-2025", 
    time: "4:00 pm", 
    status: "upcoming", 
    client: "Michael Brown",
    clientImage: "https://randomuser.me/api/portraits/men/1.jpg",
    duration: "60 mins",
    type: "In-Person",
    notes: "Relationship counseling"
  }
];

const therapistStats = [
  { 
    title: "Today's Sessions", 
    value: "3", 
    icon: <FaCalendarAlt className="text-blue-500" />, 
    change: "+1", 
    color: "from-blue-50 to-blue-100",
    trend: "up"
  },
  { 
    title: "Active Clients", 
    value: "8", 
    icon: <FaUserFriends className="text-green-500" />, 
    change: "+3", 
    color: "from-green-50 to-green-100",
    trend: "up"
  },
  { 
    title: "Monthly Revenue", 
    value: "$2,400", 
    icon: <FaChartLine className="text-purple-500" />, 
    change: "+8%", 
    color: "from-purple-50 to-purple-100",
    trend: "up"
  }
];

const therapistMessages = [
  {
    id: 1,
    sender: "Sarah Johnson",
    message: "Hi Dr. Nelson, I wanted to discuss my progress from our last session.",
    time: "10:30 AM",
    unread: true,
    senderImage: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    sender: "Michael Brown",
    message: "Thank you for the resources you shared. They've been very helpful.",
    time: "Yesterday",
    unread: false,
    senderImage: "https://randomuser.me/api/portraits/men/1.jpg"
  }
];



// const therapistProfile = {
//   name: "Dr. Akewe Nelson",
//   specialization: "Clinical Psychology",
//   experience: "8 years",
//   rating: 4.9,
//   availability: "Mon-Fri, 9AM-5PM",
//   bio: "Specialized in anxiety disorders and relationship counseling. Committed to providing personalized care and evidence-based therapy.",
//   image: "https://randomuser.me/api/portraits/men/2.jpg"
// };

const TherapistDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    initials: '',
    fullName: ''
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      const firstName = userData.firstName || '';
      const lastName = userData.lastName || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const initials = firstName && lastName 
        ? `${firstName[0]}${lastName[0]}`
        : firstName 
          ? firstName[0] 
          : 'T';

      setUser({
        firstName,
        lastName,
        fullName,
        initials: initials.toUpperCase()
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden"
      >
        <FaBars className="text-gray-600" />
      </button>

      {/* Fixed Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <SideBar isTherapist={true} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content - Scrollable */}
      <div className="flex-1 ml-0 md:ml-64 h-screen overflow-y-auto">
        <div className="flex flex-col w-full p-3 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                Good Morning, Dr. {user.lastName}
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                Here&#39;s what&#39;s happening with your practice today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaBell className="text-base text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  {user.initials}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">Dr. {user.fullName}</p>
                  <p className="text-xs text-gray-500">Licensed Therapist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {therapistStats.map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
                <div className="mt-2 flex items-center text-xs">
                  <span className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Today&#39;s Sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {therapistSessions.map((session, index) => (
                <SessionCard 
                  key={index}
                  therapist={session.therapist}
                  date={session.date}
                  time={session.time}
                  status={session.status}
                  client={session.client}
                  clientImage={session.clientImage}
                  duration={session.duration}
                  type={session.type}
                  notes={session.notes}
                  isTherapist={true}
                />
              ))}
            </div>
          </div>

          {/* Messages Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
            <div className="space-y-4">
              {therapistMessages.map((message) => (
                <div key={message.id} className="bg-white p-4 rounded-xl shadow-sm">
                  <div className="flex items-start gap-3">
                    <img src={message.senderImage} alt={message.sender} className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{message.sender}</h3>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                    </div>
                    {message.unread && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
