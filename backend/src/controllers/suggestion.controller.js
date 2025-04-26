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
      default:
        prompt = `Improve the following text: "${text}"`;
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that improves text based on specific styles.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    // Extract the suggestion from the response
    const suggestion = response.data.choices[0].message.content;

    res.json({ suggestion });
  } catch (err) {
    console.error('Suggestion API error:', err.response?.data || err.message);
    res.status(500).json({ 
      message: 'Error getting suggestion',
      error: err.response?.data || err.message
    });
  }
};
