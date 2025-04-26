import React, { useState, useContext, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';
import ChatContext from '../../context/chat/chatContext';
import AuthContext from '../../context/auth/authContext';
import TextSuggestion from '../suggestions/TextSuggestion';

const Chat = () => {
  const { id } = useParams();
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const { chat, getChat, sendMessage, loading } = chatContext;
  const { user, token } = authContext;

  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getChat(id);
    
    // Initialize socket connection
    const socketIo = io(process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001', {
      auth: { token }
    });
    
    setSocket(socketIo);
    
    // Listen for socket events
    socketIo.on('connect', () => {
      console.log('Socket connected');
      socketIo.emit('join-chat', id);
    });
    
    socketIo.on('new-message', data => {
      if (data.chatId === id) {
        getChat(id);
        setOtherUserTyping(false);
      }
    });
    
    socketIo.on('user-typing', data => {
      if (data.chatId === id && data.userId !== user.id) {
        setOtherUserTyping(true);
      }
    });
    
    socketIo.on('user-stop-typing', data => {
      if (data.chatId === id && data.userId !== user.id) {
        setOtherUserTyping(false);
      }
    });
    
    // Clean up on component unmount
    return () => {
      if (socketIo) {
        socketIo.disconnect();
      }
    };
    // eslint-disable-next-line
  }, [id, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onChange = e => {
    setMessage(e.target.value);
    
    if (!typing && socket) {
      setTyping(true);
      socket.emit('typing', { chatId: id });
    }
    
    // Clear the typing indicator after a delay
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.emit('stop-typing', { chatId: id });
    }, 2000);
  };

  const typingTimeout = useRef(null);

  const onSubmit = e => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(id, message);
      setMessage('');
      setTyping(false);
      if (socket) {
        socket.emit('stop-typing', { chatId: id });
        socket.emit('send-message', { chatId: id, content: message });
      }
    }
  };

  if (loading || !chat) {
    return <div>Loading...</div>;
  }

  // Find the other participant (not the current user)
  const otherParticipant = chat.participants.find(p => p._id !== user.id);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/chats" className="text-blue-600 hover:text-blue-800">
          ← Back to Messages
        </Link>
      </div>

      <div className="card mb-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold">
            Chat with {otherParticipant ? otherParticipant.username : 'Unknown User'}
          </h2>
        </div>

        <div className="h-96 overflow-y-auto mb-4 p-2">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div>
              {chat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${
                    msg.sender === user.id
                      ? 'message-bubble-sent'
                      : 'message-bubble-received'
                  }`}
                >
                  <div className="message-content">{msg.content}</div>
                  <div className="text-xs text-right mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
          {otherUserTyping && (
            <div className="typing-indicator">
              {otherParticipant ? otherParticipant.username : 'User'} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <TextSuggestion 
              text={message} 
              fieldName="message" 
              setFormData={values => setMessage(values.message)} 
              formData={{ message }} 
            />
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={onChange}
              className="form-input flex-grow mr-2"
              placeholder="Type a message..."
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
