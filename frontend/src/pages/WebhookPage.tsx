import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';

interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

const WebhookPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [curlUrl, setCurlUrl] = useState('');
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);
  const [expiresAt, setExpiresAt] = useState('');
  const [uuidInput, setUuidInput] = useState('');
  const [loaded, setLoaded] = useState(false);

  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiHeaders, setApiHeaders] = useState<Record<string, string> | null>(null);


  const handleOpen = async () => {
    setLoading(true);
    setApiStatus(null);
    setApiHeaders(null);
    try {
      let res: Response;
      if (uuidInput.trim()) {
        res = await fetch(`/api/endpoints/by_uuid/${uuidInput.trim()}`);
      } else {
        res = await fetch('/api/endpoints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ expires_at: expiresAt || null })
        });
      }
      if (!res.ok) throw new Error('Failed to load endpoint');
      const data = await res.json();
      const { protocol, hostname, origin } = window.location;
      setCaptureUrl(`${origin}/${data.uuid}`);
      setEndpointUrl(`${origin}/endpoint/${data.uuid}`);
      const curlBase = hostname === 'localhost'
        ? `${protocol}//${hostname}:3000`
        : origin;
      setCurlUrl(`${curlBase}/${data.uuid}`);
      setEndpointId(data.id);
      setApiStatus(`Success: ${res.status}`);
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => { headersObj[k] = v; });
      setApiHeaders(headersObj);
      setUuidInput(data.uuid);
      setLoaded(true);
    } catch (err) {
      setApiStatus('Error loading endpoint');
    } finally {
      setLoading(false);
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
      <h1 className="header">Start Testing</h1>
      <p className="mb-4">Enter an existing endpoint ID or leave blank to create a new one.</p>
      <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'flex-end', justifyContent: 'center'}}>
        <input
          type="text"
          className="url-box"
          style={{ width: '220px' }}
          value={uuidInput}
          onChange={e => setUuidInput(e.target.value)}
          placeholder="Endpoint ID (optional)"
        />
        <button onClick={handleOpen} disabled={loading} className="btn">
          {loading ? 'Loading...' : 'Open endpoint'}
        </button>
      </div>
      {loaded && (
        <>
        <textarea
          className="url-box"
          readOnly
          value={captureUrl}
          placeholder="Endpoint URL will appear here"
        />
        {endpointUrl && (
          <div className="link-box mb-4">
            <button onClick={openEndpoint} className="btn">Open endpoint</button>
          </div>
        )}
        <div className="curl-examples mb-4">
          <p className="font-semibold">Example curl POST request</p>
          <pre className="code-box">{`curl -X POST ${curlUrl} -H \"Content-Type: application/json\" -d '{"hello":"world"}'`}</pre>
          <p className="font-semibold mt-2">Example curl GET request</p>
          <pre className="code-box">{`curl ${curlUrl}`}</pre>
        </div>
        <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
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
          <button onClick={handleOpen} disabled={loading} className="btn">
            {loading ? 'Generating...' : 'Generate new URL'}
          </button>
        </div>
        </>
      )}
      {loaded && apiStatus && (
        <div className="status mb-4">
          <p>{apiStatus}</p>
          {apiHeaders && (
            <pre className="headers">{JSON.stringify(apiHeaders, null, 2)}</pre>
          )}
        </div>
      )}
      {endpointId && (
        <div className="requests" style={{marginTop: '2rem'}}>
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
