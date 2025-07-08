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

  if (!request) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 font-sans">
      <h1 className="text-xl mb-4">Request {request.id}</h1>
      <div className="mb-2 font-mono text-sm">{request.method} - {request.created_at}</div>
      <h2 className="font-semibold">Headers</h2>
      <pre className="whitespace-pre-wrap text-xs mb-4">{JSON.stringify(request.headers, null, 2)}</pre>
      <h2 className="font-semibold">Body</h2>
      <pre className="whitespace-pre-wrap text-xs">{request.body}</pre>
    </div>
  );
};

export default RequestPage;
