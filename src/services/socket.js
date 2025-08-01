import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventListeners = new Map(); // Track listeners to prevent duplicates
  }

  connect(token) {
    if (this.socket?.connected) return;

    const serverUrl =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      // Remove all custom event listeners
      this.eventListeners.clear();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Conversation
  joinConversation(otherUserId) {
    if (this.socket?.connected) {
      this.socket.emit('joinConversation', otherUserId);
    }
  }

  leaveConversation(otherUserId) {
    if (this.socket?.connected) {
      this.socket.emit('leaveConversation', otherUserId);
    }
  }

  sendMessage(receiverId, content) {
    if (this.socket?.connected) {
      this.socket.emit('sendMessage', { receiverId, content });
    }
  }

  // Event listeners with duplicate prevention
  onNewMessage(callback) {
    if (!this.socket) return;
    
    // Remove previous listener if exists
    this.off('newMessage');
    
    // Add new listener
    this.socket.on('newMessage', callback);
    this.eventListeners.set('newMessage', callback);
  }

  onMessageNotification(callback) {
    if (!this.socket) return;
    
    // Remove previous listener if exists
    this.off('messageNotification');
    
    // Add new listener
    this.socket.on('messageNotification', callback);
    this.eventListeners.set('messageNotification', callback);
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        // Remove all listeners for this event
        this.socket.off(event);
      }
      this.eventListeners.delete(event);
    }
  }

  // Helper method to check if socket is ready
  isReady() {
    return this.socket && this.isConnected;
  }
}

const socketService = new SocketService();
export default socketService;