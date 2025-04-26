const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestion.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @route   POST /api/suggestions
// @desc    Get text suggestions from DeepSeek
// @access  Private
router.post('/', authMiddleware, suggestionController.getSuggestion);

module.exports = router;
