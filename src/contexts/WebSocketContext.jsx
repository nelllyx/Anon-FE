
import  { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { hasRefreshCookie, getUserData } from '../utils/auth';
import { useAuthenticatedFetch } from '../utils/api';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [shouldConnect, setShouldConnect] = useState(false);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const authenticatedFetch = useAuthenticatedFetch();

  // Rehydrate notifications from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem('anon_notifications');
      const storedUnread = localStorage.getItem('anon_unread_count');
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        const normalized = Array.isArray(parsed)
          ? parsed.map(n => ({ ...n, isLive: false }))
          : [];
        setNotifications(normalized);
      }
      if (storedUnread) {
        const parsedUnread = parseInt(storedUnread, 10);
        setUnreadCount(Number.isNaN(parsedUnread) ? 0 : parsedUnread);
      }
    } catch (e) {
      console.warn('Failed to rehydrate notifications from storage:', e);
    }
  }, []);

  // Automatically enable WebSocket for already-authenticated users on refresh
  useEffect(() => {
    if (hasRefreshCookie() || getUserData()) {
      setShouldConnect(true);
    }
  }, []);

  // Persist notifications and counts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('anon_notifications', JSON.stringify(notifications));
      localStorage.setItem('anon_unread_count', String(unreadCount));
    } catch (e) {
      // ignore quota errors
    }
  }, [notifications, unreadCount]);

  const connectWebSocket = async () => {
    try {
      // For HTTP-only cookies, we need to get the token from the server
      // First, try to get token from a dedicated endpoint
      let token = null;

      try {
        const response = await authenticatedFetch('http://localhost:3000/api/v1/auth/token', {
          method: 'GET'
        });

        if (response.ok) {
          const data = await response.json();
          token = data.token;
          console.log('✅ Token retrieved from server for WebSocket authentication');
        } else {
          console.warn('❌ Failed to get token from server:', response.status, response.statusText);
        }
      } catch (error) {
        console.warn('❌ Could not fetch token from server:', error);
      }


      if (!token) {
        console.warn('❌ No authentication token or cookies available for WebSocket connection');
        // Automatically retry later instead of requiring a manual connect click
        attemptReconnect();
        return;
      }

      // Socket.IO connection with authentication
      const socketOptions = {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: maxReconnectAttempts,
        withCredentials: true, // Include cookies in the connection
        extraHeaders: {
          'Cookie': document.cookie // Explicitly include cookies
        }
      };

      // Add token to auth if available
      if (token) {
        socketOptions.auth = { token: token };
      }

      console.log('🔌 Attempting WebSocket connection with options:', socketOptions);
      const newSocket = io('http://localhost:3000', socketOptions);

      newSocket.on('connect', () => {
        console.log('✅ Socket.IO connected successfully');
        console.log('🔗 Socket ID:', newSocket.id);
        setIsConnected(true);
        reconnectAttempts.current = 0;

        newSocket.emit("join_role_notifications", (response) => {
          if (response.success) {
            console.log("✅ Joined notification room:", response.roomId);
          } else {
            console.error("❌ Failed to join notification room:", response.error);
          }
        });


      });

      newSocket.on('disconnect', (reason) => {
        console.log('❌ Socket.IO disconnected:', reason);
        setIsConnected(false);
        if (reason === 'io server disconnect') {
          // Server disconnected, try to reconnect
          console.log('🔄 Server disconnected, attempting reconnection...');
          attemptReconnect();
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          description: error.description,
          context: error.context,
          type: error.type
        });
        setIsConnected(false);
        attemptReconnect();
      });

      // Listen for notification events

      newSocket.on("connected", (data) => {
        console.log("✅ Notification connection success:", data);
      });


      newSocket.on('notification', (data) => {
        console.log('New notification received:', data);
        handleWebSocketMessage(data);
      });

      // Debug: log all incoming events to help diagnose mismatched event names
      newSocket.onAny((eventName, ...args) => {
        try {
          const payload = args && args.length > 0 ? args[0] : undefined;
          console.log('📨 Socket event:', eventName, payload);
        } catch (err) {
          console.log('📨 Socket event:', eventName);
        }
      });



      setSocket(newSocket);
    } catch (error) {
      console.error('Error creating Socket.IO connection:', error);
      attemptReconnect();
    }
  };

  const initializeConnection = useCallback(async () => {
    // Fetch missed notifications from backend first
    await fetchMissedNotifications();
    await connectWebSocket();
  }, []);

  // Start or stop WebSocket connection based on shouldConnect
  useEffect(() => {
    if (!shouldConnect) return;

    initializeConnection();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [shouldConnect, initializeConnection]);

  const attemptReconnect = () => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current++;
      const delay = Math.pow(2, reconnectAttempts.current) * 1000; // Exponential backoff

      console.log(`🔄 Scheduling reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts} in ${delay}ms`);

      reconnectTimeoutRef.current = setTimeout(async () => {
        console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        await connectWebSocket();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached. WebSocket connection failed.');
    }
  };

  const handleWebSocketMessage = (data) => {
    console.log('WebSocket message received:', data);

    switch (data.type) {
      case 'session_update':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'session_update',
          title: 'Session Updated',
          message: data.message || 'A session has been updated',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      case 'session_time_set':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'session_time_set',
          title: 'Session Time Set',
          message: data.message || 'Session time has been scheduled',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      case 'session_rescheduled':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'session_rescheduled',
          title: 'Session Rescheduled',
          message: data.message || 'A session has been rescheduled',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      case 'session_completed':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'session_completed',
          title: 'Session Completed',
          message: data.message || 'A session has been completed',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      case 'session_cancelled':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'session_cancelled',
          title: 'Session Cancelled',
          message: data.message || 'A session has been cancelled',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      case 'therapist_assigned':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'therapist_assigned',
          title: 'Therapist Assigned',
          message: data.message || 'A therapist has been assigned to your account.',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;
      case 'payment':
        addNotification({
          id: data.id || data.notificationId || Date.now() + Math.random(),
          type: 'client_payment',
          title: 'Payment Received',
          message: data.message || 'Your payment was successful!',
          timestamp: data.timestamp || new Date(),
          data: data.data,
          unread: true,
          isRead: false,
          isLive: true
        });
        break;

      default:
        console.log('Unknown WebSocket message type:', type, data);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      isRead: false,
      unread: true
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep last 50 notifications
    setUnreadCount(prev => prev + 1);
  };

  // Fetch missed notifications from backend
  const fetchMissedNotifications = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:3000/api/v1/notifications/get-notifications', {
        method: 'GET'
      });

      console.log("fetched notification: " , response)

      if (response.ok) {
        const data = await response.json();

        // Normalize backend notifications into an array safely
        // Expected shapes we handle:
        // - { notifications: [...] }
        // - { data: [...] }
        // - { data: { notifications: [...] } }
        // - or any non-array → treated as empty
        let raw = data.notifications ?? data.data ?? [];
        if (!Array.isArray(raw)) {
          if (Array.isArray(raw.notifications)) {
            raw = raw.notifications;
          } else if (Array.isArray(raw.items)) {
            raw = raw.items;
          } else {
            console.warn('Unexpected notifications payload shape:', data);
            raw = [];
          }
        }
        const backendNotifications = raw;

        if (Array.isArray(backendNotifications)) {
          // Merge with existing notifications, avoiding duplicates
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id || n._id));
            const newNotifications = backendNotifications
                .filter(n => !existingIds.has(n.id || n._id))
                .map(n => ({
                  id: n.id || n._id,
                  type: n.type,
                  title: n.title,
                  message: n.message,
                  timestamp: n.timestamp || n.createdAt,
                  data: n.data,
                  unread: !n.isRead,
                  isRead: n.isRead || false,
                  isLive: false
                }));

            return [...newNotifications, ...prev].slice(0, 50); // Keep last 50
          });

          // Update unread count
          const unreadNotifications = backendNotifications.filter(n => !n.isRead);
          setUnreadCount(unreadNotifications.length);
        } else {
          console.warn('Backend notifications is not an array after normalization:', backendNotifications);
        }
      }
    } catch (error) {
      console.error('Error fetching missed notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    // Optimistically update UI
    setNotifications(prev =>
        prev.map(notif =>
            (notif.id === notificationId || notif._id === notificationId)
                ? { ...notif, unread: false, isRead: true }
                : notif
        )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    // Update backend
    try {
      const response = await authenticatedFetch(`http://localhost:3000/api/v1/notifications/mark-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('Failed to mark notification as read on backend');
        // Revert optimistic update on error
        setNotifications(prev =>
            prev.map(notif =>
                (notif.id === notificationId || notif._id === notificationId)
                    ? { ...notif, unread: true, isRead: false }
                    : notif
            )
        );
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert optimistic update on error
      setNotifications(prev =>
          prev.map(notif =>
              (notif.id === notificationId || notif._id === notificationId)
                  ? { ...notif, unread: true, isRead: false }
                  : notif
          )
      );
      setUnreadCount(prev => prev + 1);
    }
  };

  const markAllAsRead = async () => {
    // Store previous state for potential revert
    const previousNotifications = [...notifications];
    const previousUnreadCount = unreadCount;

    // Optimistically update UI
    setNotifications(prev =>
        prev.map(notif => ({ ...notif, unread: false, isRead: true }))
    );
    setUnreadCount(0);

    // Update backend
    try {
      const response = await authenticatedFetch('http://localhost:3000/api/v1/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error('Failed to mark all notifications as read on backend');
        // Revert optimistic update on error
        setNotifications(previousNotifications);
        setUnreadCount(previousUnreadCount);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Revert optimistic update on error
      setNotifications(previousNotifications);
      setUnreadCount(previousUnreadCount);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const sendMessage = (message) => {
    if (socket && isConnected) {
      // Emit the message type as an event
      socket.emit(message.type, message.data || message);
    } else {
      console.warn('Socket.IO is not connected');
    }
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    sendMessage,
    reconnect: connectWebSocket,
    startWebSocket: () => setShouldConnect(true),
    connectionStatus: {
      isConnected,
      reconnectAttempts: reconnectAttempts.current,
      maxReconnectAttempts
    }
  };

  return (
      <WebSocketContext.Provider value={value}>
        {children}
      </WebSocketContext.Provider>
  );
};
