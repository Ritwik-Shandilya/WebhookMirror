import React, { useState, useEffect } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import RequestInspector from '../components/RequestInspector';
import RequestList from '../components/RequestList';
import { Req } from '../components/RequestListItem';
import SearchInput from '../components/SearchInput';
import LiveIndicator from '../components/LiveIndicator';
import { Button } from '@bigbinary/neetoui';

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
              <input
                type="datetime-local"
                className="form-input"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                placeholder="Set expiry date"
              />
            </div>
          </div>
          
          <button 
            onClick={handleOpen} 
            disabled={loading} 
            className="create-btn"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {uuidInput.trim() ? 'Open Endpoint' : 'Create New Endpoint'}
              </>
            )}
          </button>
        </div>
        
        {loaded && (
          <div className="endpoint-results">
            <div className="results-grid">
              <div className="result-card">
                <div className="result-header">
                  <h3 className="result-title">Capture URL</h3>
                  <button 
                    className={`copy-btn ${copiedUrl === 'capture' ? 'copied' : ''}`}
                    onClick={() => copyUrl(captureUrl, 'capture')}
                    title="Copy capture URL"
                  >
                    {copiedUrl === 'capture' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="url-display">
                  <code className="url-code">{captureUrl}</code>
                </div>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <h3 className="result-title">Endpoint URL</h3>
                  <button 
                    className={`copy-btn ${copiedUrl === 'endpoint' ? 'copied' : ''}`}
                    onClick={() => copyUrl(endpointUrl, 'endpoint')}
                    title="Copy endpoint URL"
                  >
                    {copiedUrl === 'endpoint' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="url-display">
                  <code className="url-code">{endpointUrl}</code>
                  <button onClick={openEndpoint} className="open-btn">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open
                  </button>
                </div>
              </div>
            </div>

            <div className="curl-examples">
              <h3 className="curl-title">Example cURL Commands</h3>
              <div className="curl-grid">
                <div className="curl-card">
                  <div className="curl-header">
                    <span className="curl-method post">POST</span>
                    <button 
                      className={`copy-btn small ${copiedUrl === 'curl-post' ? 'copied' : ''}`}
                      onClick={() => copyUrl(`curl -X POST ${curlUrl} -H "Content-Type: application/json" -d '{"hello":"world"}'`, 'curl-post')}
                    >
                      {copiedUrl === 'curl-post' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <pre className="curl-code">{`curl -X POST ${curlUrl} -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
                </div>
                
                <div className="curl-card">
                  <div className="curl-header">
                    <span className="curl-method get">GET</span>
                    <button 
                      className={`copy-btn small ${copiedUrl === 'curl-get' ? 'copied' : ''}`}
                      onClick={() => copyUrl(`curl ${curlUrl}`, 'curl-get')}
                    >
                      {copiedUrl === 'curl-get' ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
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
              <button onClick={loadRequests} className="action-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button onClick={exportRequests} className="action-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export JSON
              </button>
              <button onClick={clearRequests} className="action-btn danger">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All
              </button>
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
