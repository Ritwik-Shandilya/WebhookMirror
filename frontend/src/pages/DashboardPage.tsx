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
              </tr>
            </thead>
            <tbody>
              {pagedEndpoints.map((e, idx) => (
                <React.Fragment key={e.id}>
                  {(idx === 0 || pagedEndpoints[idx - 1].group !== e.group) && (
                    <tr className="group-header-row">
                      <td colSpan={5} className="group-header">
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
                        <div className="url-actions">
                          <button
                            onClick={() => copyCaptureUrl(e.uuid, e.id)}
                            className={`copy-url-btn ${copiedId === e.id ? 'copied' : ''}`}
                            title="Copy capture URL"
                          >
                            {copiedId === e.id ? "Copied!" : "Copy"}
                          </button>
                          
                          <div className="dropdown-container">
                            <button
                              onClick={() => toggleMenu(e.id)}
                              className="dropdown-toggle"
                              title="More actions"
                            >
                              More actions
                            </button>
                            {openMenuId === e.id && (
                              <div className="dropdown-menu">
                                <button
                                  onClick={() => toggleDisabled(e.id, !e.disabled)}
                                  className="dropdown-item"
                                >
                                  {e.disabled ? "Enable" : "Disable"}
                                </button>
                                <button
                                  disabled={!e.can_delete}
                                  onClick={() => deleteEndpoint(e.id)}
                                  className={`dropdown-item ${!e.can_delete ? 'disabled' : 'danger'}`}
                                  title={!e.can_delete ? e.delete_reason || 'Cannot delete' : 'Delete endpoint'}
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="pagination-btn"
                disabled={page === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`pagination-btn ${page === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="pagination-btn"
                disabled={page === totalPages}
              >
                Next
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
