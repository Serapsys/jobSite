const Chat = require('../models/Chat');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @route   GET /api/chat
// @desc    Get all chats for the current user
// @access  Private
exports.getMyChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
      .populate('participants', ['username', 'email'])
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/chat/:id
// @desc    Get chat by ID
// @access  Private
exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', ['username', 'email'])
      .populate('messages.sender', ['username', 'email']);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the current user is a participant
    if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   POST /api/chat/start
// @desc    Start a new chat
// @access  Private
exports.startChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { participantId, initialMessage } = req.body;

    // Check if the other user exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a chat already exists between these users
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] }
    });

    if (existingChat) {
      // Add message to existing chat
      if (initialMessage) {
        existingChat.messages.push({
          sender: req.user.id,
          content: initialMessage
        });
        existingChat.updatedAt = Date.now();
        await existingChat.save();
      }
      
      return res.json(existingChat);
    }

    // Create new chat
    const newChat = new Chat({
      participants: [req.user.id, participantId],
      messages: initialMessage ? [{
        sender: req.user.id,
        content: initialMessage
      }] : []
    });

    await newChat.save();
    res.json(newChat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/chat/:id/message
// @desc    Add message to chat
// @access  Private
exports.addMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { content } = req.body;
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if the current user is a participant
    if (!chat.participants.some(p => p.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to access this chat' });
    }

    // Add message
    chat.messages.push({
      sender: req.user.id,
      content
    });
    chat.updatedAt = Date.now();

    await chat.save();
    res.json(chat);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Chat not found' });
    }
    res.status(500).send('Server error');
  }
};
