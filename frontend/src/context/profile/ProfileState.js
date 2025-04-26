import React, { useReducer } from 'react';
import axios from 'axios';
import ProfileContext from './profileContext';
import profileReducer from './profileReducer';
import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  CREATE_PROFILE,
  CLEAR_PROFILE
} from '../types';

const ProfileState = props => {
  const initialState = {
    profile: null,
    profiles: [],
    error: null,
    loading: true
  };

  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Get current user's profile
  const getMyProfile = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/me`);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response?.data?.message || 'Could not get profile'
      });
    }
  };

  // Get profile by ID
  const getProfileById = async id => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${id}`);

      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response?.data?.message || 'Could not get profile'
      });
    }
  };

  // Create or update profile
  const createProfile = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/profile`,
        formData,
        config
      );

      dispatch({
        type: CREATE_PROFILE,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response?.data?.message || 'Could not update profile'
      });
    }
  };

  // Get all profiles
  const getAllProfiles = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/all`);

      dispatch({
        type: GET_PROFILES,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: err.response?.data?.message || 'Could not get profiles'
      });
    }
  };

  // Clear profile
  const clearProfile = () => dispatch({ type: CLEAR_PROFILE });

  return (
    <ProfileContext.Provider
      value={{
        profile: state.profile,
        profiles: state.profiles,
        error: state.error,
        loading: state.loading,
        getMyProfile,
        getProfileById,
        createProfile,
        getAllProfiles,
        clearProfile
      }}
    >
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileState;
