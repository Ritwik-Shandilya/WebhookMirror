import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState('');

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

  const groups = useMemo(() => {
    const today: Endpoint[] = [];
    const yesterday: Endpoint[] = [];
    const older: Endpoint[] = [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday.getTime() - 86400000);
    endpoints.forEach(e => {
      const created = new Date(e.created_at);
      if (created >= startOfToday) {
        today.push(e);
      } else if (created >= startOfYesterday) {
        yesterday.push(e);
      } else {
        older.push(e);
      }
    });
    return { today, yesterday, older };
  }, [endpoints]);

  const createEndpoint = async () => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: expiresAt || null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
    } catch (err) {
      alert('Failed to create endpoint. Is the backend running?');
    } finally {
      setExpiresAt('');
      loadEndpoints();
    }
  };

  const toggleDisabled = async (id: number, disabled: boolean) => {
    if (!window.confirm(`Are you sure you want to ${disabled ? 'disable' : 'enable'} this endpoint?`)) return;
    await fetch(`/api/endpoints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disabled })
    });
    loadEndpoints();
  };

  const deleteEndpoint = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this endpoint?')) return;
    const res = await fetch(`/api/endpoints/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || 'Failed to delete endpoint');
    }
    loadEndpoints();
  };

  return (
    <div className="container">
      <h1 className="header">Dashboard</h1>
      <div className="mb-2 text-sm">
        <Link to="/" className="btn">Back to home</Link>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="mb-4 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
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
        <button className="btn" onClick={createEndpoint}>Create new endpoint</button>
      </div>
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-left table">
          <thead>
            <tr><th>UUID</th><th>Created</th><th>Expires</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {groups.today.length > 0 && (
            <tr><th colSpan={4} className="group-header">Today</th></tr>
            )}
            {groups.today.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>{e.expires_at ? new Date(e.expires_at).toLocaleString() : 'None'}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" disabled={!e.can_delete} onClick={() => deleteEndpoint(e.id)}>Delete</button>
                  {!e.can_delete && (
                    <span className="help-icon">
                      ?
                      <span className="tooltip">{e.delete_reason}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {groups.yesterday.length > 0 && (
            <tr><th colSpan={4} className="group-header">Yesterday</th></tr>
            )}
            {groups.yesterday.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>{e.expires_at ? new Date(e.expires_at).toLocaleString() : 'None'}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" disabled={!e.can_delete} onClick={() => deleteEndpoint(e.id)}>Delete</button>
                  {!e.can_delete && (
                    <span className="help-icon">
                      ?
                      <span className="tooltip">{e.delete_reason}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {groups.older.length > 0 && (
            <tr><th colSpan={4} className="group-header">Older</th></tr>
            )}
            {groups.older.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>{e.expires_at ? new Date(e.expires_at).toLocaleString() : 'None'}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" disabled={!e.can_delete} onClick={() => deleteEndpoint(e.id)}>Delete</button>
                  {!e.can_delete && (
                    <span className="help-icon">
                      ?
                      <span className="tooltip">{e.delete_reason}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;
