import React, { useState } from 'react';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiHeaders, setApiHeaders] = useState<Record<string, string> | null>(null);

  const createEndpoint = async () => {
    setLoading(true);
    setApiStatus(null);
    setApiHeaders(null);
    try {
      const res = await fetch('/api/endpoints', { method: 'POST' });
      const data = await res.json();
      setEndpointUrl(`${window.location.origin}/${data.uuid}`);
      setApiStatus(`Success: ${res.status}`);
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
      setApiHeaders(headersObj);
    } catch (err) {
      setApiStatus('Error creating endpoint');
    } finally {
      setLoading(false);
    }
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
      {endpointUrl && (
        <div className="link-box">
          <a href={endpointUrl} target="_blank" rel="noopener noreferrer">
            Open endpoint
          </a>
        </div>
      )}
      <button onClick={createEndpoint} disabled={loading} className="btn">
        {loading && <span className="loading-spinner" />} {loading ? 'Creating...' : 'Generate URL'}
      </button>
      {apiStatus && (
        <div className="status">
          <p>{apiStatus}</p>
          {apiHeaders && (
            <pre className="headers">{JSON.stringify(apiHeaders, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
