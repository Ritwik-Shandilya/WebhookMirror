import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SiteHeader: React.FC = () => {
  const navigate = useNavigate();

  const createEndpoint = async () => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
      const data = await res.json();
      if (!data.uuid) throw new Error('Invalid response');
      navigate(`/endpoint/${data.uuid}`);
    } catch (err) {
      alert('Failed to create endpoint. Is the backend running?');
    }
  };

  return (
    <header className="site-header">
      <div className="site-logo">Webhook Mirror</div>
      <div className="nav-links">
        <button className="start-btn" onClick={createEndpoint}>Start Testing</button>
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/api-test" className="btn">API Tester</Link>
      </div>
    </header>
  );
};

export default SiteHeader;
