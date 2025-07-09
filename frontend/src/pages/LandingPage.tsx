import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [expiresAt, setExpiresAt] = React.useState('');

  const createEndpoint = async () => {
    const res = await fetch('/api/endpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expires_at: expiresAt || null })
    });
    const data = await res.json();
    navigate(`/endpoint/${data.uuid}`);
  };

  return (
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p className="mb-4">Capture and inspect HTTP requests in real time.</p>
      <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
        <input
          type="datetime-local"
          className="url-box"
          value={expiresAt}
          onChange={e => setExpiresAt(e.target.value)}
          placeholder="Expiry (optional)"
        />
        <button className="btn" onClick={createEndpoint}>Create new endpoint</button>
      </div>
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
