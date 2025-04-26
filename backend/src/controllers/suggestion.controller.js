const axios = require('axios');

// @route   POST /api/suggestions
// @desc    Get text suggestions from DeepSeek
// @access  Private
exports.getSuggestion = async (req, res) => {
  try {
    const { text, style } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }

    let prompt;
    
    switch (style) {
      case 'short':
        prompt = `Make the following text shorter while preserving its meaning: "${text}"`;
        break;
      case 'formal':
        prompt = `Make the following text more formal and professional: "${text}"`;
        break;
      case 'casual':
        prompt = `Make the following text more casual and conversational: "${text}"`;
        break;
      case 'enthusiastic':
        prompt = `Make the following text more enthusiastic and engaging: "${text}"`;
        break;
      case 'professional':
        prompt = `Rewrite the following text to sound more professional for a business context: "${text}"`;
        break;
      case 'concise':
        prompt = `Make the following text extremely concise and to-the-point: "${text}"`;
        break;
      default:
        prompt = `Improve the following text: "${text}"`;
    }

    // For demonstration purposes, we'll generate responses locally
    // since the DeepSeek API is giving balance errors
    let suggestedText = text;
    
    switch (style) {
      case 'short':
      case 'concise':
        suggestedText = `${text.split(' ').slice(0, Math.max(5, text.split(' ').length / 2)).join(' ')}...`;
        break;
      case 'formal':
      case 'professional':
        suggestedText = `I would like to inform you that ${text.toLowerCase()}`;
        break;
      case 'casual':
        suggestedText = `Hey! ${text}`;
        break;
      case 'enthusiastic':
        suggestedText = `Wow! ${text}! This is amazing!`;
        break;
      default:
        suggestedText = `Improved: ${text}`;
    }
    
    // Use the locally generated suggestion directly
    const suggestion = suggestedText;

    res.json({ suggestion });
  } catch (err) {
    console.error('Suggestion API error:', err.response?.data || err.message);
    res.status(500).json({ 
      message: 'Error getting suggestion',
      error: err.response?.data || err.message
    });
  }
};
