import React, { useState, useMemo } from 'react';
import Tabs from './Tabs';
import { JSONTree } from 'react-json-tree';
import { Button } from '@bigbinary/neetoui';
import { Copy } from '@bigbinary/neeto-icons';
import RequestReplay from './RequestReplay';

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
  const [copied, setCopied] = useState(false);
  
  const headersObj =
    typeof request.headers === 'string' ?
      (() => { try { return JSON.parse(request.headers); } catch { return {}; } })() :
      request.headers;
  const queryParams = new URLSearchParams(headersObj['query-string'] || '');
  const cookies = headersObj['cookie'] || '';

  const copyCurl = async () => {
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
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: '#10b981',
      POST: '#3b82f6',
      PUT: '#f59e0b',
      PATCH: '#8b5cf6',
      DELETE: '#ef4444',
      HEAD: '#6b7280',
      OPTIONS: '#8b5cf6'
    };
    return colors[method.toUpperCase()] || '#6b7280';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="request-inspector">
      {/* Header Section */}
      <div className="inspector-header neeto-header">
        <div className="request-info">
          <div className="request-badge">
            <span 
              className="method-badge"
              style={{ backgroundColor: '#3b82f6', color: '#fff' }}
            >
              {request.method}
            </span>
            <span className="request-id">#{request.id}</span>
          </div>
          <div className="request-meta">
            <span className="timestamp">{formatTimestamp(request.created_at)}</span>
          </div>
        </div>
        <Button
          onClick={copyCurl}
          className={`copy-curl-btn ${copied ? 'copied' : ''}`}
          title="Copy cURL"
          variant="secondary"
        >
          {copied ? 'Copied!' : 'Copy cURL'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="inspector-tabs">
        <Tabs 
          tabs={['Raw', 'Headers', 'Body', 'Query Params', 'Cookies', 'Replay']} 
          active={active} 
          onChange={setActive} 
        />
      </div>

      {/* Content Section */}
      <div className="inspector-content">
        {active === 'Raw' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Complete Request Data</h3>
              <span className="data-type">JSON</span>
            </div>
            <div className="json-viewer">
              <JSONTree 
                data={{ 
                  ...request, 
                  headers: parsedHeaders || headersObj, 
                  body: parsedBody || request.body 
                }} 
                hideRoot={true}
                theme={{
                  base00: '#1f2937',
                  base01: '#374151',
                  base02: '#4b5563',
                  base03: '#6b7280',
                  base04: '#9ca3af',
                  base05: '#d1d5db',
                  base06: '#e5e7eb',
                  base07: '#f9fafb',
                  base08: '#ef4444',
                  base09: '#f59e0b',
                  base0A: '#eab308',
                  base0B: '#22c55e',
                  base0C: '#06b6d4',
                  base0D: '#3b82f6',
                  base0E: '#8b5cf6',
                  base0F: '#ec4899'
                }}
              />
            </div>
          </div>
        )}

        {active === 'Headers' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Request Headers</h3>
              <span className="data-type">
                {parsedHeaders ? 'JSON' : 'Raw'}
              </span>
            </div>
            <div className="data-viewer">
              {parsedHeaders ? (
                <div className="json-viewer">
                  <JSONTree 
                    data={parsedHeaders} 
                    hideRoot={true}
                    theme={{
                      base00: '#1f2937',
                      base01: '#374151',
                      base02: '#4b5563',
                      base03: '#6b7280',
                      base04: '#9ca3af',
                      base05: '#d1d5db',
                      base06: '#e5e7eb',
                      base07: '#f9fafb',
                      base08: '#ef4444',
                      base09: '#f59e0b',
                      base0A: '#eab308',
                      base0B: '#22c55e',
                      base0C: '#06b6d4',
                      base0D: '#3b82f6',
                      base0E: '#8b5cf6',
                      base0F: '#ec4899'
                    }}
                  />
                </div>
              ) : (
                <pre className="raw-data">
                  {typeof request.headers === 'string'
                    ? request.headers
                    : JSON.stringify(request.headers, null, 2)
                  }
                </pre>
              )}
            </div>
          </div>
        )}

        {active === 'Body' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Request Body</h3>
              <span className="data-type">
                {parsedBody ? 'JSON' : 'Raw'}
              </span>
            </div>
            <div className="data-viewer">
              {parsedBody ? (
                <div className="json-viewer">
                  <JSONTree 
                    data={parsedBody} 
                    hideRoot={true}
                    theme={{
                      base00: '#1f2937',
                      base01: '#374151',
                      base02: '#4b5563',
                      base03: '#6b7280',
                      base04: '#9ca3af',
                      base05: '#d1d5db',
                      base06: '#e5e7eb',
                      base07: '#f9fafb',
                      base08: '#ef4444',
                      base09: '#f59e0b',
                      base0A: '#eab308',
                      base0B: '#22c55e',
                      base0C: '#06b6d4',
                      base0D: '#3b82f6',
                      base0E: '#8b5cf6',
                      base0F: '#ec4899'
                    }}
                  />
                </div>
              ) : (
                <pre className="raw-data">
                  {request.body || 'No body content'}
                </pre>
              )}
            </div>
          </div>
        )}

        {active === 'Query Params' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Query Parameters</h3>
              <span className="data-type">Key-Value Pairs</span>
            </div>
            <div className="data-viewer">
              {Array.from(queryParams.entries()).length > 0 ? (
                <div className="key-value-list">
                  {Array.from(queryParams.entries()).map(([key, value], index) => (
                    <div key={index} className="key-value-item">
                      <span className="key">{key}</span>
                      <span className="separator">:</span>
                      <span className="value">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No query parameters found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {active === 'Cookies' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Cookies</h3>
              <span className="data-type">Raw</span>
            </div>
            <div className="data-viewer">
              {cookies ? (
                <pre className="raw-data">{cookies}</pre>
              ) : (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>No cookies found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {active === 'Replay' && (
          <div className="content-panel">
            <div className="panel-header">
              <h3>Request Replay</h3>
              <span className="data-type">Edit & Resend</span>
            </div>
            <div className="data-viewer">
              <RequestReplay request={request} endpointUuid={endpointUuid} />
            </div>
          </div>
        )}
      </div>
      <style>{`
        .neeto-header {
          background: #fff;
          border-radius: 16px 16px 0 0;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 4px rgba(30,41,59,0.03);
          padding: 2rem 2rem 1.25rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .request-badge {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .method-badge {
          background: #3b82f6;
          color: #fff;
          font-weight: 700;
          font-size: 1rem;
          border-radius: 8px;
          padding: 0.4rem 1.1rem;
          letter-spacing: 0.04em;
          box-shadow: none;
        }
        .request-id {
          font-size: 1.15rem;
          color: #334155;
          font-weight: 600;
        }
        .request-meta {
          margin-left: 1.5rem;
        }
        .timestamp {
          color: #64748b;
          font-size: 1rem;
          font-weight: 400;
        }
        @media (max-width: 600px) {
          .neeto-header {
            padding: 1rem 0.5rem 1rem 0.5rem;
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RequestInspector;
