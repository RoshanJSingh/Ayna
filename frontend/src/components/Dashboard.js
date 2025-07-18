import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { formService, responseService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      const [formsData, dashboardInfo] = await Promise.all([
        formService.getForms(),
        responseService.getDashboard()
      ]);
      
      setForms(formsData);
      setDashboardData(dashboardInfo);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const deleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await formService.deleteForm(formId);
        loadDashboardData();
      } catch (err) {
        setError('Failed to delete form');
      }
    }
  };

  const getFormUrl = (formId) => {
    return `${window.location.origin}/form/${formId}`;
  };

  const exportFormResponses = async (formId, formTitle) => {
    try {
      const responseCount = dashboardData?.formStats?.find(stat => stat.formId === formId)?.responseCount || 0;
      
      if (responseCount === 0) {
        alert('No responses to export for this form');
        return;
      }
      
      await responseService.exportFormResponses(formId, formTitle);
      alert('CSV exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Form URL copied to clipboard!');
  };

  if (loading) return <div className="loading">Loading...</div>;  return (
    <div className="dashboard">
      <div className="floating-shapes"></div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card glass-card slide-in">
          <h3>📋 Total Forms</h3>
          <p>{dashboardData?.totalForms || 0}</p>
        </div>
        <div className="stat-card glass-card slide-in">
          <h3>💬 Total Responses</h3>
          <p>{dashboardData?.totalResponses || 0}</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/create-form" className="btn btn-primary pulse">
          ✨ Create New Form
        </Link>
      </div>

      <div className="forms-section">
        <h2>📝 Your Forms</h2>
        {forms.length === 0 ? (
          <div className="empty-state glass-card">
            <p>🎨 You haven't created any forms yet. Start by creating your first form!</p>
          </div>) : (
          <div className="forms-grid">
            {forms.map(form => (
              <div key={form._id} className="form-card glass-card fade-in">
                <h3>📄 {form.title}</h3>
                <p>{form.description}</p>
                <div className="form-meta">
                  <span>❓ Questions: {form.questions.length}</span>
                  <span>
                    💬 Responses: {dashboardData?.formStats?.find(stat => stat.formId === form._id)?.responseCount || 0}
                  </span>
                </div>                <div className="form-actions">
                  <button 
                    onClick={() => copyToClipboard(getFormUrl(form._id))}
                    className="btn btn-secondary"
                  >
                    🔗 Copy Link
                  </button>
                  <Link 
                    to={`/form/${form._id}/responses`}
                    className="btn btn-secondary"
                  >
                    👁️ View Responses
                  </Link>
                  <button 
                    onClick={() => exportFormResponses(form._id, form.title)}
                    className="btn btn-secondary"
                  >
                    📥 Export CSV
                  </button>
                  <button 
                    onClick={() => deleteForm(form._id)}
                    className="btn btn-outline"
                    style={{color: 'var(--error-color)'}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
