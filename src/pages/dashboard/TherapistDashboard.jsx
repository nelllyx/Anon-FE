// import React from 'react'
import SideBar from '../../component/siderbar/SideBar';
import SessionCard from '../../component/sessionCard/SessionCard';
import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserFriends, FaChartLine, FaBell, FaVideo, FaPlus, FaSearch, FaBars, FaUser, FaHeart, FaBook } from 'react-icons/fa';

//  data for both roles
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

const clientSessions = [
  { 
    therapist: "Dr. Jane Smith", 
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
    therapist: "Dr. Michael Brown", 
    date: "25-04-2025", 
    time: "4:00 pm", 
    status: "upcoming", 
    client: "Sarah Johnson",
    clientImage: "https://randomuser.me/api/portraits/women/1.jpg",
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

const clientStats = [
  { 
    title: "Next Session", 
    value: "Tomorrow", 
    icon: <FaCalendarAlt className="text-blue-500" />, 
    change: "6:00 PM", 
    color: "from-blue-50 to-blue-100",
    trend: "up"
  },
  { 
    title: "Progress", 
    value: "85%", 
    icon: <FaHeart className="text-green-500" />, 
    change: "+5%", 
    color: "from-green-50 to-green-100",
    trend: "up"
  },
  { 
    title: "Resources", 
    value: "12", 
    icon: <FaBook className="text-purple-500" />, 
    change: "New", 
    color: "from-purple-50 to-purple-100",
    trend: "up"
  }
];

// Add new data for messages and therapist profiles
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

const clientMessages = [
  {
    id: 1,
    sender: "Dr. Nelson",
    message: "I've reviewed your progress notes. You're making great improvements!",
    time: "9:15 AM",
    unread: true,
    senderImage: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 2,
    sender: "Dr. Nelson",
    message: "Don't forget to complete the exercises we discussed.",
    time: "Yesterday",
    unread: false,
    senderImage: "https://randomuser.me/api/portraits/men/2.jpg"
  }
];

const therapistProfile = {
  name: "Dr. Akewe Nelson",
  specialization: "Clinical Psychology",
  experience: "8 years",
  rating: 4.9,
  availability: "Mon-Fri, 9AM-5PM",
  bio: "Specialized in anxiety disorders and relationship counseling. Committed to providing personalized care and evidence-based therapy.",
  image: "https://randomuser.me/api/portraits/men/2.jpg"
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTherapist, setIsTherapist] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  const toggleRole = () => {
    setIsTherapist(!isTherapist);
  };

  const currentSessions = isTherapist ? therapistSessions : clientSessions;
  const currentStats = isTherapist ? therapistStats : clientStats;
  const currentMessages = isTherapist ? therapistMessages : clientMessages;

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
        <SideBar isTherapist={isTherapist} />
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
        <div className="flex flex-col w-full p-4 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {isTherapist ? 'Good Morning, Dr. Nelson' : 'Welcome Back, Sarah'}
              </h1>
              <p className="text-gray-500 text-sm md:text-base">
                {isTherapist ? 'Here\'s what\'s happening with your practice today' : 'Here\'s your therapy journey today'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleRole}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
              >
                {isTherapist ? 'Switch to Client View' : 'Switch to Therapist View'}
              </button>
              <div className="relative">
                <FaBell className="text-xl text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </div>
              <div className="flex items-center gap-3 bg-white p-2 md:p-3 rounded-xl shadow-sm">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
                  {isTherapist ? 'AN' : 'SJ'}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-gray-800">{isTherapist ? 'Dr. Nelson' : 'Sarah Johnson'}</p>
                  <p className="text-xs text-gray-500">{isTherapist ? 'Licensed Therapist' : 'Client'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Messages</h2>
              <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 p-3 rounded-lg ${msg.unread ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={msg.senderImage} alt={msg.sender} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">{msg.sender}</h3>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Therapist Profile Section (Client View) */}
          {!isTherapist && (
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img src={therapistProfile.image} alt={therapistProfile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">{therapistProfile.name}</h2>
                  <p className="text-sm text-gray-500">{therapistProfile.specialization}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium text-gray-800">{therapistProfile.experience}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-medium text-gray-800">{therapistProfile.rating}/5.0</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium text-gray-800">{therapistProfile.availability}</p>
              </div>
              <p className="text-sm text-gray-600">{therapistProfile.bio}</p>
            </div>
          )}

          {/* Search and Quick Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={isTherapist ? "Search clients, sessions..." : "Search resources, notes..."}
                className="w-full pl-10 pr-4 py-2 md:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              {isTherapist ? (
                <>
                  <button className="flex items-center gap-2 bg-blue-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm md:text-base">
                    <FaVideo className="text-lg md:text-xl" />
                    <span className="font-medium">New Session</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm md:text-base">
                    <FaPlus className="text-lg md:text-xl" />
                    <span className="font-medium">Add Client</span>
                  </button>
                </>
              ) : (
                <>
                  <button className="flex items-center gap-2 bg-blue-500 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm md:text-base">
                    <FaVideo className="text-lg md:text-xl" />
                    <span className="font-medium">Join Session</span>
                  </button>
                  <button className="flex items-center gap-2 bg-white text-gray-700 px-3 md:px-4 py-2 md:py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm md:text-base">
                    <FaBook className="text-lg md:text-xl" />
                    <span className="font-medium">Resources</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {currentStats.map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 md:p-6 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div className="p-2 md:p-3 bg-white rounded-lg shadow-sm">
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-gray-500 text-xs md:text-sm mt-3 md:mt-4">{stat.title}</h3>
                <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Sessions Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  {isTherapist ? 'Your Sessions' : 'Your Therapy Sessions'}
                </h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  {isTherapist ? 'Manage your upcoming and completed sessions' : 'View and manage your therapy sessions'}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setActiveTab('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {currentSessions.map((session, index) => (
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
                  isTherapist={isTherapist}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
