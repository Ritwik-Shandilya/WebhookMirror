import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const createEndpoint = async () => {
    const res = await fetch('/api/endpoints', { method: 'POST' });
    const data = await res.json();
    navigate(`/endpoint/${data.uuid}`);
  };

  return (
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p className="mb-4">Capture and inspect HTTP requests in real time.</p>
      <button className="btn mb-4" onClick={createEndpoint}>Create new endpoint</button>
      <p className="mb-2">Example curl command:</p>
      <pre className="code-box">{`curl -X POST http://localhost:3000/<endpoint-id> -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
      <div className="mt-4 space-x-2">
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/api-test" className="btn">API Tester</Link>
      </div>
    </div>
  );
};

export default LandingPage;
