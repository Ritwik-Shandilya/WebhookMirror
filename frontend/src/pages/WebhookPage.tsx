import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import RequestInspector from '../components/RequestInspector';
import RequestList from '../components/RequestList';
import { Req } from '../components/RequestListItem';
import SearchInput from '../components/SearchInput';
import LiveIndicator from '../components/LiveIndicator';

const WebhookPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [endpointUrl, setEndpointUrl] = useState('');
  const [captureUrl, setCaptureUrl] = useState('');
  const [curlUrl, setCurlUrl] = useState('');
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Req | null>(null);
  const [expiresAt, setExpiresAt] = useState('');
  const [uuidInput, setUuidInput] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

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
      // For localhost, use port 3000 for the Rails server, otherwise use the current origin
      const endpointBase = hostname === 'localhost'
        ? `${protocol}//${hostname}:3000`
        : origin;
      // The endpoint URL should be the same as the capture URL (just the UUID path)
      setEndpointUrl(`${endpointBase}/${data.uuid}`);
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

  const clearRequests = async () => {
    if (!endpointId) return;
    if (!window.confirm('Clear all requests?')) return;
    await fetch(`/api/endpoints/${endpointId}/requests`, { method: 'DELETE' });
    const res = await fetch(`/api/endpoints/${endpointId}/requests`);
    setRequests(await res.json());
    setSelectedRequest(null);
  };

  const exportRequests = async () => {
    if (!endpointId) return;
    const res = await fetch(`/api/endpoints/${endpointId}/requests`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endpoint-${uuidInput}-requests.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (endpointId) {
      loadRequests();
      const interval = setInterval(loadRequests, 5000);
      return () => clearInterval(interval);
    }
  }, [endpointId]);

  const filtered = requests.filter(r => {
    const matchesMethod = methodFilter ? r.method === methodFilter : true;
    const text = (r.body + JSON.stringify(r.headers)).toLowerCase();
    const matchesSearch = search ? text.includes(search.toLowerCase()) : true;
    return matchesMethod && matchesSearch;
  });

  return (
    <SidebarLayout>
    <div className="container" style={{maxWidth: '1200px'}}>
      <h1 className="header">Start Testing <LiveIndicator /></h1>
      <p className="mb-4">Enter an existing endpoint ID or leave blank to create a new one.</p>
      
      {/* Endpoint Creation Section */}
      <div className="option-card mb-6">
        <h2 className="font-semibold mb-4">Create or Open Endpoint</h2>
        <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
          <input
            type="text"
            className="url-box"
            style={{ width: '220px', marginBottom: 0 }}
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
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Capture URL</label>
            <textarea
              className="url-box"
              readOnly
              value={captureUrl}
              placeholder="Endpoint URL will appear here"
            />
          </div>
          
          {endpointUrl && (
            <div className="mb-4">
              <button onClick={openEndpoint} className="btn">Open endpoint in new tab</button>
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Example curl commands</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium mb-1">POST request:</p>
                <pre className="code-box text-xs">{`curl -X POST ${curlUrl} -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">GET request:</p>
                <pre className="code-box text-xs">{`curl ${curlUrl}`}</pre>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'center', justifyContent: 'center'}}>
            <div className="text-left">
              <label className="block text-sm font-medium mb-1">Expiry time (optional)</label>
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
            <p className="text-sm">{apiStatus}</p>
            {apiHeaders && (
              <pre className="headers text-xs">{JSON.stringify(apiHeaders, null, 2)}</pre>
            )}
          </div>
        )}
      </div>

      {/* Requests Section */}
      {endpointId && (
        <div className="option-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Requests</h2>
            <div className="flex gap-2">
              <button onClick={loadRequests} className="btn">Refresh</button>
              <button onClick={exportRequests} className="btn">Export JSON</button>
              <button onClick={clearRequests} className="btn">Clear All</button>
            </div>
          </div>
          
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests yet. Send a request to the capture URL to see it here.</p>
          ) : (
            <div className="flex" style={{gap: '1rem', alignItems: 'flex-start'}}>
              <div style={{flex: '1'}}>
                <div className="mb-2 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
                  <select className="url-box" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
                    <option value="">All methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  <SearchInput value={search} onChange={setSearch} />
                </div>
                {search && (
                  <div className="mb-2 text-left">
                    <span className="text-sm">{filtered.length} {filtered.length === 1 ? 'match' : 'matches'}</span>
                  </div>
                )}
                <RequestList
                  requests={filtered}
                  activeId={selectedRequest?.id || null}
                  onSelect={setSelectedRequest}
                  highlight={search}
                />
              </div>
              <div style={{flex: '1'}}>
                {selectedRequest ? (
                  <RequestInspector request={selectedRequest} endpointUuid={uuidInput} />
                ) : (
                  <div className="text-center text-gray-500 p-8">
                    <p>Select a request to inspect</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    </SidebarLayout>
  );
};

export default WebhookPage;
