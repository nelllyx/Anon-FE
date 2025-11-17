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
                             onClearAll,
                             mode = 'drawer'
                           }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return notification.unread || !notification.isRead;
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
      case 'therapist_assigned':
        return <FaInfoCircle className="text-indigo-500" />;
      case 'client_payment':
        return <FaCheck className="text-green-600" />;
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

  if (mode === 'drawer') {
    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
              className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
              onClick={onClose}
          />

          <div className="absolute right-0 top-0 h-full w-96 bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FaBell className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Notifications
                    </h2>
                    {unreadCount > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {unreadCount} unread
                        </p>
                    )}
                  </div>
                  {unreadCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full px-2.5 py-1 shadow-lg shadow-red-500/30">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                  )}
                </div>
                <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
                <div className="flex gap-2 flex-wrap">
                  <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'all'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All
                  </button>
                  <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'unread'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Unread
                  </button>
                  <button
                      onClick={() => setFilter('session_time_set')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'session_time_set'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Time Set
                  </button>
                  <button
                      onClick={() => setFilter('session_rescheduled')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'session_rescheduled'
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Rescheduled
                  </button>
                  <button
                      onClick={() => setFilter('therapist_assigned')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'therapist_assigned'
                              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Therapist
                  </button>
                  <button
                      onClick={() => setFilter('client_payment')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                          filter === 'client_payment'
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Payment
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <button
                      onClick={onMarkAllAsRead}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                  >
                    <FaCheck />
                    Mark All Read
                  </button>
                  <button
                      onClick={onClearAll}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                  >
                    <FaTrash />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-2">
                {filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                        <FaBell className="text-2xl text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">No notifications</p>
                      <p className="text-xs text-gray-400 mt-1">You&#39;re all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                      {filteredNotifications.map((notification) => (
                          <div
                              key={notification.id}
                              className={`group p-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                  (notification.unread || !notification.isRead)
                                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm' 
                                      : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
                              }`}
                              onClick={() => {
                                if (notification.unread || !notification.isRead) {
                                  onMarkAsRead(notification.id);
                                }
                              }}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center ${
                                  (notification.unread || !notification.isRead) ? 'bg-white shadow-sm' : 'bg-gray-100'
                              }`}>
                                <div className="text-base">
                                  {getNotificationIcon(notification.type)}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className={`text-sm font-semibold mb-1 ${
                                        (notification.unread || !notification.isRead) ? 'text-gray-900' : 'text-gray-800'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                      {notification.message}
                                    </p>
                                  </div>
                                  {(notification.unread || !notification.isRead) && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse"></div>
                                  )}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <FaClock className="text-xs" />
                                    {formatTime(notification.timestamp)}
                                  </span>

                                  {notification.data?.clientName && (
                                      <span className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
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
  }

  return (
      <div className="fixed inset-0 z-[100]">
        {/* Backdrop - full screen overlay */}
        <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        />
        {/* Full-width panel - starts from top */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full">
            {/* Header - Modern design */}
            <div className="flex items-center justify-between py-5 px-2 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <FaBell className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                      <p className="text-sm text-gray-500 mt-0.5 font-medium">
                        {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
                      </p>
                  )}
                </div>
                {unreadCount > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold rounded-full px-3 py-1 shadow-lg shadow-red-500/30 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
                )}
              </div>
              <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                  aria-label="Close notifications"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Filters - Enhanced design */}
            <div className="py-4 px-2 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm sticky top-[73px] z-10">
              <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'all'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  All
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'unread'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  Unread
                </button>
                <button
                    onClick={() => setFilter('session_time_set')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'session_time_set'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  Time Set
                </button>
                <button
                    onClick={() => setFilter('session_rescheduled')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'session_rescheduled'
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md shadow-yellow-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  Rescheduled
                </button>
                <button
                    onClick={() => setFilter('therapist_assigned')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'therapist_assigned'
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  Therapist
                </button>
                <button
                    onClick={() => setFilter('client_payment')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === 'client_payment'
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-500/30 scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  Payment
                </button>
              </div>
            </div>

            {/* Actions - Enhanced design */}
            <div className="py-3 px-2 border-b border-gray-200/60 bg-white/50 backdrop-blur-sm">
              <div className="flex gap-3">
                <button
                    onClick={onMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105 border border-blue-200 hover:border-blue-300"
                >
                  <FaCheck />
                  Mark All Read
                </button>
                <button
                    onClick={onClearAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105 border border-red-200 hover:border-red-300"
                >
                  <FaTrash />
                  Clear All
                </button>
              </div>
            </div>

            {/* Notifications List - Enhanced design */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaBell className="text-3xl text-gray-300" />
                    </div>
                    <p className="text-base font-medium text-gray-500">No notifications</p>
                    <p className="text-sm text-gray-400 mt-1">You&#39;re all caught up!</p>
                  </div>
              ) : (
                  <div className="space-y-2">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                (notification.unread || !notification.isRead)
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm' 
                                    : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
                            }`}
                            onClick={() => {
                              if (notification.unread || !notification.isRead) {
                                onMarkAsRead(notification.id);
                              }
                            }}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 mt-1 w-10 h-10 rounded-lg flex items-center justify-center ${
                                (notification.unread || !notification.isRead) ? 'bg-white shadow-sm' : 'bg-gray-100'
                            }`}>
                              <div className="text-lg">
                                {getNotificationIcon(notification.type)}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className={`text-sm font-semibold mb-1 ${
                                      (notification.unread || !notification.isRead) ? 'text-gray-900' : 'text-gray-800'
                                  }`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {notification.message}
                                  </p>
                                </div>
                                {(notification.unread || !notification.isRead) && (
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5 animate-pulse"></div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                  <FaClock className="text-xs" />
                                  {formatTime(notification.timestamp)}
                                </span>

                                {notification.data?.clientName && (
                                    <span className="text-xs font-medium text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
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
