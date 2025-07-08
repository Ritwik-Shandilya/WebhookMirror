import React, { useState, useEffect } from 'react';

interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);

  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [apiHeaders, setApiHeaders] = useState<Record<string, string> | null>(null);

  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{status: number; headers: Record<string,string>; body: string} | null>(null);

  const apiOrigin =
    (import.meta as any).env.VITE_API_ORIGIN ||
    window.location.origin.replace(':5173', ':3000');

  const createEndpoint = async () => {
    setLoading(true);
    setApiStatus(null);
    setApiHeaders(null);
    try {
      const res = await fetch('/api/endpoints', { method: 'POST' });
      const data = await res.json();
      setCaptureUrl(`${apiOrigin}/${data.uuid}`);
      setEndpointUrl(`${window.location.origin}/endpoint/${data.uuid}`);
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

  const testApi = async () => {
    if (!testUrl) return;
    try {
      const res = await fetch(testUrl);
      const body = await res.text();
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
      setTestResult({ status: res.status, headers: headersObj, body });
    } catch (err) {
      setTestResult({ status: 0, headers: {}, body: 'Request failed' });
    }
  };

  return (
    <div className="container">
      <h1 className="header">Webhook Mirror</h1>
      <p>Generate a unique capture URL to inspect webhook payloads.</p>
      <textarea
        className="url-box"
        readOnly
        value={captureUrl}
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
      <div className="api-test mt-4">
        <h2 className="header">Test an API</h2>
        <input
          className="url-box"
          type="text"
          value={testUrl}
          onChange={e => setTestUrl(e.target.value)}
          placeholder="https://example.com/api"
        />
        <button onClick={testApi} className="btn mt-2">Send Test Request</button>
        {testResult && (
          <div className="status mt-2">
            <p>Status: {testResult.status}</p>
            <pre className="headers">{JSON.stringify(testResult.headers, null, 2)}</pre>
            <pre className="headers">{testResult.body}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
