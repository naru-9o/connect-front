import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ChatBox = ({
  isOpen,
  onClose,
  recipient,
  messages,
  onSendMessage
}) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  if (!isOpen || !recipient) return null;

  // Simple duplicate removal - only change from your original code
  const uniqueMessages = messages.filter((message, index, array) => {
    if (!message._id && !message.id) return true;
    const messageId = message._id || message.id;
    return array.findIndex(m => (m._id || m.id) === messageId) === index;
  });

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={recipient.profileImage}
            alt={recipient.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h4 className="font-medium text-gray-900">{recipient.name}</h4>
            <p className="text-xs text-gray-500">{recipient.startupName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {uniqueMessages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            Start a conversation with {recipient.name}
          </div>
        ) : (
          uniqueMessages.map((message) => {
            const senderId =
              message.senderId || message.sender?._id || message.sender;

            const currentUserId = user?._id || user?.id;

            const isFromUser = senderId === currentUserId;

            return (
              <div
                key={message._id || message.id}
                className={`flex ${isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    isFromUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-green-100 text-green-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isFromUser ? 'text-blue-200' : 'text-green-600'}`}>
                    {new Date(message.createdAt || message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;