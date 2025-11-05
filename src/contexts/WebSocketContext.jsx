import  { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

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
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Rehydrate notifications from localStorage on mount
    try {
      const storedNotifications = localStorage.getItem('anon_notifications');
      const storedUnread = localStorage.getItem('anon_unread_count');
      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications);
        setNotifications(Array.isArray(parsed) ? parsed : []);
      }
      if (storedUnread) {
        const parsedUnread = parseInt(storedUnread, 10);
        setUnreadCount(Number.isNaN(parsedUnread) ? 0 : parsedUnread);
      }
    } catch (e) {
      console.warn('Failed to rehydrate notifications from storage:', e);
    }

    const initializeConnection = async () => {
      await connectWebSocket();
    };

    initializeConnection();

    return () => {
      if (socket) {
        socket.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
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
        const response = await fetch('http://localhost:3000/api/v1/auth/token', {
          method: 'GET',
          credentials: 'include', // This ensures cookies are sent
          headers: {
            'Content-Type': 'application/json',
          }
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
        } catch (_) {
          console.log('📨 Socket event:', eventName);
        }
      });



      setSocket(newSocket);
    } catch (error) {
      console.error('Error creating Socket.IO connection:', error);
      attemptReconnect();
    }
  };

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
          id: Date.now() + Math.random(),
          type: 'session_update',
          title: 'Session Updated',
          message: data.message || 'A session has been updated',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      case 'session_time_set':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'session_time_set',
          title: 'Session Time Set',
          message: data.message || 'Session time has been scheduled',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      case 'session_rescheduled':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'session_rescheduled',
          title: 'Session Rescheduled',
          message: data.message || 'A session has been rescheduled',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      case 'session_completed':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'session_completed',
          title: 'Session Completed',
          message: data.message || 'A session has been completed',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      case 'session_cancelled':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'session_cancelled',
          title: 'Session Cancelled',
          message: data.message || 'A session has been cancelled',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      case 'therapist_assigned':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'therapist_assigned',
          title: 'Therapist Assigned',
          message: data.message || 'A therapist has been assigned to your account.',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      case 'payment':
        addNotification({
          id: Date.now() + Math.random(),
          type: 'client_payment',
          title: 'Payment Received',
          message: data.message || 'Your payment was successful!',
          timestamp: new Date(),
          data: data.data,
          unread: true
        });
        break;
      
      default:
        console.log('Unknown WebSocket message type:', type, data);
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50 notifications
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, unread: false }))
    );
    setUnreadCount(0);
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
