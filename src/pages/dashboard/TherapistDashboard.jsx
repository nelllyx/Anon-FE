import { useState, useEffect } from 'react';
import SideBar from '../../component/siderbar/SideBar';
import {
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaBars,
  FaUserPlus,
  FaClipboardList,
  FaLightbulb,
  FaUsers,
  FaGraduationCap,
  FaStar,
  FaVideo,
  FaMapMarkerAlt,
  FaArrowRight,
  FaUserFriends
} from 'react-icons/fa';
import { getUserData } from '../../utils/auth';
import { useWebSocket } from '../../contexts/WebSocketContext';
import NotificationPanel from '../../components/notifications/NotificationPanel';
import NotificationToast from '../../components/notifications/NotificationToast';
import { useAuthenticatedFetch } from '../../utils/api';

const defaultContent = {
  welcomeMessage: "Welcome to your therapy practice!",
  nextSteps: [
    {
      title: "Complete Your Profile",
      description: "Help clients find you by completing your professional profile and credentials.",
      icon: <FaClipboardList className="text-blue-500" />,
      action: "Update Profile",
      link: "/therapist/profile"
    },
    {
      title: "Set Your Availability",
      description: "Configure your schedule and availability to start accepting clients.",
      icon: <FaCalendarAlt className="text-green-500" />,
      action: "Set Schedule",
      link: "/therapist/schedule"
    },
    {
      title: "Browse Resources",
      description: "Access professional development resources and therapeutic tools.",
      icon: <FaLightbulb className="text-purple-500" />,
      action: "View Resources",
      link: "/resources"
    }
  ],
  tips: [
    "Maintain clear communication with your clients",
    "Keep detailed session notes for better continuity",
    "Stay updated with the latest therapeutic techniques",
    "Practice self-care to provide the best care for others"
  ]
};

const TherapistDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    initials: '',
    fullName: ''
  });
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    todaySessions: 1,
    upcomingSessions: 0,
    activeClients: 0,
    monthlyRevenue: 0
  });
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState('');
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [toastNotifications, setToastNotifications] = useState([]);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useWebSocket();
  const authenticatedFetch = useAuthenticatedFetch();

  useEffect(() => {
    const userData = getUserData();
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {

      // Fetch therapist sessions from API
      const sessionsResponse = await authenticatedFetch('http://localhost:3000/api/v1/therapist/sessions/week', {
        method: 'GET'
      });

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.data?.upcoming || []);

        // Calculate stats from sessions
        const upcomingSessions = sessionsData.data?.upcoming?.filter(s => s.status === 'upcoming') || [];
        const todaySessions = sessionsData.data?.today?.filter(s => s.status === 'upcoming') || [];
          const completedSessions = sessionsData.data?.completed?.filter(s => s.status === 'completed') || [];
        
        // Calculate unique active clients from sessions
        const uniqueClients = new Set();
        sessionsData.data?.upcoming?.forEach(session => {
          if (session.userId || session.clientId) {
            const clientId = session.userId?._id || session.clientId?._id || session.userId || session.clientId;
            uniqueClients.add(clientId);
          }
        });
        const activeClientsCount = uniqueClients.size;



        setStats({
          totalSessions: sessionsData.data?.Sessions?.length || 0,
          completedSessions: completedSessions.length,
          upcomingSessions: upcomingSessions.length,
          todaySessions: todaySessions.length,
          activeClients: sessionsData.data?.activeClients || activeClientsCount,
          monthlyRevenue: sessionsData.data?.monthlyRevenue || 0
        });

        // Check if profile is complete (you can customize this logic based on your requirements)
        const userData = getUserData();
        const isProfileComplete = !!(userData &&
          userData.firstName &&
          userData.lastName);


        console.log('Profile complete:', isProfileComplete);
        console.log('User data:', userData);
        setProfileComplete(isProfileComplete);
      }

      // // Fetch messages from API
      // const messagesResponse = await fetch('http://localhost:3000/api/v1/therapist/messages', {
      //   credentials: 'include',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      // });
      //
      // if (messagesResponse.ok) {
      //   const messagesData = await messagesResponse.json();
      //   setMessages(messagesData.messages || []);
      // }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Handle WebSocket notifications and convert to toast notifications
  // Only show toast for live (WebSocket) notifications, not for missed/history
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];

      if (latestNotification.unread && latestNotification.isLive) {
        setToastNotifications(prev => {
          const exists = prev.some(toast => toast.id === latestNotification.id);
          if (!exists) {
            return [latestNotification, ...prev.slice(0, 4)];
          }
          return prev;
        });
      }
    }
  }, [notifications]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Generate dynamic stats based on real data
  const generateStats = () => {
    if (sessions.length === 0) {
      return [
        {
          title: "Get Started",
          value: "0",
          icon: <FaUserPlus className="text-blue-500" />,
          change: "Complete profile",
          color: "from-blue-50 to-blue-100",
          trend: "up"
        },
        {
          title: "Profile Complete",
          value: "0%",
          icon: <FaClipboardList className="text-green-500" />,
          change: "Update profile",
          color: "from-green-50 to-green-100",
          trend: "up"
        },
        {
          title: "Resources",
          value: "10+",
          icon: <FaGraduationCap className="text-purple-500" />,
          change: "Available",
          color: "from-purple-50 to-purple-100",
          trend: "up"
        }
      ];
    }

    return [
      {
        title: "Today's Sessions",
        value: stats.todaySessions.toString(),
        icon: <FaCalendarAlt className="text-blue-500" />,
        change: `${stats.totalSessions} total`,
        color: "from-blue-50 to-blue-100",
        trend: "up"
      },
      {
        title: "Active Clients",
        value: stats.activeClients.toString(),
        icon: <FaUsers className="text-green-500" />,
        change: `${stats.completedSessions} completed`,
        color: "from-green-50 to-green-100",
        trend: "up"
      },
      {
        title: "Monthly Revenue",
        value: `$${stats.monthlyRevenue.toLocaleString()}`,
        icon: <FaChartLine className="text-purple-500" />,
        change: "+12%",
        color: "from-purple-50 to-purple-100",
        trend: "up"
      }
    ];
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
                <FaBell 
                  onClick={() => setShowNotificationPanel(true)}
                  className="text-base text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" 
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {generateStats().map((stat, index) => (
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
            </>
          )}

          {/* Quick Actions & Today's Overview */}
          {!isLoading && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">
                {sessions.length > 0 && stats.activeClients > 0 ? 'Today\'s Overview' : 
                 sessions.length > 0 && stats.activeClients === 0 ? 'Build Your Practice' : 
                 'Get Started'}
              </h2>

              {sessions.length > 0 && stats.activeClients > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Sessions Summary */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Today&#39;s Sessions</h3>
                      <button 
                        onClick={() => window.location.href = '/therapist/sessions'}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        View All <FaArrowRight className="text-xs" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {sessions.slice(0, 3).map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {session.clientId?.firstName?.charAt(0)?.toUpperCase() || 'C'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">
                                {session.clientId?.firstName} {session.clientId?.lastName}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{session.startTime}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  {session.therapyType === 'video' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-green-500" />}
                                  {session.therapyType === 'video' ? 'Video' : 'In-Person'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              session.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {session.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {sessions.length > 3 && (
                        <div className="text-center pt-2">
                          <button 
                            onClick={() => window.location.href = '/therapist/sessions'}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            +{sessions.length - 3} more sessions
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => window.location.href = '/therapist/sessions'}
                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaCalendarAlt className="text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">Manage Sessions</span>
                        </div>
                        <FaArrowRight className="text-gray-400" />
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/chats'}
                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaUserFriends className="text-green-600" />
                          </div>
                          <span className="font-medium text-gray-800">Client Messages</span>
                        </div>
                        <FaArrowRight className="text-gray-400" />
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/therapist/profile'}
                        className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaClipboardList className="text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-800">Update Profile</span>
                        </div>
                        <FaArrowRight className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : sessions.length > 0 && stats.activeClients === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUsers className="text-yellow-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Build Your Client Base
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      You have sessions scheduled but no active clients yet. Focus on building relationships and growing your practice.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="text-2xl mb-2"><FaUsers className="text-blue-500" /></div>
                        <h4 className="font-medium text-gray-800 mb-1">Connect with Clients</h4>
                        <p className="text-sm text-gray-600 mb-3">Build strong therapeutic relationships with your clients</p>
                        <button
                          onClick={() => window.location.href = '/therapist/sessions'}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                        >
                          View Sessions →
                        </button>
                      </div>
                      <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                        <div className="text-2xl mb-2"><FaStar className="text-green-500" /></div>
                        <h4 className="font-medium text-gray-800 mb-1">Improve Your Profile</h4>
                        <p className="text-sm text-gray-600 mb-3">Enhance your profile to attract more clients</p>
                        <button
                          onClick={() => window.location.href = '/therapist/profile'}
                          className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                        >
                          Update Profile →
                        </button>
                      </div>
                      <div className="text-center p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                        <div className="text-2xl mb-2"><FaGraduationCap className="text-purple-500" /></div>
                        <h4 className="font-medium text-gray-800 mb-1">Professional Development</h4>
                        <p className="text-sm text-gray-600 mb-3">Continue learning and growing as a therapist</p>
                        <button
                          onClick={() => window.location.href = '/resources'}
                          className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                        >
                          View Resources →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUserPlus className="text-blue-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Ready to Start Your Practice?
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Set up your profile and availability to start connecting with clients and building your practice.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {defaultContent.nextSteps.map((step, index) => (
                        <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                          <div className="text-2xl mb-2">{step.icon}</div>
                          <h4 className="font-medium text-gray-800 mb-1">{step.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                          <button
                            onClick={() => window.location.href = step.link}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                          >
                            {step.action} →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Professional Tips Section */}
          {!isLoading && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Professional Tips</h2>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {defaultContent.tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaStar className="text-green-600 text-sm" />
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toastNotifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={(id) => setToastNotifications(prev => prev.filter(n => n.id !== id))}
          onMarkAsRead={(id) => {
            setToastNotifications(prev => 
              prev.map(n => n.id === id ? { ...n, unread: false } : n)
            );
            markAsRead(id);
          }}
        />
      ))}

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotificationPanel}
        onClose={() => setShowNotificationPanel(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onClearAll={clearNotifications}
        mode="popover"
      />
    </div>
  );
};

export default TherapistDashboard;
