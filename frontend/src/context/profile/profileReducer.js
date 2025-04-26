import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CREATE_PROFILE,
  CLEAR_PROFILE
} from '../types';

const profileReducer = (state, action) => {
  switch (action.type) {
    case GET_PROFILE:
    case CREATE_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        profile: null,
        loading: false
      };
    default:
      return state;
  }
};

export default profileReducer;
