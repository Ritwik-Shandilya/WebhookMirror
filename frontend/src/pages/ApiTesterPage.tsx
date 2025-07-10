import React, { useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { Button, Input, Textarea, Select, Spinner, Toastr } from '@bigbinary/neetoui';

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
  { label: 'PUT', value: 'PUT' },
  { label: 'PATCH', value: 'PATCH' },
  { label: 'DELETE', value: 'DELETE' },
];

const ApiTesterPage: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [query, setQuery] = useState('');
  const [headersText, setHeadersText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [testResult, setTestResult] = useState<{status: number; headers: Record<string,string>; body: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show error toast if error changes
  React.useEffect(() => {
    if (error) {
      Toastr.error(error);
    }
  }, [error]);

  const testApi = async () => {
    if (!testUrl) {
      setError('Please enter a URL.');
      return;
    }
    setLoading(true);
    setError(null);
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
      setError('Request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <h1 className="header">API Tester</h1>
        <p className="mb-4">Send HTTP requests to quickly inspect status, headers, and body.</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Input
            value={testUrl}
            onChange={e => setTestUrl(e.target.value)}
            placeholder="https://example.com/inbox-uuid"
            label="Request URL"
            required
            className="flex-1"
            unlimitedChars={true}
          />
          <Select
            options={methodOptions}
            value={methodOptions.find(o => o.value === method)}
            onChange={(o: { label: string; value: string }) => setMethod(o.value)}
            label="Method"
            className="method-select"
          />
        </div>
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="query=params&foo=bar"
          label="Query Params"
          className="mb-2"
          unlimitedChars={true}
        />
        <Textarea
          value={headersText}
          onChange={e => setHeadersText(e.target.value)}
          placeholder="Header: Value"
          label="Headers (one per line)"
          rows={3}
          className="mb-2"
          unlimitedChars={true}
        />
        <Textarea
          value={bodyText}
          onChange={e => setBodyText(e.target.value)}
          placeholder="Request body"
          label="Body"
          rows={4}
          className="mb-2"
          unlimitedChars={true}
        />
        <div className="mb-4" style={{ textAlign: 'right' }}>
          {loading && <Spinner />}
          <Button onClick={testApi} disabled={loading} variant="primary" size="small">
            Send Request
          </Button>
        </div>
        {testResult && (
          <div className="neetoui-pane mb-4" style={{ padding: 24, borderRadius: 8, background: '#f9fafb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3>Status: <span style={{ color: testResult.status >= 200 && testResult.status < 300 ? '#22C55E' : '#EF4444' }}>{testResult.status}</span></h3>
            <div style={{ marginBottom: 8 }}>
              <strong>Headers:</strong>
              <pre style={{ background: '#fff', padding: 8, borderRadius: 4, fontSize: 13 }}>{JSON.stringify(testResult.headers, null, 2)}</pre>
            </div>
            <div>
              <strong>Body:</strong>
              <pre style={{ background: '#fff', padding: 8, borderRadius: 4, fontSize: 13 }}>{testResult.body}</pre>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ApiTesterPage;
