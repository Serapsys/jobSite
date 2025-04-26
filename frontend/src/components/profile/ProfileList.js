import React, { useContext, useEffect, useState } from 'react';
import ProfileContext from '../../context/profile/profileContext';
import AuthContext from '../../context/auth/authContext';
import ProfileModal from './ProfileModal';

const ProfileList = () => {
  const profileContext = useContext(ProfileContext);
  const authContext = useContext(AuthContext);

  const { profiles, getAllProfiles, loading } = profileContext;
  const { user } = authContext;

  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    getAllProfiles();
    // eslint-disable-next-line
  }, []);

  const openProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const closeModal = () => {
    setSelectedProfile(null);
  };

  if (loading) {
    return <div>Loading profiles...</div>;
  }

  // Filter out the current user's profile
  const filteredProfiles = profiles.filter(
    profile => profile.user._id !== user?.id
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Browse Profiles</h1>

      {filteredProfiles.length === 0 ? (
        <div className="card text-center py-10">
          <h2 className="text-xl font-bold mb-4">No profiles found</h2>
          <p>There are no other user profiles available at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProfiles.map(profile => (
            <div key={profile._id} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="mb-4">
                <h2 className="text-xl font-bold">{profile.fullName}</h2>
                <p className="text-gray-600">{profile.user.email}</p>
                {profile.location && <p className="text-gray-600">{profile.location}</p>}
              </div>

              {profile.skills && profile.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap">
                    {profile.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 5 && (
                      <span className="text-sm text-gray-500">+{profile.skills.length - 5} more</span>
                    )}
                  </div>
                </div>
              )}

              {profile.bio && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Bio</h3>
                  <p className="text-gray-700 line-clamp-3">{profile.bio}</p>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => openProfile(profile)}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProfile && (
        <ProfileModal profile={selectedProfile} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProfileList;