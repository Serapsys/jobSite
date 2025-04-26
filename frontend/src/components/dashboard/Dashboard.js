import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ProfileContext from '../../context/profile/profileContext';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const profileContext = useContext(ProfileContext);

  const { isAuthenticated, user, loadUser } = authContext;
  const { profile, getMyProfile, loading } = profileContext;

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      getMyProfile();
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const guestContent = (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Find Your Dream Job</h1>
      <p className="text-xl mb-8">Connect with employers and find opportunities that match your skills</p>
      <div className="flex justify-center gap-4">
        <Link to="/register" className="btn btn-primary">
          Sign Up
        </Link>
        <Link to="/login" className="btn btn-secondary">
          Login
        </Link>
      </div>
    </div>
  );

  const userContent = (
    <div>
      {user && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      )}

      {loading ? (
        <div>Loading profile...</div>
      ) : profile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Your Profile</h2>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {profile.fullName}
            </div>
            {profile.bio && (
              <div className="mb-2">
                <span className="font-semibold">Bio:</span> {profile.bio}
              </div>
            )}
            {profile.location && (
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {profile.location}
              </div>
            )}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold">Skills:</span>{' '}
                {profile.skills.join(', ')}
              </div>
            )}
            <div className="mt-4">
              <Link to="/edit-profile" className="btn btn-primary">
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <p className="mb-4">Connect with employers and other job seekers</p>
            <Link to="/chats" className="btn btn-primary">
              View Messages
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2 className="text-xl font-bold mb-4">You haven't set up your profile yet</h2>
          <p className="mb-4">Create a profile to showcase your skills and connect with others</p>
          <Link to="/edit-profile" className="btn btn-primary">
            Create Profile
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto">
      {isAuthenticated ? userContent : guestContent}
    </div>
  );
};

export default Dashboard;
