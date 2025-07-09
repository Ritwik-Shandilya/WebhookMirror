import React, { useState } from 'react';
import Tabs from './Tabs';
import { JSONTree } from 'react-json-tree';

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
        <JSONTree data={request} hideRoot={true} />
      )}
      {active === 'Headers' && (
        <JSONTree data={request.headers} hideRoot={true} />
      )}
      {active === 'Body' && (
        (() => {
          try {
            const parsed = JSON.parse(request.body);
            return <JSONTree data={parsed} hideRoot={true} />;
          } catch {
            return <pre className="code-box whitespace-pre-wrap text-xs">{request.body}</pre>;
          }
        })()
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
