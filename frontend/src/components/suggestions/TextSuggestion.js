import React, { useState } from 'react';
import axios from 'axios';

const TextSuggestion = ({ text, fieldName, setFormData, formData }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');

  const getSuggestion = async (style) => {
    if (!text.trim()) {
      setError('Please enter some text first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/suggestions`,
        { text, style },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );

      setSuggestion(res.data.suggestion);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Error getting suggestion. Please try again.'
      );
      console.error('Suggestion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setFormData({ ...formData, [fieldName]: suggestion });
      setSuggestion('');
    }
  };

  if (!text || text.length < 5) return null;

  return (
    <div className="mt-2">
      <div className="flex flex-wrap gap-2 mb-2 hidden">
        <button
          id="suggestion-short"
          type="button"
          onClick={() => getSuggestion('short')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it shorter
        </button>
        <button
          id="suggestion-formal"
          type="button"
          onClick={() => getSuggestion('formal')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it formal
        </button>
        <button
          id="suggestion-casual"
          type="button"
          onClick={() => getSuggestion('casual')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it casual
        </button>
        <button
          id="suggestion-enthusiastic"
          type="button"
          onClick={() => getSuggestion('enthusiastic')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it enthusiastic
        </button>
        <button
          id="suggestion-professional"
          type="button"
          onClick={() => getSuggestion('professional')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it professional
        </button>
        <button
          id="suggestion-concise"
          type="button"
          onClick={() => getSuggestion('concise')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded"
          disabled={loading}
        >
          Make it concise
        </button>
      </div>

      {loading && <div className="text-sm text-gray-600">Getting suggestions...</div>}
      
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      
      {suggestion && (
        <div className="text-suggestion">
          <h4 className="text-sm font-bold mb-1">Suggestion:</h4>
          <p className="text-sm mb-2">{suggestion}</p>
          <button
            type="button"
            onClick={applySuggestion}
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 py-1 px-2 rounded"
          >
            Apply This Suggestion
          </button>
        </div>
      )}
    </div>
  );
};

export default TextSuggestion;
