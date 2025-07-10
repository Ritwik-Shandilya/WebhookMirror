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
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/webhook" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Start Testing</span>
          </NavLink>
          
          <NavLink to="/dashboard" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/api-test" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}>
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>API Tester</span>
          </NavLink>
        </nav>
      </div>
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
