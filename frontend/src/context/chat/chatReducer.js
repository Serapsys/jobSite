import {
  GET_CHATS,
  GET_CHAT,
  CHAT_ERROR,
  SEND_MESSAGE
} from '../types';

const chatReducer = (state, action) => {
  switch (action.type) {
    case GET_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false
      };
    case GET_CHAT:
      return {
        ...state,
        chat: action.payload,
        loading: false
      };
    case SEND_MESSAGE:
      return {
        ...state,
        chat: action.payload,
        loading: false
      };
    case CHAT_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

export default chatReducer;
