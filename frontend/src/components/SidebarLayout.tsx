import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@bigbinary/neetoui/layouts';
import { Home, List, Code, Plus } from '@bigbinary/neeto-icons';

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

  const navLinks = [
    { label: 'Start Testing', to: '#', icon: Plus, onClick: startTesting },
    { label: 'Home', to: '/', icon: Home },
    { label: 'Dashboard', to: '/dashboard', icon: List },
    { label: 'API Tester', to: '/api-test', icon: Code }
  ];

  return (
    <div className="layout">
      <Sidebar
        navLinks={navLinks}
        organizationInfo={{ logo: () => <img src="/logo.svg" alt="WebhookMirror" className="logo-img" /> }}
        tooltipStyle="default"
      />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
