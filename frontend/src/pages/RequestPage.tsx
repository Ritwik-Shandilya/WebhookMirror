import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

const RequestPage: React.FC = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<Req | null>(null);

  useEffect(() => {
    const loadRequest = async () => {
      const res = await fetch(`/api/requests/${id}`);
      const data = await res.json();
      setRequest(data);
    };
    loadRequest();
  }, [id]);

  if (!request) return <div className="p-8 font-sans">Loading...</div>;

  return (
    <div className="p-8 space-y-4 font-sans">
      <h1 className="text-2xl font-semibold">Request {request.id}</h1>
      <div className="option-card text-left">
        <h2 className="font-semibold mb-1">General</h2>
        <div className="font-mono text-sm">{request.method} - {request.created_at}</div>
      </div>
      <div className="option-card text-left">
        <h2 className="font-semibold mb-1">Headers</h2>
        <pre className="code-box whitespace-pre-wrap text-xs mb-2">
{JSON.stringify(request.headers, null, 2)}
        </pre>
      </div>
      <div className="option-card text-left">
        <h2 className="font-semibold mb-1">Body</h2>
        <pre className="code-box whitespace-pre-wrap text-xs">
{request.body}
        </pre>
      </div>
    </div>
  );
};

export default RequestPage;
