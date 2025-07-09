import React, { useState } from 'react';

const ApiTesterPage: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<{status: number; headers: Record<string,string>; body: string} | null>(null);

  const testApi = async () => {
    if (!testUrl) return;
    try {
      const res = await fetch(testUrl);
      const body = await res.text();
      const headersObj: Record<string, string> = {};
      res.headers.forEach((v, k) => {
        headersObj[k] = v;
      });
      setTestResult({ status: res.status, headers: headersObj, body });
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
        placeholder="https://example.com/api"
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
