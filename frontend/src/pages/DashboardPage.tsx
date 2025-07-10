import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';

interface Endpoint {
  id: number;
  uuid: string;
  created_at: string;
  expires_at: string | null;
  disabled: boolean;
  can_delete: boolean;
  delete_reason: string | null;
}

const DashboardPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const loadEndpoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/endpoints');
      if (!res.ok) throw new Error('Failed to load endpoints');
      const data = await res.json();
      setEndpoints(data);
    } catch (err) {
      setError('Failed to load endpoints. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEndpoints(); }, []);
  useEffect(() => { setPage(1); }, [endpoints]);

  const PAGE_SIZE = 10;

  const endpointsWithGroup = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    return endpoints.map(e => {
      const created = new Date(e.created_at);
      let group: 'Today' | 'Yesterday' | 'Older';
      if (created >= startOfToday) {
        group = 'Today';
      } else if (created >= startOfYesterday) {
        group = 'Yesterday';
      } else {
        group = 'Older';
      }
      return { ...e, group };
    });
  }, [endpoints]);

  const totalPages = Math.ceil(endpointsWithGroup.length / PAGE_SIZE) || 1;
  const pagedEndpoints = endpointsWithGroup.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const copyCaptureUrl = async (uuid: string, id: number) => {
    const captureUrl = `${window.location.origin}/${uuid}`;
    await navigator.clipboard.writeText(captureUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleDisabled = async (id: number, disabled: boolean) => {
    if (!window.confirm(`Are you sure you want to ${disabled ? 'disable' : 'enable'} this endpoint?`)) return;
    await fetch(`/api/endpoints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled })
    });
    loadEndpoints();
    setOpenMenuId(null);
  };

  const toggleMenu = (id: number) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  const deleteEndpoint = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this endpoint?')) return;
    const res = await fetch(`/api/endpoints/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to delete endpoint');
    }
    loadEndpoints();
    setOpenMenuId(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SidebarLayout>
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Manage your webhook endpoints</p>
      </div>
      
      {error && (
        <div className="error-message">
          <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading endpoints...</p>
        </div>
      ) : (
        <>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{endpoints.length}</div>
            <div className="stat-label">Total Endpoints</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{endpoints.filter(e => !e.disabled).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{endpoints.filter(e => e.disabled).length}</div>
            <div className="stat-label">Disabled</div>
          </div>
        </div>

        <div className="endpoints-table-container">
          <table className="endpoints-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Capture URL</th>
                <th>Created</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedEndpoints.map((e, idx) => (
                <React.Fragment key={e.id}>
                  {(idx === 0 || pagedEndpoints[idx - 1].group !== e.group) && (
                    <tr className="group-header-row">
                      <td colSpan={6} className="group-header">
                        <div className="group-header-content">
                          <span className="group-title">{e.group}</span>
                          <span className="group-count">
                            {pagedEndpoints.filter(ep => ep.group === e.group).length} endpoints
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr className={`endpoint-row ${e.disabled ? 'disabled' : ''}`}>
                    <td className="endpoint-uuid">
                      <Link to={`/endpoint/${e.uuid}`} className="uuid-link">
                        {e.uuid}
                      </Link>
                    </td>
                    <td className="capture-url-cell">
                      <div className="capture-url-container">
                        <span className="capture-url">{window.location.origin}/{e.uuid}</span>
                        <button 
                          className={`copy-url-btn ${copiedId === e.id ? 'copied' : ''}`}
                          onClick={() => copyCaptureUrl(e.uuid, e.id)}
                          title="Copy capture URL"
                        >
                          {copiedId === e.id ? (
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
                    </td>
                    <td className="timestamp">{formatTimestamp(e.created_at)}</td>
                    <td className="expires">
                      {e.expires_at ? formatTimestamp(e.expires_at) : 'Never'}
                    </td>
                    <td className="status">
                      <span className={`status-badge ${e.disabled ? 'disabled' : 'active'}`}>
                        {e.disabled ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="actions-container">
                        <button 
                          className="actions-toggle" 
                          onClick={() => toggleMenu(e.id)}
                          title="More actions"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        {openMenuId === e.id && (
                          <div className="actions-menu horizontal">
                            <button 
                              onClick={() => toggleDisabled(e.id, !e.disabled)}
                              className="action-btn"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={e.disabled ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"} />
                              </svg>
                              {e.disabled ? 'Enable' : 'Disable'}
                            </button>
                            <button
                              disabled={!e.can_delete}
                              onClick={() => deleteEndpoint(e.id)}
                              className="action-btn danger"
                              title={!e.can_delete ? e.delete_reason || 'Cannot delete' : 'Delete endpoint'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="pagination-btn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="pagination-btn"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
        </>
      )}
    </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
