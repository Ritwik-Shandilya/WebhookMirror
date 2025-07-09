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

  return (
    <div className="container">
      <h1 className="header">Dashboard</h1>
      <div className="mb-2 text-sm">
        <Link to="/">Back to home</Link>
      </div>
      <button className="btn mb-4" onClick={createEndpoint}>Create new endpoint</button>
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-left">
          <thead>
            <tr><th>UUID</th><th>Created</th></tr>
          </thead>
          <tbody>
            {groups.today.length > 0 && (
              <tr><th colSpan={2}>Today</th></tr>
            )}
            {groups.today.map(e => (
              <tr key={e.id}>
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {groups.yesterday.length > 0 && (
              <tr><th colSpan={2}>Yesterday</th></tr>
            )}
            {groups.yesterday.map(e => (
              <tr key={e.id}>
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {groups.older.length > 0 && (
              <tr><th colSpan={2}>Older</th></tr>
            )}
            {groups.older.map(e => (
              <tr key={e.id}>
                <td><Link to={`/endpoint/${e.uuid}`}>{e.uuid}</Link></td>
                <td>{new Date(e.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardPage;
