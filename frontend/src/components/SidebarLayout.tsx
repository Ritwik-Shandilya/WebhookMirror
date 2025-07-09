import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();

  const startTesting = async () => {
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
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <Link to="/" className="site-logo">
            <img src="/logo.svg" alt="WebhookMirror logo" className="logo-img" />
            <span className="logo-text">Webhook Mirror</span>
          </Link>
        </div>
        <button className="nav-item" onClick={startTesting}>Start Testing</button>
        <Link to="/dashboard" className="nav-item">Dashboard</Link>
        <Link to="/api-test" className="nav-item">API Tester</Link>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
