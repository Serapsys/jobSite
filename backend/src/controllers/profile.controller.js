const Profile = require('../models/Profile');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['username', 'email', 'role']);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/profile
// @desc    Create or update a user profile
// @access  Private
exports.createUpdateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName,
    bio,
    skills,
    location,
    experience,
    education,
    contactInfo,
    resume
  } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    fullName,
    bio,
    location,
    updatedAt: Date.now()
  };

  if (skills) {
    profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => skill.trim());
  }

  if (experience) profileFields.experience = experience;
  if (education) profileFields.education = education;
  if (contactInfo) profileFields.contactInfo = contactInfo;
  if (resume) profileFields.resume = resume;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/profile/:id
// @desc    Get profile by user ID
// @access  Public
exports.getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.id }).populate('user', ['username', 'email', 'role']);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET /api/profile/all
// @desc    Get all profiles
// @access  Public
exports.getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['username', 'email', 'role']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fullName,
    bio,
    skills,
    location,
    experience,
    education,
    contactInfo,
    resume
  } = req.body;

  // Build profile object
  const profileFields = {
    user: req.user.id,
    fullName,
    bio,
    location,
    updatedAt: Date.now()
  };

  if (skills) {
    profileFields.skills = Array.isArray(skills)
      ? skills
      : skills.split(',').map(skill => skill.trim());
  }

  if (experience) profileFields.experience = experience;
  if (education) profileFields.education = education;
  if (contactInfo) profileFields.contactInfo = contactInfo;
  if (resume) profileFields.resume = resume;

  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
