import React, { useState } from 'react';
import Tabs from './Tabs';

interface Props {
  request: {
    id: number;
    method: string;
    headers: Record<string, string>;
    body: string;
    created_at: string;
  };
}

const RequestInspector: React.FC<Props> = ({ request }) => {
  const [active, setActive] = useState('Raw');
  const queryParams = new URLSearchParams(request.headers['query-string'] || '');
  const cookies = request.headers['cookie'] || '';

  return (
    <div className="inspector">
      <h2 className="text-xl mb-2">Request {request.id}</h2>
      <Tabs tabs={['Raw', 'Headers', 'Body', 'Query Params', 'Cookies']} active={active} onChange={setActive} />
      {active === 'Raw' && (
        <pre className="code-box whitespace-pre-wrap text-xs">{JSON.stringify(request, null, 2)}</pre>
      )}
      {active === 'Headers' && (
        <pre className="code-box whitespace-pre-wrap text-xs">{JSON.stringify(request.headers, null, 2)}</pre>
      )}
      {active === 'Body' && (
        <pre className="code-box whitespace-pre-wrap text-xs">{request.body}</pre>
      )}
      {active === 'Query Params' && (
        <pre className="code-box whitespace-pre-wrap text-xs">{Array.from(queryParams.entries()).map(([k,v]) => `${k}: ${v}`).join('\n') || 'None'}</pre>
      )}
      {active === 'Cookies' && (
        <pre className="code-box whitespace-pre-wrap text-xs">{cookies || 'None'}</pre>
      )}
    </div>
  );
};

export default RequestInspector;
