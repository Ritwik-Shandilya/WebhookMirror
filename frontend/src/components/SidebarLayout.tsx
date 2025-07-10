import React from 'react';
import { NavLink, Link } from 'react-router-dom';

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
        <NavLink to="/webhook" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>Start Testing</NavLink>
        <NavLink to="/" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>Home</NavLink>
        <NavLink to="/dashboard" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>Dashboard</NavLink>
        <NavLink to="/api-test" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>API Tester</NavLink>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
