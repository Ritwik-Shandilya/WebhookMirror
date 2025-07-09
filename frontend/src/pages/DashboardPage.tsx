import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Endpoint {
  id: number;
  uuid: string;
  created_at: string;
}

const DashboardPage: React.FC = () => {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEndpoints = async () => {
    setLoading(true);
    const res = await fetch('/api/endpoints');
    const data = await res.json();
    setEndpoints(data);
    setLoading(false);
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
    await fetch('/api/endpoints', { method: 'POST' });
    loadEndpoints();
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
      <button className="btn mb-4" onClick={createEndpoint}>Create new endpoint</button>
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-left table">
          <thead>
            <tr><th>UUID</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {groups.today.length > 0 && (
              <tr><th colSpan={3} className="group-header">Today</th></tr>
            )}
            {groups.today.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" onClick={() => deleteEndpoint(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {groups.yesterday.length > 0 && (
              <tr><th colSpan={3} className="group-header">Yesterday</th></tr>
            )}
            {groups.yesterday.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" onClick={() => deleteEndpoint(e.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {groups.older.length > 0 && (
              <tr><th colSpan={3} className="group-header">Older</th></tr>
            )}
            {groups.older.map(e => (
              <tr key={e.id} className="endpoint-row">
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn mr-1" onClick={() => toggleDisabled(e.id, !e.disabled)}>
                    {e.disabled ? 'Enable' : 'Disable'}
                  </button>
                  <button className="btn" onClick={() => deleteEndpoint(e.id)}>Delete</button>
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
