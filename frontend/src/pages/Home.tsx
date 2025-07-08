import React, { useState } from 'react';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');

  const createEndpoint = async () => {
    setLoading(true);
    const res = await fetch('/api/endpoints', { method: 'POST' });
    const data = await res.json();
    setLoading(false);
    setEndpointUrl(`${window.location.origin}/endpoint/${data.uuid}`);
  };

  return (
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p>Generate a unique capture URL to inspect webhook payloads.</p>
      <textarea
        className="url-box"
        readOnly
        value={endpointUrl}
        placeholder="Click 'Generate URL' to create an endpoint"
      />
      <button onClick={createEndpoint} disabled={loading} className="btn">
        {loading && <span className="loading-spinner" />} {loading ? 'Creating...' : 'Generate URL'}
      </button>
    </div>
  );
};

export default Home;
