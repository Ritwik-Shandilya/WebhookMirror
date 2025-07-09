import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => (
  <div className="container">
    <h1 className="header">Webhook Mirror</h1>
    <p className="mb-4">WebhookMirror helps you debug webhooks and test APIs. Choose a tool below to get started.</p>
    <Link to="/webhook" className="option-card block mb-2">
      <h2>Webhook Endpoint</h2>
      <p>Generate a unique URL to capture and inspect webhook requests.</p>
    </Link>
    <Link to="/api-test" className="option-card block">
      <h2>API Tester</h2>
      <p>Send simple HTTP requests and view the responses instantly.</p>
    </Link>
  </div>
);

export default LandingPage;
