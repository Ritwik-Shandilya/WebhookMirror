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

  return (
    <SidebarLayout>
    <div className="container">
      <h1 className="header">Dashboard</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? <p>Loading...</p> : (
        <>
        <table className="w-full text-left table">
          <thead>
            <tr><th>UUID</th><th>Created</th><th>Expires</th></tr>
          </thead>
          <tbody>
            {pagedEndpoints.map((e, idx) => (
              <React.Fragment key={e.id}>
                {(idx === 0 || pagedEndpoints[idx - 1].group !== e.group) && (
                  <tr><th colSpan={3} className="group-header">{e.group}</th></tr>
                )}
                <tr className="endpoint-row">
                  <td style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link>
                      <button className="actions-toggle" onClick={() => toggleMenu(e.id)}>⋮</button>
                    </div>
                    {openMenuId === e.id && (
                      <div className="actions-menu">
                        <button onClick={() => toggleDisabled(e.id, !e.disabled)}>
                          {e.disabled ? 'Enable' : 'Disable'}
                        </button>
                        <span
                          title={!e.can_delete ? e.delete_reason || undefined : undefined}
                          style={{ display: 'inline-block' }}
                        >
                          <button
                            disabled={!e.can_delete}
                            onClick={() => deleteEndpoint(e.id)}
                          >
                            Delete
                          </button>
                        </span>
                      </div>
                    )}
                  </td>
                  <td>{new Date(e.created_at).toLocaleString()}</td>
                  <td>{e.expires_at ? new Date(e.expires_at).toLocaleString() : 'None'}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? 'active' : undefined}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
        </div>
        </>
      )}
    </div>
    </SidebarLayout>
  );
};

export default DashboardPage;
