import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContext from '../../context/chat/chatContext';
import TextSuggestion from '../suggestions/TextSuggestion';

const ProfileModal = ({ profile, onClose }) => {
  const navigate = useNavigate();
  const chatContext = useContext(ChatContext);
  const { startChat } = chatContext;

  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleStartChat = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const chatId = await startChat(profile.user._id, message);
      if (chatId) {
        navigate(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
    } finally {
      setSending(false);
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{profile.fullName}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
              <p className="mb-1"><span className="font-medium">Email:</span> {profile.user?.email}</p>
              {profile.location && <p className="mb-1"><span className="font-medium">Location:</span> {profile.location}</p>}
              {profile.contactInfo?.phone && <p className="mb-1"><span className="font-medium">Phone:</span> {profile.contactInfo.phone}</p>}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Bio</h3>
              <p className="text-gray-700">{profile.bio || 'No bio provided'}</p>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3">Send a Message</h3>
            <div className="mb-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Type your message here..."
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => document.getElementById('suggestion-short').click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                Make it concise
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('suggestion-formal').click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                Make it formal
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('suggestion-casual').click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                Make it casual
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('suggestion-enthusiastic').click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                Make it enthusiastic
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('suggestion-professional').click()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
              >
                Make it professional
              </button>
            </div>
            
            <div className="mb-3">
              <TextSuggestion 
                text={message} 
                fieldName="message" 
                setFormData={values => setMessage(values.message)} 
                formData={{ message }} 
              />
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleStartChat}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                disabled={sending || !message.trim()}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;