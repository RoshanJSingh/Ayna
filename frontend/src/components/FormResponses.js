import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { formService, responseService } from '../services/api';
import './FormResponses.css';

const FormResponses = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadFormAndResponses();
  }, [id, user, navigate]);

  const loadFormAndResponses = async () => {
    try {
      const [formData, responsesData] = await Promise.all([
        formService.getForm(id),
        responseService.getFormResponses(id)
      ]);
      
      setForm(formData);
      setResponses(responsesData);
    } catch (err) {
      setError('Failed to load form responses');
    } finally {
      setLoading(false);
    }
  };

  const getAnswerForQuestion = (response, questionId) => {
    const answer = response.answers.find(a => a.questionId === questionId);
    return answer ? answer.answer : 'No answer';
  };
  const exportToCSV = async () => {
    if (!form || !responses.length) {
      alert('No responses to export');
      return;
    }
    
    try {
      await responseService.exportFormResponses(id, form.title);
      alert('CSV exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV');
    }
  };

  if (loading) return <div className="loading">Loading responses...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="form-responses">      <header className="responses-header">
        <h1>📊 Responses for: {form?.title}</h1>
        <div className="header-actions">
          <button onClick={exportToCSV} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="responses-stats">
        <div className="stat-card">
          <h3>Total Responses</h3>
          <p>{responses.length}</p>
        </div>
        <div className="stat-card">
          <h3>Form URL</h3>
          <p>
            <button 
              onClick={() => {
                const url = `${window.location.origin}/form/${id}`;
                navigator.clipboard.writeText(url);
                alert('Form URL copied to clipboard!');
              }}
              className="btn btn-link"
            >
              Copy Link
            </button>
          </p>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="no-responses">
          <p>No responses yet. Share your form link to start collecting feedback!</p>
        </div>
      ) : (
        <div className="responses-container">
          <h2>All Responses</h2>
          <div className="responses-table">
            <table>
              <thead>
                <tr>
                  <th>Submitted At</th>
                  {form.questions.map(question => (
                    <th key={question._id}>{question.text}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {responses.map(response => (
                  <tr key={response._id}>
                    <td>{new Date(response.submittedAt).toLocaleString()}</td>
                    {form.questions.map(question => (
                      <td key={question._id}>
                        {getAnswerForQuestion(response, question._id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
