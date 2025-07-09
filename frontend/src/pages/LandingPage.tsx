import React, { useState } from 'react';
import WebhookPage from './WebhookPage';
import ApiTesterPage from './ApiTesterPage';

const LandingPage: React.FC = () => {
  const [active, setActive] = useState<'webhook' | 'api'>('webhook');

  return (
      <div className="layout">
        <div className="sidebar">
          <div
            className={`nav-item ${active === 'webhook' ? 'active' : ''}`}
            onClick={() => setActive('webhook')}
          >
            Webhook Endpoint
          </div>
          <div
            className={`nav-item ${active === 'api' ? 'active' : ''}`}
            onClick={() => setActive('api')}
          >
            API Testing
          </div>
        </div>
      <div className="main-content">
        {active === 'webhook' && <WebhookPage />}
        {active === 'api' && <ApiTesterPage />}
      </div>
    </div>
  );
};

export default LandingPage;
