import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@bigbinary/neetoui';
import SidebarLayout from '../components/SidebarLayout';

const LandingPage: React.FC = () => {
  const history = useHistory();
  const [expiresAt, setExpiresAt] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const createEndpoint = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: expiresAt || null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
      const data = await res.json();
      if (!data.uuid) throw new Error('Invalid response');
      history.push(`/endpoint/${data.uuid}`);
    } catch (err) {
      alert('Failed to create endpoint. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="landing-container">
        {/* Header with Start Testing button */}
        <div className="landing-header">
          <div className="header-content">
            <h1 className="hero-title">Webhook Mirror</h1>
            <p className="hero-subtitle">Capture and inspect HTTP requests in real time with our powerful webhook testing tool</p>
          </div>
          <Button 
            onClick={() => history.push('/webhook')} 
            className="start-testing-btn"
            variant="primary"
          >
            Start Testing
          </Button>
        </div>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h2 className="section-title">Create Your First Endpoint</h2>
              <p className="section-description">
                Generate a unique webhook endpoint to capture and inspect HTTP requests. 
                Perfect for testing integrations, debugging webhooks, and monitoring API calls.
              </p>
            </div>
            
            <div className="endpoint-creator">
              <div className="creator-card">
                <div className="creator-header">
                  <h3 className="creator-title">Quick Setup</h3>
                  <p className="creator-subtitle">Create an endpoint in seconds</p>
                </div>
                
                <div className="creator-form">
                  <div className="form-group">
                    <label className="form-label">Expiry Time (Optional)</label>
                    <input
                      type="datetime-local"
                      className="form-input"
                      value={expiresAt}
                      onChange={e => setExpiresAt(e.target.value)}
                      placeholder="Set expiry date"
                    />
                  </div>
                  
                  <Button 
                    onClick={createEndpoint} 
                    disabled={loading}
                    className="create-btn"
                    variant="primary"
                  >
                    {loading ? 'Creating...' : 'Create Endpoint'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Webhook Mirror?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="feature-title">Real-time Capture</h3>
              <p className="feature-description">
                Instantly capture and view HTTP requests as they arrive at your webhook endpoints
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Request Inspector</h3>
              <p className="feature-description">
                Detailed inspection of headers, body, query parameters, and cookies for each request
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="feature-title">Export & Share</h3>
              <p className="feature-description">
                Export requests as JSON and copy as cURL commands for easy sharing and testing
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Instant Setup</h3>
              <p className="feature-description">
                No registration required. Create endpoints instantly and start capturing requests immediately
              </p>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="how-it-works-section">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Endpoint</h3>
              <p className="step-description">
                Generate a unique webhook URL that will capture all incoming HTTP requests
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Send Requests</h3>
              <p className="step-description">
                Use the generated URL in your applications, APIs, or testing tools to send requests
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Inspect & Debug</h3>
              <p className="step-description">
                View real-time request details, headers, body content, and export for further analysis
              </p>
            </div>
          </div>
        </div>

        {/* Example Section */}
        <div className="example-section">
          <h2 className="section-title">Example Usage</h2>
          <div className="example-card">
            <div className="example-header">
              <h3 className="example-title">cURL Example</h3>
              <span className="example-badge">POST</span>
            </div>
            <pre className="example-code">
{`curl -X POST https://your-domain.com/your-endpoint-id \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello Webhook Mirror!"}'`}
            </pre>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default LandingPage;
