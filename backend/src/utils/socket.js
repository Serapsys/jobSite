const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');

module.exports = function(io) {
  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded.user;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}`);
    
    // Join personal room for direct messages
    socket.join(socket.user.id);
    
    // Join chat rooms
    socket.on('join-chat', async (chatId) => {
      try {
        const chat = await Chat.findById(chatId);
        if (chat && chat.participants.includes(socket.user.id)) {
          socket.join(chatId);
          console.log(`User ${socket.user.id} joined chat ${chatId}`);
        }
      } catch (error) {
        console.error('Error joining chat room:', error);
      }
    });
    
    // Send message
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content } = data;
        
        // Save message to database
        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }
        
        // Check if user is a participant
        if (!chat.participants.some(p => p.toString() === socket.user.id)) {
          socket.emit('error', { message: 'Not authorized to access this chat' });
          return;
        }
        
        // Add message to chat
        const newMessage = {
          sender: socket.user.id,
          content,
          timestamp: new Date()
        };
        
        chat.messages.push(newMessage);
        chat.updatedAt = new Date();
        await chat.save();
        
        // Broadcast message to chat room
        io.to(chatId).emit('new-message', {
          chatId,
          message: {
            ...newMessage,
            sender: { _id: socket.user.id }
          }
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });
    
    // Typing indicator
    socket.on('typing', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user-typing', {
        chatId,
        userId: socket.user.id
      });
    });
    
    // Stop typing indicator
    socket.on('stop-typing', (data) => {
      const { chatId } = data;
      socket.to(chatId).emit('user-stop-typing', {
        chatId,
        userId: socket.user.id
      });
    });
    
    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};
