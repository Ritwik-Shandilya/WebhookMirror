import React from 'react';
import { Link } from 'react-router-dom';

const SiteHeader: React.FC = () => {
  // Navigation links moved to SidebarLayout

  return (
    <header className="site-header">
      <Link to="/" className="site-logo" title="WebhookMirror home">
        <img src="/logo.svg" alt="WebhookMirror logo" className="logo-img" />
        <span className="logo-text">Webhook Mirror</span>
      </Link>
    </header>
  );
};

export default SiteHeader;
