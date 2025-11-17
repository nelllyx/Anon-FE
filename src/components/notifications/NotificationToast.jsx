
import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaBell
} from 'react-icons/fa';

const NotificationToast = ({ notification, onClose, onMarkAsRead }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Show notification with a slight delay for smooth animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300);
  };

  const handleClick = () => {
    if (notification.unread) {
      onMarkAsRead(notification.id);
    }
    handleClose();
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'session_time_set':
        return <FaClock className="text-blue-500" />;
      case 'session_rescheduled':
        return <FaCalendarAlt className="text-yellow-500" />;
      case 'session_completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'session_cancelled':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'session_update':
        return <FaInfoCircle className="text-blue-500" />;
      case 'therapist_assigned':
        return <FaInfoCircle className="text-indigo-500" />;
      case 'client_payment':
        return <FaCheckCircle className="text-green-600" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'session_time_set':
        return 'border-l-blue-500 bg-blue-50';
      case 'session_rescheduled':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'session_completed':
        return 'border-l-green-500 bg-green-50';
      case 'session_cancelled':
        return 'border-l-red-500 bg-red-50';
      case 'session_update':
        return 'border-l-blue-500 bg-blue-50';
      case 'therapist_assigned':
        return 'border-l-indigo-500 bg-indigo-50';
      case 'client_payment':
        return 'border-l-green-600 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
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

  return (
      <div
          className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
              isVisible && !isLeaving
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-full opacity-0'
          }`}
      >
        <div
            className={`relative p-4 rounded-lg shadow-lg border-l-4 ${getNotificationColor()} ${
                notification.unread ? 'ring-2 ring-blue-200' : ''
            }`}
        >
          <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-sm" />
          </button>

          <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={handleClick}
          >
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {notification.title}
                </h4>
                {notification.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
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
      </div>
  );
};

export default NotificationToast;
