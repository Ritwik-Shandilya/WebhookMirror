import React, { useState } from 'react';

const ApiTesterPage: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [query, setQuery] = useState('');
  const [headersText, setHeadersText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [testResult, setTestResult] = useState<{status: number; headers: Record<string,string>; body: string} | null>(null);

  const testApi = async () => {
    if (!testUrl) return;
    try {
      let finalUrl = testUrl;
      if (query) {
        const q = query.startsWith('?') ? query.slice(1) : query;
        finalUrl += (testUrl.includes('?') ? '&' : '?') + q;
      }
      const headersObj: Record<string, string> = {};
      headersText.split('\n').forEach(line => {
        const idx = line.indexOf(':');
        if (idx > -1) {
          const key = line.slice(0, idx).trim();
          const value = line.slice(idx + 1).trim();
          if (key) headersObj[key] = value;
        }
      });
      const options: RequestInit = { method, headers: headersObj };
      if (bodyText && method !== 'GET' && method !== 'HEAD') {
        options.body = bodyText;
      }
      const res = await fetch(finalUrl, options);
      const body = await res.text();
      const respHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        respHeaders[k] = v;
      });
      setTestResult({ status: res.status, headers: respHeaders, body });
    } catch (err) {
      setTestResult({ status: 0, headers: {}, body: 'Request failed' });
    }
  };

  return (
    <div className="container">
      <h1 className="header">API Tester</h1>
      <p className="mb-4">Send HTTP requests to quickly inspect status, headers, and body.</p>
      <input
        className="url-box"
        type="text"
        value={testUrl}
        onChange={e => setTestUrl(e.target.value)}
        placeholder="https://example.com/inbox-uuid"
      />
      <div className="mb-2">
        <select className="url-box" value={method} onChange={e => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <input
        className="url-box"
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="query=params&foo=bar"
      />
      <textarea
        className="url-box"
        rows={3}
        value={headersText}
        onChange={e => setHeadersText(e.target.value)}
        placeholder="Header: Value"
      />
      <textarea
        className="url-box"
        rows={4}
        value={bodyText}
        onChange={e => setBodyText(e.target.value)}
        placeholder="Request body"
      />
      <button onClick={testApi} className="btn">Send Request</button>
      {testResult && (
        <div className="status mt-2">
          <p>Status: {testResult.status}</p>
          <pre className="headers">{JSON.stringify(testResult.headers, null, 2)}</pre>
          <pre className="headers">{testResult.body}</pre>
        </div>
      )}
    </div>
  );
};

export default ApiTesterPage;
