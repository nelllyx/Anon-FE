import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock,
  FaTrash, 
  FaCheck,
  FaUser, 
  FaVideo, 
  FaMapMarkerAlt,
  FaSearch,
  FaBook,
  FaRedo
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import SetTimeModal from './SetTimeModal';

const SessionManagement = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSetTimeModal, setShowSetTimeModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Sessions', icon: <FaCalendarAlt /> },
    { id: 'completed', label: 'Completed Sessions', icon: <FaCheck /> },
    { id: 'rescheduled', label: 'Rescheduled Sessions', icon: <FaRedo /> }
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm, activeTab]);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/therapist/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      } else {
        throw new Error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions. Please try again.');
      // Mock data for development
      setSessions([
        {
          id: 1,
          sessionDate: '2024-12-20',
          clientName: 'Sarah Johnson',
          therapyType: 'video',
          preferredTime: '14:00',
          scheduledTime: null,
          status: 'upcoming',
          notes: ''
        },
        {
          id: 2,
          sessionDate: '2024-12-21',
          clientName: 'Michael Brown',
          therapyType: 'in-person',
          preferredTime: '10:30',
          scheduledTime: '10:30',
          status: 'upcoming',
          notes: 'Follow-up session for anxiety management'
        },
        {
          id: 3,
          sessionDate: '2024-12-19',
          clientName: 'Emily Davis',
          therapyType: 'video',
          preferredTime: '16:00',
          scheduledTime: '16:00',
          status: 'completed',
          notes: 'Great progress with coping strategies'
        },
        {
          id: 4,
          sessionDate: '2024-12-18',
          clientName: 'John Smith',
          therapyType: 'in-person',
          preferredTime: '11:00',
          scheduledTime: '14:00',
          status: 'rescheduled',
          notes: 'Rescheduled due to client emergency'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterSessions = () => {
    let filtered = sessions.filter(session => session.status === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSessions(filtered);
  };

  const handleSetTime = (session) => {
    setSelectedSession(session);
    setShowSetTimeModal(true);
  };

  const handleUpdateSession = async (sessionId, updates) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/therapist/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, ...updates } : s
        ));
        setShowSetTimeModal(false);
      } else {
        throw new Error('Failed to update session');
      }
    } catch (error) {
      console.error('Error updating session:', error);
      setError('Failed to update session. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/v1/therapist/sessions/${sessionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setSessions(prev => prev.filter(s => s.id !== sessionId));
        } else {
          throw new Error('Failed to delete session');
        }
      } catch (error) {
        console.error('Error deleting session:', error);
        setError('Failed to delete session. Please try again.');
      }
    }
  };

  const updateSessionStatus = async (sessionId, newStatus) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/therapist/sessions/${sessionId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, status: newStatus } : s
        ));
      } else {
        throw new Error('Failed to update session status');
      }
    } catch (error) {
      console.error('Error updating session status:', error);
      setError('Failed to update session status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not set';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    } catch {
      return timeString;
    }
  };

  const getTherapyTypeIcon = (type) => {
    return type === 'video' ? <FaVideo className="text-blue-500" /> : <FaMapMarkerAlt className="text-green-500" />;
  };

  const getTherapyTypeLabel = (type) => {
    return type === 'video' ? 'Video Call' : 'In-Person';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <FaCalendarAlt className="text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Session Management</h1>
                <p className="text-gray-600 mt-1">Manage your therapy sessions and appointments</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-gray-500">Today&#39;s Sessions</p>
                <p className="text-lg font-semibold text-blue-600">
                  {sessions.filter(s => 
                    s.status === 'upcoming' && 
                    new Date(s.sessionDate).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500">This Week</p>
                <p className="text-lg font-semibold text-blue-600">
                  {sessions.filter(s => s.status === 'upcoming').length}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setActiveTab('upcoming');
                setSelectedSession({
                  isNew: true,
                  sessionDate: new Date().toISOString().split('T')[0],
                  status: 'upcoming'
                });
                setShowSetTimeModal(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaCalendarAlt />
              New Session
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {sessions.filter(s => s.status === tab.id).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Therapy Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Time
                  </th>
                  {activeTab === 'upcoming' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Time
                    </th>
                  )}
                  {(activeTab === 'completed' || activeTab === 'rescheduled') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  )}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(session.sessionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FaUser className="text-blue-600 text-sm" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.clientName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {getTherapyTypeIcon(session.therapyType)}
                        {getTherapyTypeLabel(session.therapyType)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <FaClock className="text-gray-400" />
                        {formatTime(session.preferredTime)}
                      </div>
                    </td>
                    {activeTab === 'upcoming' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.scheduledTime ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {formatTime(session.scheduledTime)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Not scheduled
                          </span>
                        )}
                      </td>
                    )}
                    {(activeTab === 'completed' || activeTab === 'rescheduled') && (
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {session.notes || 'No notes'}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {activeTab === 'upcoming' && (
                          <>
                            <button
                              onClick={() => handleSetTime(session)}
                              className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <FaClock className="mr-1" />
                              Set Time
                            </button>
                            <button
                              onClick={() => updateSessionStatus(session.id, 'completed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as completed"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => updateSessionStatus(session.id, 'rescheduled')}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Reschedule"
                            >
                              <FaRedo />
                            </button>
                          </>
                        )}
                        
                        {(activeTab === 'completed' || activeTab === 'rescheduled') && (
                          <button
                            onClick={() => handleSetTime(session)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <FaBook />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete session"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'upcoming' && <FaCalendarAlt className="text-gray-400 text-2xl" />}
              {activeTab === 'completed' && <FaCheck className="text-gray-400 text-2xl" />}
              {activeTab === 'rescheduled' && <FaRedo className="text-gray-400 text-2xl" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} sessions found
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : `You don't have any ${activeTab} sessions at the moment.`}
            </p>
          </div>
        )}
      </div>

      {/* Set Time Modal */}
      {showSetTimeModal && (
        <SetTimeModal
          session={selectedSession}
          onClose={() => setShowSetTimeModal(false)}
          onSave={(updates) => handleUpdateSession(selectedSession.id, updates)}
        />
      )}
    </div>
  );
};

export default SessionManagement;