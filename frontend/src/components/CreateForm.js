import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { formService } from '../services/api';
import './CreateForm.css';

const CreateForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: [
      { text: '', type: 'text', options: [] }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][field] = value;
    
    if (field === 'type' && value === 'text') {
      updatedQuestions[index].options = [];
    }
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { text: '', type: 'text', options: [] }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (formData.questions.some(q => !q.text.trim())) {
      setError('All questions must have text');
      setLoading(false);
      return;
    }

    if (formData.questions.some(q => q.type === 'multiple-choice' && q.options.length < 2)) {
      setError('Multiple choice questions must have at least 2 options');
      setLoading(false);
      return;
    }

    try {
      await formService.createForm(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="create-form">
      <div className="floating-shapes"></div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="glass-card slide-in">
        <div className="form-group">
          <label htmlFor="title">📝 Form Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a catchy title for your form"
            className="form-input"
            required
          /></div>

        <div className="form-group">
          <label htmlFor="description">📄 Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Provide a brief description of your form"
            className="form-input"
            rows="3"
          />
        </div>

        <div className="questions-section">
          <h3>❓ Questions</h3>
          {formData.questions.map((question, index) => (
            <div key={index} className="question-item glass-card">
              <div className="question-header">
                <span>📋 Question {index + 1}</span>
                {formData.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="btn btn-outline btn-small"
                    style={{color: 'var(--error-color)'}}
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Question Text:</label>
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Question Type:</label>
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="multiple-choice">Multiple Choice</option>
                </select>
              </div>

              {question.type === 'multiple-choice' && (
                <div className="options-section">
                  <label>Options:</label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-item">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      {question.options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index, optionIndex)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"                    onClick={() => addOption(index)}
                    className="btn btn-secondary btn-small"
                  >
                    ➕ Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn btn-secondary"
          >
            ➕ Add Question
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn btn-primary pulse">
            {loading ? '🚀 Creating...' : '✨ Create Form'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
