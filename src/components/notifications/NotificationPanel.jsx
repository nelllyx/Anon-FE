import { useState } from 'react';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaClock, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaInfoCircle,
  FaTrash
} from 'react-icons/fa';

const NotificationPanel = ({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onClearAll 
}) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread;
    return notification.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'session_time_set':
        return <FaClock className="text-blue-500" />;
      case 'session_rescheduled':
        return <FaCalendarAlt className="text-yellow-500" />;
      case 'session_completed':
        return <FaCheck className="text-green-500" />;
      case 'session_cancelled':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'session_update':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaBell className="text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'unread' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => setFilter('session_time_set')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'session_time_set' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Time Set
              </button>
              <button
                onClick={() => setFilter('session_rescheduled')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  filter === 'session_rescheduled' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Rescheduled
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                <FaCheck />
                Mark All Read
              </button>
              <button
                onClick={onClearAll}
                className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <FaTrash />
                Clear All
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaBell className="text-4xl mb-2" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </h4>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          {notification.data?.clientName && (
                            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                              {notification.data.clientName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
