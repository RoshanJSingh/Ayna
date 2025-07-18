import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { formService, responseService } from '../services/api';
import './PublicForm.css';

const PublicForm = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      const formData = await formService.getForm(id);
      setForm(formData);
      
      const initialResponses = {};
      formData.questions.forEach(question => {
        initialResponses[question._id] = '';
      });
      setResponses(initialResponses);
    } catch (err) {
      setError('Form not found or inactive');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const answers = Object.entries(responses)
      .filter(([_, answer]) => answer.trim())
      .map(([questionId, answer]) => ({
        questionId,
        answer
      }));

    if (answers.length === 0) {
      setError('Please answer at least one question');
      setSubmitting(false);
      return;
    }

    try {
      await responseService.submitResponse({
        formId: id,
        answers
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return <div className="loading">✨ Loading form...</div>;
  if (error && !form) return <div className="error-message">{error}</div>;
  if (submitted) {
    return (
      <div className="public-form">
        <div className="floating-shapes"></div>
        <div className="success-container glass-card fade-in">
          <div className="success-icon">🎉</div>
          <h2>Thank you!</h2>
          <p>Your response has been submitted successfully. We appreciate your feedback!</p>
          <div className="celebration-animation">✨</div>
        </div>
      </div>
    );
  }

  return (
    <div className="public-form">
      <div className="floating-shapes"></div>
      <div className="form-container glass-card fade-in">
        <h1>📋 {form.title}</h1>
        {form.description && <p className="form-description">💭 {form.description}</p>}
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {form.questions.map((question, index) => (
            <div key={question._id} className="question-container slide-in">
              <label className="question-label">
                {index + 1}. {question.text}
              </label>
              
              {question.type === 'text' ? (
                <textarea
                  value={responses[question._id]}
                  onChange={(e) => handleResponseChange(question._id, e.target.value)}
                  className="text-input"
                  rows="3"
                />
              ) : (
                <div className="multiple-choice-options">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="option-label">
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={responses[question._id] === option}
                        onChange={(e) => handleResponseChange(question._id, e.target.value)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
            <button type="submit" disabled={submitting} className="btn btn-primary pulse">
            {submitting ? '🚀 Submitting...' : '✨ Submit Response'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;
