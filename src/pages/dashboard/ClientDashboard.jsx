import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import SideBar from '../../component/siderbar/SideBar';
import SessionCard from '../../component/sessionCard/SessionCard';
import { FaCalendarAlt, FaHeart, FaBook, FaBell, FaBars, FaUserPlus, FaClipboardList, FaLightbulb, FaClock, FaCheckCircle } from 'react-icons/fa';
import { getUserData } from '../../utils/auth';

// Default content for when no sessions are available
const defaultContent = {
  welcomeMessage: "Welcome to your therapy journey!",
  nextSteps: [
    {
      title: "Find a Therapist",
      description: "Browse our network of licensed therapists and find the perfect match for your needs.",
      icon: <FaUserPlus className="text-blue-500" />,
      action: "Browse Therapists",
      link: "/talk-to-therapist"
    },
    {
      title: "Complete Your Profile",
      description: "Help us understand your needs better by completing your profile information.",
      icon: <FaClipboardList className="text-green-500" />,
      action: "Update Profile",
      link: "/client/profile"
    },
    {
      title: "Explore Resources",
      description: "Access helpful articles, exercises, and tools to support your mental health journey.",
      icon: <FaLightbulb className="text-purple-500" />,
      action: "View Resources",
      link: "/resources"
    }
  ],
  tips: [
    "Take your time to find the right therapist for you",
    "Be honest about your goals and expectations",
    "Remember that therapy is a journey, not a destination",
    "Don't hesitate to ask questions during your sessions"
  ]
};

const ClientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({
    name: '',
    initials: '',
    image: ''
  });
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    nextSession: null
  });
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user data from localStorage
    const userData = getUserData();
    if (userData) {
      const userName = userData.username || userData.firstName || 'User';
      const nameParts = userName.split(' ');
      const initials = nameParts.length > 1
          ? `${nameParts[0][0]}${nameParts[1][0]}`
          : userName[0];

      setUser({
        name: userName,
        initials: initials.toUpperCase(),
        image: userData.profileImage || ''
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
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch sessions from Redis
      const sessionsResponse = await fetch('http://localhost:3000/api/v1/client/sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,

        }
      });

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.data.Sessions || []);


        // Calculate stats from sessions
        const upcomingSessions = sessionsData.data.Sessions?.filter(s => s.status === 'upcoming') || [];
        const completedSessions = sessionsData.data.Sessions?.filter(s => s.status === 'completed') || [];


        setStats({
          totalSessions: sessionsData.data.Sessions?.length || 0,
          completedSessions: completedSessions.length,
          upcomingSessions: upcomingSessions.length,
          nextSession: upcomingSessions[0] || null
        });
      }

      // Fetch messages from Redis
      // const messagesResponse = await fetch('http://localhost:3000/api/v1/client/messages', {
      //   headers: {
      //     //'Authorization': Bearer ${token},
      //     'Content-Type': 'application/json'
      //   }
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
          change: "Find a therapist",
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
          value: "5+",
          icon: <FaBook className="text-purple-500" />,
          change: "Available",
          color: "from-purple-50 to-purple-100",
          trend: "up"
        }
      ];
    }

    return [
      {
        title: "Next Session",
        value: stats.nextSession ? formatDate(stats.nextSession.date) : "None",
        icon: <FaCalendarAlt className="text-blue-500" />,
        change: stats.nextSession ? formatTime(stats.nextSession.time) : "No upcoming",
        color: "from-blue-50 to-blue-100",
        trend: "up"
      },
      {
        title: "Progress",
        value: `${Math.round((stats.completedSessions / Math.max(stats.totalSessions, 1)) * 100)}%`,
      icon: <FaHeart className="text-green-500" />,
        change: `${stats.completedSessions} completed`,
        color: "from-green-50 to-green-100",
        trend: "up"
  },
    {
      title: "Upcoming",
          value: stats.upcomingSessions.toString(),
        icon: <FaClock className="text-purple-500" />,
        change: "Sessions",
        color: "from-purple-50 to-purple-100",
        trend: "up"
    }
  ];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (timeString) => {
    return timeString || "TBD";
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
          <SideBar isTherapist={false} />
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
                  Welcome Back, {user.name}
                </h1>
                <p className="text-xs md:text-sm text-gray-500">
                  Here&#39;s your therapy journey today
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaBell className="text-base text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">3</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
                  {user.image ? (
                      <img
                          src={user.image}
                          alt={user.name}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
                      />
                  ) : (
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        {user.initials}
                      </div>
                  )}
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">Client</p>
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

            {/* Sessions Section */}
            {!isLoading && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">
                    {sessions.length > 0 ? 'Upcoming Sessions' : 'Get Started'}
                  </h2>

                  {sessions.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sessions.map((session, index) => (
                            <SessionCard
                                key={index}
                                therapist={`${session.therapistId.firstName} ${session.therapistId.lastName}`}
                                date={format(parseISO(session.date), 'do MMMM, yyyy')}
                                time={session.startTime}
                                status={session.status}
                                therapistImage={session.clientImage}
                                duration={session.duration}
                                type={session.therapyType}
                                notes={session.notes}
                                isTherapist={false}
                            />
                        ))}
                      </div>
                  ) : (
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaUserPlus className="text-blue-600 text-2xl" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Ready to Start Your Therapy Journey?
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Connect with licensed therapists who can help you on your path to better mental health and well-being.
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

            {/* Messages Section */}
            {!isLoading && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    {messages.length > 0 ? 'Recent Messages' : 'Tips for Your Journey'}
                  </h2>

                  {messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => (
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
                  ) : (
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {defaultContent.tips.map((tip, index) => (
                              <div key={index} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <FaCheckCircle className="text-green-600 text-sm" />
                                </div>
                                <p className="text-sm text-gray-700">{tip}</p>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default ClientDashboard;























// import { useState, useEffect } from 'react';
// import SideBar from '../../component/siderbar/SideBar';
// import SessionCard from '../../component/sessionCard/SessionCard';
// import { FaCalendarAlt, FaHeart, FaBook, FaBell, FaBars } from 'react-icons/fa';
//
// const clientSessions = [
//   {
//     therapist: "Dr. Kimberly",
//     date: "23-04-2025",
//     time: "6:00 pm",
//     status: "upcoming",
//     client: "Sarah Johnson",
//     clientImage: "https://randomuser.me/api/portraits/women/1.jpg",
//     duration: "45 mins",
//     type: "Video Call",
//     notes: "Anxiety management session"
//   },
//   {
//     therapist: "Dr. Michael Brown",
//     date: "25-04-2025",
//     time: "4:00 pm",
//     status: "upcoming",
//     client: "Sarah Johnson",
//     clientImage: "https://randomuser.me/api/portraits/women/1.jpg",
//     duration: "60 mins",
//     type: "In-Person",
//     notes: "Relationship counseling"
//   }
// ];
//
// const clientStats = [
//   {
//     title: "Next Session",
//     value: "Tomorrow",
//     icon: <FaCalendarAlt className="text-blue-500" />,
//     change: "6:00 PM",
//     color: "from-blue-50 to-blue-100",
//     trend: "up"
//   },
//   {
//     title: "Progress",
//     value: "85%",
//     icon: <FaHeart className="text-green-500" />,
//     change: "+5%",
//     color: "from-green-50 to-green-100",
//     trend: "up"
//   },
//   {
//     title: "Resources",
//     value: "12",
//     icon: <FaBook className="text-purple-500" />,
//     change: "New",
//     color: "from-purple-50 to-purple-100",
//     trend: "up"
//   }
// ];
//
// const clientMessages = [
//   {
//     id: 1,
//     sender: "Dr. Nelson",
//     message: "I've reviewed your progress notes. You're making great improvements!",
//     time: "9:15 AM",
//     unread: true,
//     senderImage: "https://randomuser.me/api/portraits/men/2.jpg"
//   },
//   {
//     id: 2,
//     sender: "Dr. Nelson",
//     message: "Don't forget to complete the exercises we discussed.",
//     time: "Yesterday",
//     unread: false,
//     senderImage: "https://randomuser.me/api/portraits/men/2.jpg"
//   }
// ];
//
// const ClientDashboard = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [user, setUser] = useState({
//     name: '',
//     initials: '',
//     image: ''
//   });
//
//   useEffect(() => {
//     // Get user data from localStorage
//     const userData = JSON.parse(localStorage.getItem('userData'));
//     if (userData) {
//       const userName = userData.username || 'User';
//       const nameParts = userName.split(' ');
//       const initials = nameParts.length > 1
//         ? `${nameParts[0][0]}${nameParts[1][0]}`
//         : userName[0];
//
//       setUser({
//         name: userName,
//         initials: initials.toUpperCase(),
//       });
//     }
//   }, []);
//
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth < 768) {
//         setIsSidebarOpen(false);
//       } else {
//         setIsSidebarOpen(true);
//       }
//     };
//
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
//
//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };
//
//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* Mobile Sidebar Toggle */}
//       <button
//         onClick={toggleSidebar}
//         className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md md:hidden"
//       >
//         <FaBars className="text-gray-600" />
//       </button>
//
//       {/* Fixed Sidebar */}
//       <div className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-md z-40 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
//         <SideBar isTherapist={false} />
//       </div>
//
//       {/* Overlay for mobile */}
//       {isSidebarOpen && isMobile && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={toggleSidebar}
//         />
//       )}
//
//       {/* Main Content - Scrollable */}
//       <div className="flex-1 ml-0 md:ml-64 h-screen overflow-y-auto">
//         <div className="flex flex-col w-full p-3 md:p-6">
//           {/* Header Section */}
//           <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-3">
//             <div>
//               <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
//                 Welcome Back, {user.name}
//               </h1>
//               <p className="text-xs md:text-sm text-gray-500">
//                 Here&#39;s your therapy journey today
//               </p>
//             </div>
//
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <FaBell className="text-base text-gray-500 cursor-pointer hover:text-blue-500 transition-colors" />
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">3</span>
//               </div>
//               <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
//                 {user.image ? (
//                   <img
//                     src={user.image}
//                     alt={user.name}
//                     className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
//                     {user.initials}
//                   </div>
//                 )}
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium text-gray-800">{user.name}</p>
//                   <p className="text-xs text-gray-500">Client</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//
//           {/* Stats Section */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             {clientStats.map((stat, index) => (
//               <div key={index} className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-sm`}>
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-600">{stat.title}</p>
//                     <p className="text-xl font-semibold mt-1">{stat.value}</p>
//                   </div>
//                   <div className="text-2xl">{stat.icon}</div>
//                 </div>
//                 <div className="mt-2 flex items-center text-xs">
//                   <span className={`${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
//                     {stat.change}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//
//           {/* Sessions Section */}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {clientSessions.map((session, index) => (
//                 <SessionCard
//                   key={index}
//                   therapist={session.therapist}
//                   date={session.date}
//                   time={session.time}
//                   status={session.status}
//                   client={session.client}
//                   clientImage={session.clientImage}
//                   duration={session.duration}
//                   type={session.type}
//                   notes={session.notes}
//                   isTherapist={false}
//                 />
//               ))}
//             </div>
//           </div>
//
//           {/* Messages Section */}
//           <div>
//             <h2 className="text-lg font-semibold mb-4">Recent Messages</h2>
//             <div className="space-y-4">
//               {clientMessages.map((message) => (
//                 <div key={message.id} className="bg-white p-4 rounded-xl shadow-sm">
//                   <div className="flex items-start gap-3">
//                     <img src={message.senderImage} alt={message.sender} className="w-10 h-10 rounded-full" />
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <h3 className="font-medium">{message.sender}</h3>
//                         <span className="text-xs text-gray-500">{message.time}</span>
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">{message.message}</p>
//                     </div>
//                     {message.unread && (
//                       <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default ClientDashboard;