import React, { useState, useMemo } from 'react';
import Tabs from './Tabs';
import { JSONTree } from 'react-json-tree';

interface Props {
  request: {
    id: number;
    method: string;
    headers: Record<string, string> | string;
    body: string;
    created_at: string;
  };
  endpointUuid: string;
}

const RequestInspector: React.FC<Props> = ({ request, endpointUuid }) => {
  const [active, setActive] = useState('Raw');
  const headersObj =
    typeof request.headers === 'string' ?
      (() => { try { return JSON.parse(request.headers); } catch { return {}; } })() :
      request.headers;
  const queryParams = new URLSearchParams(headersObj['query-string'] || '');
  const cookies = headersObj['cookie'] || '';

  const copyCurl = () => {
    const headers = headersObj as Record<string, string>;
    let cmd = `curl -X ${request.method} ${window.location.origin}/${endpointUuid}`;
    Object.entries(headers).forEach(([k, v]) => {
      if (k.toLowerCase() === 'host') return;
      cmd += ` -H "${k}: ${v}"`;
    });
    if (request.body) {
      const body = request.body.replace(/'/g, "'\\''");
      cmd += ` -d '${body}'`;
    }
    navigator.clipboard.writeText(cmd);
    alert('Copied as cURL');
  };

  const parsedHeaders = useMemo(() => {
    if (typeof request.headers === 'string') {
      try {
        return JSON.parse(request.headers);
      } catch {
        return null;
      }
    }
    return request.headers;
  }, [request.headers]);

  const parsedBody = useMemo(() => {
    try {
      return JSON.parse(request.body);
    } catch {
      return null;
    }
  }, [request.body]);

  return (
    <div className="inspector">
      <div className="flex justify-between mb-2">
        <h2 className="text-xl">Request {request.id}</h2>
        <button className="btn" onClick={copyCurl}>Copy as cURL</button>
      </div>
      <Tabs tabs={['Raw', 'Headers', 'Body', 'Query Params', 'Cookies']} active={active} onChange={setActive} />
      {active === 'Raw' && (
        <div className="json-tree">
          <JSONTree data={{ ...request, headers: parsedHeaders || headersObj, body: parsedBody || request.body }} hideRoot={true} />
        </div>
      )}
      {active === 'Headers' && (
        parsedHeaders ? (
          <div className="json-tree"><JSONTree data={parsedHeaders} hideRoot={true} /></div>
        ) : (
          <pre className="code-box whitespace-pre-wrap text-xs">{
            typeof request.headers === 'string'
              ? request.headers
              : JSON.stringify(request.headers, null, 2)
          }</pre>
        )
      )}
      {active === 'Body' && (
        parsedBody ? <div className="json-tree"><JSONTree data={parsedBody} hideRoot={true} /></div> : <pre className="code-box whitespace-pre-wrap text-xs">{request.body}</pre>
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
