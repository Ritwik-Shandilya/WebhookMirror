import React, { useEffect, useState } from 'react';
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

  const createEndpoint = async () => {
    await fetch('/api/endpoints', { method: 'POST' });
    loadEndpoints();
  };

  return (
    <div className="container">
      <h1 className="header">Dashboard</h1>
      <button className="btn mb-4" onClick={createEndpoint}>Create new endpoint</button>
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-left">
          <thead>
            <tr><th>UUID</th><th>Created</th></tr>
          </thead>
          <tbody>
            {endpoints.map(e => (
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
