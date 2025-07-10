import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import RequestInspector from '../components/RequestInspector';
import RequestList from '../components/RequestList';
import { Req } from '../components/RequestListItem';
import SearchInput from '../components/SearchInput';
import LiveIndicator from '../components/LiveIndicator';
import { Button, DatePicker, Spinner } from '@bigbinary/neetoui';
import { Copy } from '@bigbinary/neeto-icons';

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
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

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

  const copyUrl = async (url: string, type: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
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
    <div className="testing-container">
      <div className="testing-header">
        <h1 className="testing-title">Start Testing <LiveIndicator /></h1>
        <p className="testing-subtitle">Create or open webhook endpoints to capture and inspect requests</p>
      </div>
      
      {/* Endpoint Creation Section */}
      <div className="endpoint-creation-card">
        <div className="card-header">
          <h2 className="card-title">Create or Open Endpoint</h2>
          <p className="card-description">Enter an existing endpoint ID or leave blank to create a new one</p>
        </div>
        
        <div className="endpoint-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Endpoint ID (optional)</label>
              <input
                type="text"
                className="form-input"
                value={uuidInput}
                onChange={e => setUuidInput(e.target.value)}
                placeholder="Enter existing endpoint ID or leave blank"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry time (optional)</label>
              <DatePicker
                value={expiresAt}
                onChange={setExpiresAt}
                placeholder="Set expiry date"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleOpen} 
            disabled={loading} 
            variant="primary"
            size="medium"
          >
            {loading ? (
              <Spinner />
            ) : (
              <>{uuidInput.trim() ? 'Open Endpoint' : 'Create New Endpoint'}</>
            )}
          </Button>
        </div>
        
        {loaded && (
          <div className="endpoint-results">
            <div className="results-grid">
              <div className="result-card">
                <div className="result-header">
                  <h3 className="result-title">Capture URL</h3>
                  <Button
                    onClick={() => copyUrl(captureUrl, 'capture')}
                    title="Copy capture URL"
                    variant="primary"
                    size="small"
                  >
                    {copiedUrl === 'capture' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="url-display">
                  <code className="url-code">{captureUrl}</code>
                </div>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <h3 className="result-title">Endpoint URL</h3>
                  <Button
                    onClick={() => copyUrl(endpointUrl, 'endpoint')}
                    title="Copy endpoint URL"
                    variant="primary"
                    size="small"
                  >
                    {copiedUrl === 'endpoint' ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <div className="url-display">
                  <code className="url-code">{endpointUrl}</code>
                  <Button onClick={openEndpoint} variant="secondary" iconPosition="left"
                    size="small"
                  >
                    Open
                  </Button>
                </div>
              </div>
            </div>

            <div className="curl-examples">
              <h3 className="curl-title">Example cURL Commands</h3>
              <div className="curl-grid">
                <div className="curl-card">
                  <div className="curl-header">
                    <span className="curl-method post">POST</span>
                    <Button
                      onClick={() => copyUrl(`curl -X POST ${curlUrl} -H \"Content-Type: application/json\" -d '{\"hello\":\"world\"}'`, 'curl-post')}
                      title="Copy POST cURL"
                      variant="primary"
                      size="small"
                    >
                      {copiedUrl === 'curl-post' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="curl-code">{`curl -X POST ${curlUrl} -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
                </div>
                
                <div className="curl-card">
                  <div className="curl-header">
                    <span className="curl-method get">GET</span>
                    <Button
                      onClick={() => copyUrl(`curl ${curlUrl}`, 'curl-get')}
                      title="Copy GET cURL"
                      variant="primary"
                      size="small"
                    >
                      {copiedUrl === 'curl-get' ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <pre className="curl-code">{`curl ${curlUrl}`}</pre>
                </div>
              </div>
            </div>
            
            {apiStatus && (
              <div className="api-status">
                <div className="status-header" style={{ justifyContent: 'center' }}>
                  <svg className="status-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="status-text">{apiStatus}</span>
                </div>
                {apiHeaders && (
                  <details className="headers-details">
                    <summary className="headers-summary">Response Headers</summary>
                    <pre className="headers-code">{JSON.stringify(apiHeaders, null, 2)}</pre>
                  </details>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Requests Section */}
      {endpointId && (
        <div className="requests-section">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">Requests</h2>
              <div className="request-stats">
                <span className="stat-item">
                  <span className="stat-number">{requests.length}</span>
                  <span className="stat-label">Total</span>
                </span>
                <span className="stat-item">
                  <span className="stat-number">{filtered.length}</span>
                  <span className="stat-label">Filtered</span>
                </span>
              </div>
            </div>
            <div className="header-actions">
              <Button onClick={loadRequests} variant="secondary" size="small">
                Refresh
              </Button>
              <Button onClick={exportRequests} variant="secondary" size="small">
                Export JSON
              </Button>
              <Button onClick={clearRequests} variant="danger" size="small">
                Clear All
              </Button>
            </div>
          </div>
          
          {requests.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="empty-title">No requests yet</h3>
              <p className="empty-description">Send a request to the capture URL to see it here</p>
            </div>
          ) : (
            <div className="requests-content">
              <div className="filters-bar">
                <div className="filter-group">
                  <select 
                    className="filter-select" 
                    value={methodFilter} 
                    onChange={e => setMethodFilter(e.target.value)}
                  >
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
                  <div className="search-results">
                    <span className="results-count">{filtered.length} {filtered.length === 1 ? 'match' : 'matches'}</span>
                  </div>
                )}
              </div>
              
              <div className="requests-layout">
                <div className="requests-list">
                  <RequestList
                    requests={filtered}
                    activeId={selectedRequest?.id || null}
                    onSelect={setSelectedRequest}
                    highlight={search}
                  />
                </div>
                <div className="request-inspector-panel">
                  {selectedRequest ? (
                    <RequestInspector request={selectedRequest} endpointUuid={uuidInput} />
                  ) : (
                    <div className="inspector-placeholder">
                      <svg className="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="placeholder-title">Select a request to inspect</h3>
                      <p className="placeholder-description">Choose a request from the list to view its details</p>
                    </div>
                  )}
                </div>
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
