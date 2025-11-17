import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { FiSend, FiPaperclip, FiSmile, FiX, FiImage, FiFile, FiCheckCircle, FiMessageCircle, FiSearch, FiArrowLeft, FiLock, FiClock, FiCalendar } from 'react-icons/fi';
import { FaCircle } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import { useAuthenticatedFetch } from '../../utils/api';
import { format, parseISO, isToday, isAfter, isBefore, addHours } from 'date-fns';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userInfo, setUserInfo] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatStatus, setChatStatus] = useState('checking'); // 'checking', 'open', 'closed', 'no-session'
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authenticatedFetch = useAuthenticatedFetch();

  // Get user info from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userData');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const userType = userInfo?.role || 'client';
  const userId = userInfo?.id;
  // Get chatId from location.state, URL params, or selected chat
  const chatId = location.state?.chatId || searchParams.get('chatId') || selectedChat?.id || selectedChat?.chatId;

  // Fetch chats list
  useEffect(() => {
    if (userId) {
      fetchChats();
      if (userType === 'client') {
        fetchSessions();
      }
    }
  }, [userId, userType]);

  // Check chat availability based on sessions
  useEffect(() => {
    if (userType === 'client' && sessions.length > 0 && chatId) {
      checkChatAvailability();
    } else if (userType === 'therapist') {
      // For therapists, chat is always open (they can respond anytime)
      setIsChatOpen(true);
      setChatStatus('open');
    }
  }, [sessions, chatId, userType]);

  // Fetch client sessions
  const fetchSessions = async () => {
    try {
      const response = await authenticatedFetch('http://localhost:3000/api/v1/client/sessions');
      if (response.ok) {
        const data = await response.json();
        const sessionsList = data.data?.Sessions || [];
        setSessions(sessionsList);

        console.log('Session List:', sessionsList)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Check if chat should be open
  const checkChatAvailability = () => {
    if (!chatId || sessions.length === 0) {
      setChatStatus('no-session');
      setIsChatOpen(false);
      return;
    }

    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');

    // Find sessions for today
    const todaySessions = sessions.filter(session => {
      const sessionDate = session.date ? format(parseISO(session.date), 'yyyy-MM-dd') : null;
      return sessionDate === today && session.status === 'upcoming';
    });

    if (todaySessions.length === 0) {
      setChatStatus('closed');
      setIsChatOpen(false);
      setCurrentSession(null);
      return;
    }

    // Get the session for the current chat (assuming one therapist per client)
    const session = todaySessions[0];
    setCurrentSession(session);

    // Check if session has ended
    if (session.scheduledTime) {
      const [hours, minutes] = session.scheduledTime.split(':').map(Number);
      const sessionStart = new Date(now);
      sessionStart.setHours(hours, minutes, 0, 0);
      
      // Assume session duration is 1 hour (you can get this from session.duration if available)
      const sessionDuration = session.duration || 60; // in minutes
      const sessionEnd = addHours(sessionStart, sessionDuration / 60);

      if (isAfter(now, sessionEnd)) {
        // Session has ended
        setChatStatus('closed');
        setIsChatOpen(false);
      } else {
        // Session is today and hasn't ended
        setChatStatus('open');
        setIsChatOpen(true);
      }
    } else {
      // No scheduled time yet, but session is today
      setChatStatus('open');
      setIsChatOpen(true);
    }
  };

  // Update selectedChat when chatId changes from URL
  useEffect(() => {
    const urlChatId = searchParams.get('chatId') || location.state?.chatId;
    if (urlChatId && chats.length > 0) {
      const chat = chats.find(c => (c.id || c.chatId) === urlChatId);
      if (chat && chat !== selectedChat) {
        setSelectedChat(chat);
      }
    }
  }, [searchParams, location.state, chats]);

  // Fetch chats
  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const endpoint = userType === 'client' 
        ? 'http://localhost:3000/api/v1/client/chats'
        : 'http://localhost:3000/api/v1/therapist/chats';
      
      const response = await authenticatedFetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || data || []);
        
        // If there's a chatId in URL but no selected chat, select the first matching chat
        const urlChatId = searchParams.get('chatId');
        if (urlChatId && !selectedChat) {
          const chat = (data.chats || data || []).find(c => c.id === urlChatId || c.chatId === urlChatId);
          if (chat) {
            setSelectedChat(chat);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoadingChats(false);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [newMessage]);

  // WebSocket connection
  useEffect(() => {
    if (chatId && userId) {
      const token = localStorage.getItem('token');
      const ws = new WebSocket(`ws://localhost:3000/ws/${chatId}?token=${token}`);
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Handle reconnection or show error message
      };

      return () => ws.close();
    }
  }, [chatId, userId]);

  // Fetch messages
  useEffect(() => {
    if (chatId && userId) {
      fetchMessages();
    }
  }, [chatId, userId]);

  const fetchMessages = async () => {
    try {
      const response = await authenticatedFetch(`http://localhost:3000/api/v1/messages/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    
    // Prevent sending if chat is closed
    if (userType === 'client' && !isChatOpen) {
      return;
    }

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', userId);
    formData.append('senderType', userType);
    formData.append('chatId', chatId);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await authenticatedFetch('http://localhost:3000/api/v1/messages', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        setSelectedFile(null);
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = '48px';
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatDateHeader = (timestamp, prevTimestamp) => {
    if (!prevTimestamp) return null;
    
    const date = new Date(timestamp);
    const prevDate = new Date(prevTimestamp);
    const isDifferentDay = date.toDateString() !== prevDate.toDateString();
    
    if (isDifferentDay) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString([], { 
          weekday: 'long',
          month: 'long', 
          day: 'numeric' 
        });
      }
    }
    return null;
  };

  const renderMessage = (message, index) => {
    const isOwnMessage = message.senderType === userType;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const dateHeader = formatDateHeader(message.timestamp, prevMessage?.timestamp);
    const showAvatar = !prevMessage || prevMessage.senderType !== message.senderType || 
                      (new Date(message.timestamp) - new Date(prevMessage.timestamp)) > 300000; // 5 minutes
    
    return (
      <div key={message.id}>
        {dateHeader && (
          <div className="flex justify-center my-6">
            <div className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
              {dateHeader}
            </div>
          </div>
        )}
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-1 group`}>
          <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[75%] md:max-w-[65%]`}>
            {/* Avatar - only show if needed */}
            {showAvatar && !isOwnMessage && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-md">
                {userType === 'client' ? 'T' : 'C'}
              </div>
            )}
            {showAvatar && isOwnMessage && (
              <div className="w-8 h-8 flex-shrink-0"></div>
            )}
            {!showAvatar && (
              <div className="w-8 h-8 flex-shrink-0"></div>
            )}
            
            {/* Message bubble */}
            <div className={`relative rounded-2xl px-4 py-2.5 shadow-sm transition-all duration-200 hover:shadow-md ${
              isOwnMessage 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md' 
                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
            }`}>
              {message.fileUrl && (
                <div className="mb-2 -mx-1">
                  {message.fileType?.startsWith('image/') ? (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={message.fileUrl} 
                        alt="Shared file" 
                        className="max-w-[280px] md:max-w-[320px] h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(message.fileUrl, '_blank')}
                      />
                    </div>
                  ) : (
                    <a 
                      href={message.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                        isOwnMessage 
                          ? 'bg-white/20 hover:bg-white/30 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <FiFile className="w-4 h-4" />
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {message.fileName || 'File'}
                      </span>
                    </a>
                  )}
                </div>
              )}
              {message.content && (
                <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isOwnMessage ? 'text-white' : 'text-gray-800'
                }`}>
                  {message.content}
                </p>
              )}
              <div className={`flex items-center justify-end gap-1 mt-1.5 ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                <span className="text-xs">
                  {formatTime(message.timestamp)}
                </span>
                {isOwnMessage && (
                  <span className="ml-1">
                    <FiCheckCircle className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    // Update URL without navigation
    navigate(`/chats?chatId=${chat.id || chat.chatId}`, { replace: true });
  };

  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const otherName = userType === 'client' 
      ? (chat.therapistName || chat.therapist?.name || 'Therapist')
      : (chat.clientName || chat.client?.name || 'Client');
    return otherName.toLowerCase().includes(searchLower);
  });

  const getChatName = (chat) => {
    if (userType === 'client') {
      return chat.therapistName || chat.therapist?.name || chat.therapist?.firstName || 'Your Therapist';
    } else {
      return chat.clientName || chat.client?.name || chat.client?.firstName || 'Your Client';
    }
  };

  const getChatAvatar = (chat) => {
    if (userType === 'client') {
      return chat.therapist?.initials || chat.therapistName?.[0] || 'T';
    } else {
      return chat.client?.initials || chat.clientName?.[0] || 'C';
    }
  };

  const getLastMessage = (chat) => {
    if (chat.lastMessage) {
      return chat.lastMessage.content || chat.lastMessage;
    }
    return 'No messages yet';
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sidebar - Chat List */}
      <div className={`${isMobile && chatId ? 'hidden' : 'flex'} ${isMobile ? 'w-full' : 'w-1/4 md:w-1/3'} bg-white border-r border-gray-200/60 shadow-sm flex flex-col`}>
        <div className="p-4 border-b border-gray-200/60">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => {
                const dashboardPath = userType === 'client' ? '/client/dashboard' : '/therapist/dashboard';
                navigate(dashboardPath);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
              title="Back to Dashboard"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
            </button>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Conversations
            </h2>
          </div>
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading conversations...</p>
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <FiMessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-500 text-center">
                {searchQuery ? 'Try a different search term' : 'Start a conversation to get started'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredChats.map((chat) => {
                const chatIdValue = chat.id || chat.chatId;
                const isSelected = chatIdValue === chatId;
                return (
                  <button
                    key={chatIdValue}
                    onClick={() => handleChatSelect(chat)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}>
                        {getChatAvatar(chat)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-semibold truncate ${
                            isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {getChatName(chat)}
                          </h3>
                          {chat.lastMessageTime && (
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatLastMessageTime(chat.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        <p className={`text-xs truncate ${
                          isSelected ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {getLastMessage(chat)}
                        </p>
                        {chat.unreadCount > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded-full">
                              {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main chat area - Show when chat is selected */}
      {chatId ? (
      <div className="flex-1 flex flex-col">
        {/* Chat header - Enhanced */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 shadow-sm sticky top-0 z-10">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Back to Dashboard Button */}
                <button
                  onClick={() => {
                    const dashboardPath = userType === 'client' ? '/client/dashboard' : '/therapist/dashboard';
                    navigate(dashboardPath);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                  title="Back to Dashboard"
                >
                  <FiArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                
                {isMobile && (
                  <button
                    onClick={() => {
                      setSelectedChat(null);
                      navigate('/chats', { replace: true });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    title="Back to conversations"
                  >
                    <FiX className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-indigo-500/30">
                  {userType === 'client' ? 'T' : 'C'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedChat ? getChatName(selectedChat) : (userType === 'client' ? 'Your Therapist' : 'Your Client')}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {userType === 'client' && currentSession && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        <FiCalendar className="w-3 h-3" />
                        <span>
                          {currentSession.scheduledTime 
                            ? `Session at ${currentSession.scheduledTime}`
                            : 'Session today'}
                        </span>
                      </div>
                    )}
                    {isTyping ? (
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <span className="text-sm text-blue-600 font-medium">Typing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <FaCircle className="w-2 h-2 text-green-500" />
                        <p className="text-sm text-gray-500 font-medium">Online</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Status Banner - Show when chat is closed for clients */}
        {userType === 'client' && chatStatus === 'closed' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 md:px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <FiLock className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">
                  Chat is closed
                </p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {currentSession?.scheduledTime 
                    ? `Your session ended. You can view previous messages but cannot send new ones until your next session.`
                    : `Chat is only available on days when you have a scheduled session.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {userType === 'client' && chatStatus === 'no-session' && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 md:px-6 py-3">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <FiCalendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">
                  No session scheduled for today
                </p>
                <p className="text-xs text-blue-700 mt-0.5">
                  Chat will be available on the day of your scheduled session. You can view previous messages anytime.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages area - Enhanced */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-transparent via-gray-50/30 to-transparent">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <FiSend className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No messages yet</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Start the conversation by sending a message below
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => renderMessage(message, index))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Message input - Enhanced */}
        <form onSubmit={handleSendMessage} className="bg-white/80 backdrop-blur-sm border-t border-gray-200/60 shadow-lg">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
            {selectedFile && (
              <div className="mb-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-200/50">
                <div className="flex items-center gap-3">
                  {selectedFile.type?.startsWith('image/') ? (
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiImage className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FiFile className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1.5 hover:bg-red-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* Chat Closed Message for Clients */}
            {userType === 'client' && !isChatOpen && (
              <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiLock className="w-4 h-4" />
                  <span>
                    {chatStatus === 'closed' 
                      ? 'Chat is closed. You can view previous messages but cannot send new ones.'
                      : 'Chat is only available on days when you have a scheduled session.'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={userType === 'client' && !isChatOpen}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  userType === 'client' && !isChatOpen
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:scale-105'
                }`}
                title={userType === 'client' && !isChatOpen ? 'Chat is closed' : 'Attach file'}
              >
                <FiPaperclip className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
              />
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder={userType === 'client' && !isChatOpen ? 'Chat is closed. View previous messages only.' : 'Type a message...'}
                  rows={1}
                  disabled={userType === 'client' && !isChatOpen}
                  className={`w-full border-2 rounded-2xl px-4 py-3 pr-12 focus:outline-none resize-none shadow-sm transition-all duration-200 overflow-y-auto ${
                    userType === 'client' && !isChatOpen
                      ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white'
                  }`}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={userType === 'client' && !isChatOpen}
                  className={`absolute right-3 bottom-3 p-1.5 rounded-lg transition-all duration-200 ${
                    userType === 'client' && !isChatOpen
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                  title={userType === 'client' && !isChatOpen ? 'Chat is closed' : 'Add emoji'}
                >
                  <FiSmile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2 z-20">
                    <div className="relative">
                      <EmojiPicker 
                        onEmojiClick={handleEmojiClick}
                        width={350}
                        height={400}
                      />
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={(!newMessage.trim() && !selectedFile) || (userType === 'client' && !isChatOpen)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  (newMessage.trim() || selectedFile) && !(userType === 'client' && !isChatOpen)
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={userType === 'client' && !isChatOpen ? 'Chat is closed' : 'Send message'}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
      ) : (
        // Empty state when no chat selected (desktop only, mobile shows sidebar)
        !isMobile && (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center px-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiMessageCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Select a conversation</h2>
              <p className="text-gray-500 max-w-sm">
                Choose a conversation from the sidebar to start chatting, or start a new conversation
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Chat; 