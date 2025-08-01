import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';
import ChatBox from '../components/Common/ChatBox';
import { messagesAPI } from '../services/api';
import socketService from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (location.state?.selectedUserId) {
      setSelectedUserId(location.state.selectedUserId);
      setIsChatOpen(true);
    }
  }, [location.state]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await messagesAPI.getMessages(userId);
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedUserId) {
      const firstUserId = conversations[0].user?._id;
      if (firstUserId) {
        setSelectedUserId(firstUserId);
        setIsChatOpen(true);
        fetchMessages(firstUserId);
        socketService.joinConversation(firstUserId);
      }
    }
  }, [conversations]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessages(selectedUserId);
      socketService.joinConversation(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (!user) return;

    const handleNewMessage = (message) => {
      const isCurrentConversation =
        (message.sender._id === selectedUserId && message.receiver._id === user._id) ||
        (message.sender._id === user._id && message.receiver._id === selectedUserId);

      if (isCurrentConversation) {
        const alreadyExists = messagesRef.current.some((m) => m._id === message._id);
        if (!alreadyExists) {
          setMessages((prev) => [...prev, message]);
        }
      }

      fetchConversations();
    };

    const handleNotification = (data) => {
      if (data.sender._id !== selectedUserId) {
        fetchConversations();
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${data.sender.name}`, {
            body: data.message.content,
            icon: data.sender.profileImage
          });
        }
      }
    };

    socketService.socket?.off('newMessage');
    socketService.socket?.off('messageNotification');

    socketService.onNewMessage(handleNewMessage);
    socketService.onMessageNotification(handleNotification);

    return () => {
      socketService.socket?.off('newMessage');
      socketService.socket?.off('messageNotification');
    };
  }, [user, selectedUserId]);

  const handleSendMessage = async (content) => {
    if (!selectedUserId || !user) return;
    socketService.sendMessage(selectedUserId, content);
    messagesAPI.sendMessage({ receiver: selectedUserId, content }).catch(console.error);
  };

  const handleConversationClick = (userId) => {
    setSelectedUserId(userId);
    setIsChatOpen(true);
    fetchMessages(userId);
    socketService.joinConversation(userId);
    messagesAPI.markAsRead(userId).catch(console.error);
  };

  useEffect(() => {
    if (
      Notification.permission !== 'granted' &&
      Notification.permission !== 'denied'
    ) {
      Notification.requestPermission();
    }
  }, []);

  const selectedUser = selectedUserId
    ? conversations.find((c) => c.user?._id === selectedUserId)?.user
    : null;

  const filteredConversations = conversations.filter((c) => {
    const name = c.user?.name?.toLowerCase() || '';
    const startupName = c.user?.startupName?.toLowerCase() || '';
    return name.includes(searchTerm.toLowerCase()) || startupName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">Connect and collaborate with fellow founders</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">Loading conversations...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No conversations yet</p>
              <p className="text-gray-400">Start networking to begin conversations</p>
            </div>
          ) : (
                filteredConversations.map(({ user: conversationUser, lastMessage, unreadCount }) => (
                  <div
                    key={conversationUser?._id}
                    onClick={() => handleConversationClick(conversationUser._id)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={conversationUser?.profileImage || '/default-avatar.png'}
                        alt={conversationUser?.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversationUser?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {lastMessage?.createdAt
                              ? new Date(lastMessage.createdAt).toLocaleDateString()
                              : ''}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500 truncate">
                            {conversationUser?.startupName || ''}
                          </p>

                          {/* Show unread count and ❌ button */}
                          {unreadCount > 0 && (
                            <div className="flex items-center space-x-1">
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                {unreadCount}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent triggering the conversation switch
                                  messagesAPI.markAsRead(conversationUser._id)
                                    .then(() => fetchConversations())
                                    .catch((err) =>
                                      console.error('Error clearing notification:', err)
                                    );
                                }}
                                className="text-gray-400 hover:text-red-600"
                                title="Clear notification"
                              >
                                ❌
                              </button>
                            </div>
                        )}
                        </div>

                        <p className="text-sm text-gray-400 truncate mt-1">
                          {lastMessage?.sender?._id === user?._id ? 'You: ' : ''}
                          {lastMessage?.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))

          )}
        </div>
      </div>

      {/* ChatBox */}
      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recipient={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Messages;
