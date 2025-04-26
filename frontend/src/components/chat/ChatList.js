import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChatContext from '../../context/chat/chatContext';
import AuthContext from '../../context/auth/authContext';

const ChatList = () => {
  const chatContext = useContext(ChatContext);
  const authContext = useContext(AuthContext);

  const { chats, getChats, loading } = chatContext;
  const { user } = authContext;

  useEffect(() => {
    getChats();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      {chats.length === 0 ? (
        <div className="card text-center py-10">
          <h2 className="text-xl font-bold mb-4">No messages yet</h2>
          <p className="mb-4">Start a conversation with other users</p>
        </div>
      ) : (
        <div className="card">
          <ul className="divide-y divide-gray-200">
            {chats.map(chat => {
              // Find the other participant (not the current user)
              const otherParticipant = chat.participants.find(
                p => p._id !== user.id
              );

              // Get the last message in the chat
              const lastMessage = chat.messages.length > 0 
                ? chat.messages[chat.messages.length - 1]
                : null;

              return (
                <li key={chat._id} className="py-4">
                  <Link to={`/chat/${chat._id}`} className="block hover:bg-gray-50 rounded-lg p-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium">
                          {otherParticipant ? otherParticipant.username : 'Unknown User'}
                        </h3>
                        {lastMessage && (
                          <p className="text-gray-600 truncate mt-1">
                            {lastMessage.sender === user.id ? 'You: ' : ''}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                      {lastMessage && (
                        <div className="text-sm text-gray-500">
                          {new Date(lastMessage.timestamp).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChatList;
