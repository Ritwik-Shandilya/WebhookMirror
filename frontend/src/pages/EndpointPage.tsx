import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

const EndpointPage: React.FC = () => {
  const { uuid } = useParams();
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);

  useEffect(() => {
    const fetchEndpoint = async () => {
      const res = await fetch(`/api/endpoints/by_uuid/${uuid}`);
      const data = await res.json();
      setEndpointId(data.id);
    };
    fetchEndpoint();
  }, [uuid]);

  useEffect(() => {
    if (!endpointId) return;
    const loadRequests = async () => {
      const res = await fetch(`/api/endpoints/${endpointId}/requests`);
      const data = await res.json();
      setRequests(data);
    };
    loadRequests();
  }, [endpointId]);

  return (
    <div className="container">
      <div className="space-y-4">
        <h1 className="header">Requests for {uuid}</h1>
        {requests.length === 0 ? (
          <p>No requests yet.</p>
        ) : (
          <ul className="space-y-2 text-left">
            {requests.map(r => (
              <li key={r.id} className="border rounded p-3 space-y-1">
                <div className="font-mono text-sm">
                  <Link to={`/endpoint/${uuid}/request/${r.id}`}>{r.method} - {r.created_at}</Link>
                </div>
                <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                  {r.body}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EndpointPage;
