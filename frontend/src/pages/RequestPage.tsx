import React, { useEffect, useState } from 'react';
import { JSONTree } from 'react-json-tree';
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
  const [showRaw, setShowRaw] = useState(true);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);

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
    <div className="container">
      <div className="space-y-4">
        <h1 className="header">Request {request.id}</h1>
        <div className="option-card text-left">
          <h2 className="font-semibold mb-1">General</h2>
          <div className="font-mono text-sm">{request.method} - {request.created_at}</div>
        </div>

        <div className="option-card text-left">
          <div className="flex justify-between mb-1">
            <h2 className="font-semibold">Raw</h2>
            <button className="btn mr-2" onClick={() => setShowRaw(!showRaw)}>{showRaw ? 'Collapse' : 'Expand'}</button>
          </div>
          {showRaw && <JSONTree data={request} hideRoot={true} />}
        </div>

        <div className="option-card text-left">
          <div className="flex justify-between mb-1">
            <h2 className="font-semibold">Headers</h2>
            <button className="btn mr-2" onClick={() => setShowHeaders(!showHeaders)}>{showHeaders ? 'Collapse' : 'Expand'}</button>
          </div>
          {showHeaders && <JSONTree data={request.headers} hideRoot={true} />}
        </div>

        <div className="option-card text-left">
          <div className="flex justify-between mb-1">
            <h2 className="font-semibold">Body</h2>
            <button className="btn mr-2" onClick={() => setShowBody(!showBody)}>{showBody ? 'Collapse' : 'Expand'}</button>
          </div>
          {showBody && (
            (() => {
              try {
                const parsed = JSON.parse(request.body);
                return <JSONTree data={parsed} hideRoot={true} />;
              } catch {
                return <pre className="code-box whitespace-pre-wrap text-xs">{request.body}</pre>;
              }
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
