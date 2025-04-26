const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET /api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authMiddleware, profileController.getMyProfile);

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    [
      check('fullName', 'Full name is required').not().isEmpty()
    ]
  ],
  profileController.createUpdateProfile
);

// @route   GET /api/profile
// @desc    Get current user's profile (alternative route)
// @access  Private
router.get('/', authMiddleware, profileController.getMyProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/',
  [
    authMiddleware,
    [
      check('fullName', 'Full name is required').not().isEmpty()
    ]
  ],
  profileController.updateProfile
);

// @route   GET /api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', profileController.getAllProfiles);

// @route   GET /api/profile/:id
// @desc    Get profile by user ID
// @access  Public
router.get('/:id', profileController.getProfileById);

module.exports = router;
