import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileContext from '../../context/profile/profileContext';
import AlertContext from '../../context/alert/alertContext';
import TextSuggestion from '../suggestions/TextSuggestion';

const EditProfile = () => {
  const navigate = useNavigate();
  const profileContext = useContext(ProfileContext);
  const alertContext = useContext(AlertContext);

  const { profile, createProfile, getMyProfile, loading } = profileContext;
  const { setAlert } = alertContext;

  useEffect(() => {
    getMyProfile();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (profile && !loading) {
      setFormData({
        fullName: profile.fullName || '',
        bio: profile.bio || '',
        skills: profile.skills ? profile.skills.join(', ') : '',
        location: profile.location || '',
        contactEmail: profile.contactInfo ? profile.contactInfo.email || '' : '',
        contactPhone: profile.contactInfo ? profile.contactInfo.phone || '' : '',
      });
    }
  }, [profile, loading]);

  const [formData, setFormData] = useState({
    fullName: '',
    bio: '',
    skills: '',
    location: '',
    contactEmail: '',
    contactPhone: '',
  });

  const { fullName, bio, skills, location, contactEmail, contactPhone } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (!fullName) {
      setAlert('Full name is required', 'danger');
      return;
    }

    createProfile({
      fullName,
      bio,
      skills: skills.split(',').map(skill => skill.trim()).filter(skill => skill !== ''),
      location,
      contactInfo: {
        email: contactEmail,
        phone: contactPhone
      }
    });

    navigate('/profile');
  };

  if (loading && !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{profile ? 'Edit Profile' : 'Create Profile'}</h1>

      <div className="card">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">
              Full Name*
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={fullName}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="bio">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={bio}
              onChange={onChange}
              className="form-input h-24"
              placeholder="Tell us about yourself"
            />
            <TextSuggestion text={bio} fieldName="bio" setFormData={setFormData} formData={formData} />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skills">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              id="skills"
              value={skills}
              onChange={onChange}
              className="form-input"
              placeholder="JavaScript, React, Node.js, etc. (comma separated)"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={onChange}
              className="form-input"
              placeholder="e.g., New York, NY"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contactEmail">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              value={contactEmail}
              onChange={onChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contactPhone">
              Contact Phone
            </label>
            <input
              type="text"
              name="contactPhone"
              id="contactPhone"
              value={contactPhone}
              onChange={onChange}
              className="form-input"
            />
          </div>

          <div className="flex gap-4 justify-end">
            <button type="button" onClick={() => navigate('/profile')} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
