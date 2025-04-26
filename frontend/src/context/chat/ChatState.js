import React, { useReducer } from 'react';
import axios from 'axios';
import ChatContext from './chatContext';
import chatReducer from './chatReducer';
import {
  GET_CHATS,
  GET_CHAT,
  CHAT_ERROR,
  SEND_MESSAGE
} from '../types';

const ChatState = props => {
  const initialState = {
    chats: [],
    chat: null,
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Get all chats for the current user
  const getChats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat`);

      dispatch({
        type: GET_CHATS,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err.response?.data?.message || 'Could not get chats'
      });
    }
  };

  // Get chat by ID
  const getChat = async id => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/${id}`);

      dispatch({
        type: GET_CHAT,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err.response?.data?.message || 'Could not get chat'
      });
    }
  };

  // Start a new chat
  const startChat = async (participantId, initialMessage) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/start`,
        { participantId, initialMessage },
        config
      );

      dispatch({
        type: GET_CHAT,
        payload: res.data
      });

      return res.data._id;
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err.response?.data?.message || 'Could not start chat'
      });
      return null;
    }
  };

  // Send a message
  const sendMessage = async (chatId, content) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/${chatId}/message`,
        { content },
        config
      );

      dispatch({
        type: SEND_MESSAGE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: CHAT_ERROR,
        payload: err.response?.data?.message || 'Could not send message'
      });
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats: state.chats,
        chat: state.chat,
        error: state.error,
        loading: state.loading,
        getChats,
        getChat,
        startChat,
        sendMessage
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
