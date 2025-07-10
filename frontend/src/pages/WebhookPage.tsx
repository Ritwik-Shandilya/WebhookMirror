import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';

interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

const WebhookPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [curlUrl, setCurlUrl] = useState('');
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [existingUuid, setExistingUuid] = useState('');

  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiHeaders, setApiHeaders] = useState<Record<string, string> | null>(null);


  const createEndpoint = async () => {
    setLoading(true);
    setApiStatus(null);
    setApiHeaders(null);
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: expiresAt || null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
      const data = await res.json();
      const { protocol, hostname, origin } = window.location;
      // Display URLs should use the current origin (5173 when running locally)
      setCaptureUrl(`${origin}/${data.uuid}`);
      setEndpointUrl(`${origin}/endpoint/${data.uuid}`);
      // Curl commands hit the Rails API on port 3000 during development
      const curlBase = hostname === 'localhost'
        ? `${protocol}//${hostname}:3000`
        : origin;
      setCurlUrl(`${curlBase}/${data.uuid}`);
      setEndpointId(data.id);
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

  const openExisting = () => {
    if (existingUuid.trim()) {
      navigate(`/endpoint/${existingUuid.trim()}`);
    }
  };

  const openEndpoint = () => {
    if (endpointUrl) {
      window.open(endpointUrl, '_blank');
    }
  };

  const loadRequests = async () => {
    if (!endpointId) return;
    const res = await fetch(`/api/endpoints/${endpointId}/requests`);
    const data = await res.json();
    setRequests(data);
  };

  useEffect(() => {
    if (endpointId) {
      loadRequests();
    }
  }, [endpointId]);

  return (
    <SidebarLayout>
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p className="mb-4">WebhookMirror lets you capture and inspect HTTP requests. Generate a unique URL below and send your webhooks to it.</p>
      <div className="mb-2 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
        <input
          type="text"
          className="url-box"
          style={{ width: '220px' }}
          value={existingUuid}
          onChange={e => setExistingUuid(e.target.value)}
          placeholder="Existing endpoint ID"
        />
        <button onClick={openExisting} className="btn">Open</button>
      </div>
      <textarea
        className="url-box"
        readOnly
        value={captureUrl}
        placeholder="Click 'Generate URL' to create an endpoint"
      />
      {endpointUrl && (
        <div className="link-box">
          <button onClick={openEndpoint} className="btn">
            Open endpoint
          </button>
        </div>
      )}
      {captureUrl && (
        <div className="curl-examples">
          <p className="font-semibold">Example curl POST request</p>
          <pre className="code-box">{`curl -X POST ${curlUrl} -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
          <p className="font-semibold mt-2">Example curl GET request</p>
          <pre className="code-box">{`curl ${curlUrl}`}</pre>
        </div>
      )}
      <div className="mb-2 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
        <div className="text-left">
          <label className="block mb-1">Select expiry time</label>
          <input
            type="datetime-local"
            className="url-box"
            value={expiresAt}
            onChange={e => setExpiresAt(e.target.value)}
            placeholder="Expiry (optional)"
          />
        </div>
        <button onClick={createEndpoint} disabled={loading} className="btn">
          {loading && <span className="loading-spinner" />} {loading ? 'Creating...' : 'Generate URL'}
        </button>
      </div>
      {apiStatus && (
        <div className="status">
          <p>{apiStatus}</p>
          {apiHeaders && (
            <pre className="headers">{JSON.stringify(apiHeaders, null, 2)}</pre>
          )}
        </div>
      )}
      {endpointId && (
        <div className="requests">
          <h2 className="header">Requests</h2>
          <button onClick={loadRequests} className="btn mb-2">Refresh</button>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <ul className="space-y-2">
              {requests.map(r => (
                <li key={r.id} className="border rounded p-2 text-sm font-mono">
                  {r.method} - {r.created_at}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
    </SidebarLayout>
  );
};

export default WebhookPage;
