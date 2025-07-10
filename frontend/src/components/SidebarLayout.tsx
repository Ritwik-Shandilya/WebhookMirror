import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<Props> = ({ children }) => {

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <Link to="/" className="site-logo">
            <img src="/logo.svg" alt="WebhookMirror logo" className="logo-img" />
            <span className="logo-text">Webhook Mirror</span>
          </Link>
        </div>
        <Link to="/webhook" className="nav-item">Start Testing</Link>
        <Link to="/" className="nav-item">Home</Link>
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
