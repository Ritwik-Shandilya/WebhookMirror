import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@bigbinary/neetoui';
import SidebarLayout from '../components/SidebarLayout';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [expiresAt, setExpiresAt] = React.useState('');

  const createEndpoint = async () => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: expiresAt || null })
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
    <SidebarLayout>
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p className="mb-4">Capture and inspect HTTP requests in real time.</p>
      <div
        className="mb-4 flex"
        style={{ gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}
      >
        <div>
          <label className="block mb-1">Select expiry time</label>
          <input
            type="datetime-local"
            className="url-box"
            style={{ width: '220px' }}
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            placeholder="Expiry (optional)"
          />
        </div>
        <Button label="Create new endpoint" style="primary" onClick={createEndpoint} />
      </div>
      <p className="mb-2">Example curl command:</p>
      <pre className="code-box">{`curl -X POST http://localhost:3000/<endpoint-id> -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>

      <h2 className="text-xl font-semibold mt-4 mb-2">Features</h2>
      <ul className="text-left mb-4" style={{ marginLeft: '1.5rem' }}>
        <li>Sidebar navigation with quick access to Start Testing, Dashboard and API Tester</li>
        <li>Export captured requests to JSON</li>
        <li>Clear all requests for an endpoint</li>
        <li>Copy any request as a cURL command</li>
      </ul>

      <h2 className="text-xl font-semibold mb-2">How it works</h2>
      <ol className="text-left" style={{ marginLeft: '1.5rem' }}>
        <li>Create a unique endpoint using the form above</li>
        <li>Send HTTP requests from your service to that endpoint</li>
        <li>Inspect the requests here in real time</li>
      </ol>
    </div>
    </SidebarLayout>
  );
};

export default LandingPage;
