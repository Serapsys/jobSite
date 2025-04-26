const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// @route   GET /api/chat
// @desc    Get all chats for current user
// @access  Private
router.get('/', chatController.getMyChats);

// @route   GET /api/chat/:id
// @desc    Get chat by ID
// @access  Private
router.get('/:id', chatController.getChatById);

// @route   POST /api/chat/start
// @desc    Start a new chat
// @access  Private
router.post(
  '/start',
  [
    check('participantId', 'Participant ID is required').not().isEmpty()
  ],
  chatController.startChat
);

// @route   POST /api/chat/:id/message
// @desc    Add message to chat
// @access  Private
router.post(
  '/:id/message',
  [
    check('content', 'Message content is required').not().isEmpty()
  ],
  chatController.addMessage
);

module.exports = router;
