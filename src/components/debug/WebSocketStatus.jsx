import React from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';

const WebSocketStatus = () => {
  const { connectionStatus, reconnect } = useWebSocket();

  const getStatusColor = () => {
    if (connectionStatus.isConnected) return 'text-green-600 bg-green-100';
    if (connectionStatus.reconnectAttempts > 0) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (connectionStatus.isConnected) return 'Connected';
    if (connectionStatus.reconnectAttempts > 0) return `Reconnecting (${connectionStatus.reconnectAttempts}/${connectionStatus.maxReconnectAttempts})`;
    return 'Disconnected';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg shadow-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connectionStatus.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">WebSocket: {getStatusText()}</span>
          {!connectionStatus.isConnected && (
            <button
              onClick={reconnect}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          )}
        </div>
        <div className="text-xs mt-1 opacity-75">
          Cookies: {document.cookie.includes('accessToken=') ? '✅' : '❌'} | 
          Server: {document.cookie.includes('refreshToken=') ? '✅' : '❌'}
        </div>
      </div>
    </div>
  );
};

export default WebSocketStatus;
