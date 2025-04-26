import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfileContext from '../../context/profile/profileContext';
import AuthContext from '../../context/auth/authContext';

const Profile = () => {
  const profileContext = useContext(ProfileContext);
  const authContext = useContext(AuthContext);

  const { profile, getMyProfile, loading } = profileContext;
  const { user } = authContext;

  useEffect(() => {
    getMyProfile();
    // eslint-disable-next-line
  }, []);

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <Link to="/edit-profile" className="btn btn-primary">
          Edit Profile
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Basic Info</h2>
            <div className="mb-2">
              <span className="font-semibold">Name:</span> {profile.fullName}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Email:</span> {user && user.email}
            </div>
            {profile.location && (
              <div className="mb-2">
                <span className="font-semibold">Location:</span> {profile.location}
              </div>
            )}
            {profile.contactInfo && profile.contactInfo.phone && (
              <div className="mb-2">
                <span className="font-semibold">Phone:</span> {profile.contactInfo.phone}
              </div>
            )}
          </div>
          
          <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
            <h2 className="text-xl font-bold mb-4">Bio</h2>
            <p className="text-gray-700">{profile.bio || 'No bio provided'}</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        {profile.skills && profile.skills.length > 0 ? (
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
        ) : (
          <p>No skills listed</p>
        )}
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Experience</h2>
        {profile.experience && profile.experience.length > 0 ? (
          <div>
            {profile.experience.map((exp, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <h3 className="text-lg font-bold">{exp.title}</h3>
                <p className="text-gray-700">{exp.company}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(exp.from).toLocaleDateString()} - 
                  {exp.current ? ' Present' : new Date(exp.to).toLocaleDateString()}
                </p>
                <p className="mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No experience listed</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Education</h2>
        {profile.education && profile.education.length > 0 ? (
          <div>
            {profile.education.map((edu, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0">
                <h3 className="text-lg font-bold">{edu.school}</h3>
                <p className="text-gray-700">{edu.degree} in {edu.fieldOfStudy}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(edu.from).toLocaleDateString()} - 
                  {edu.current ? ' Present' : new Date(edu.to).toLocaleDateString()}
                </p>
                <p className="mt-2">{edu.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No education listed</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
