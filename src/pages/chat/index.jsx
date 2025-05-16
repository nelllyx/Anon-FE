import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiSend, FiPaperclip, FiSmile, FiX } from 'react-icons/fi';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [userInfo, setUserInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user info from localStorage
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const userType = userInfo?.userType || 'client';
  const userId = userInfo?.userId;
  const chatId = location.state?.chatId;

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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/v1/messages/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else if (response.status === 401) {
        // Handle unauthorized access
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    const formData = new FormData();
    formData.append('content', newMessage);
    formData.append('senderId', userId);
    formData.append('senderType', userType);
    formData.append('chatId', chatId);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const messageData = await response.json();
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');
        setSelectedFile(null);
      } else if (response.status === 401) {
        navigate('/login');
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
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.senderType === userType;
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[80%]`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold mx-2 ${
            isOwnMessage ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {isOwnMessage ? 'You' : (userType === 'client' ? 'T' : 'C')}
          </div>
          <div className={`rounded-2xl px-4 py-2 ${
            isOwnMessage 
              ? 'bg-blue-500 text-white rounded-tr-none' 
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}>
            {message.fileUrl && (
              <div className="mb-2">
                {message.fileType?.startsWith('image/') ? (
                  <img 
                    src={message.fileUrl} 
                    alt="Shared file" 
                    className="max-w-[200px] rounded-lg"
                  />
                ) : (
                  <a 
                    href={message.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    📎 {message.fileName}
                  </a>
                )}
              </div>
            )}
            <p className="text-sm">{message.content}</p>
            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && (
        <div className="w-1/4 bg-white border-r border-gray-200 p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
          </div>
          {/* Chat list would go here */}
        </div>
      )}

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {userType === 'client' ? 'T' : 'C'}
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {userType === 'client' ? 'Your Therapist' : 'Your Client'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isTyping ? 'Typing...' : 'Online'}
                </p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="w-6 h-6 text-gray-500" />
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message input */}
        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            {selectedFile && (
              <div className="mb-2 flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <span className="text-sm text-gray-600 truncate">
                  📎 {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiPaperclip className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiSmile className="w-5 h-5" />
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() && !selectedFile}
                className={`p-2 rounded-full ${
                  newMessage.trim() || selectedFile
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat; 