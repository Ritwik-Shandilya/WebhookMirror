import React, { useState, useMemo } from 'react';
import { Button, Input, Textarea, Toastr } from '@bigbinary/neetoui';
import { Play, Link } from '@bigbinary/neeto-icons';

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

const RequestReplay: React.FC<Props> = ({ request, endpointUuid }) => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [targetUrl, setTargetUrl] = useState(`${window.location.origin}/${endpointUuid}`);
  const [editedHeaders, setEditedHeaders] = useState('');
  const [editedBody, setEditedBody] = useState(request.body || '');

  const originalHeaders = useMemo(() => {
    if (typeof request.headers === 'string') {
      try {
        return JSON.parse(request.headers);
      } catch {
        return {};
      }
    }
    return request.headers;
  }, [request.headers]);

  const handleReplay = async () => {
    setIsReplaying(true);
    
    try {
      // Parse edited headers or use original
      let headers = originalHeaders;
      if (editedHeaders.trim()) {
        try {
          headers = JSON.parse(editedHeaders);
        } catch (e) {
          Toastr.error('Invalid JSON in headers');
          setIsReplaying(false);
          return;
        }
      }

      const response = await fetch(`/api/requests/${request.id}/replay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headers,
          body: editedBody,
          target_url: targetUrl
        })
      });

      const result = await response.json();

      if (result.success) {
        Toastr.success(`Request replayed successfully! Status: ${result.status}`);
      } else {
        Toastr.error(`Replay failed: ${result.error}`);
      }
    } catch (error) {
      Toastr.error(`Replay failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsReplaying(false);
    }
  };

  const resetToOriginal = () => {
    setEditedHeaders(JSON.stringify(originalHeaders, null, 2));
    setEditedBody(request.body || '');
    setTargetUrl(`${window.location.origin}/${endpointUuid}`);
  };

  return (
    <div className="request-replay neeto-card">
      <div className="replay-section">
        <label className="form-label" htmlFor="target-url-input">
          Target URL
          <span className="form-description">Where to send the replayed request</span>
        </label>
        <div className="url-input-wrapper">
          <Link className="url-icon" />
          <Input
            id="target-url-input"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="https://example.com/webhook"
            className="url-input"
            unlimitedChars={true}
          />
        </div>
      </div>

      <div className="replay-section">
        <div className="section-header">
          <h4>Headers</h4>
          <p className="section-description">Edit request headers (JSON format)</p>
        </div>
        <Textarea
          value={editedHeaders}
          onChange={(e) => setEditedHeaders(e.target.value)}
          placeholder={JSON.stringify(originalHeaders, null, 2)}
          rows={8}
          className="headers-textarea"
          unlimitedChars={true}
        />
      </div>

      <div className="replay-section">
        <div className="section-header">
          <h4>Body</h4>
          <p className="section-description">Edit request body content</p>
        </div>
        <Textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          placeholder="Request body content..."
          rows={6}
          className="body-textarea"
          unlimitedChars={true}
        />
      </div>

      <div className="replay-actions">
        <Button
          onClick={resetToOriginal}
          variant="secondary"
          size="small"
        >
          Reset to Original
        </Button>
        <Button
          onClick={handleReplay}
          disabled={isReplaying}
          variant="primary"
          size="small"
          className="replay-btn"
        >
          {isReplaying ? (
            <>
              <div className="spinner"></div>
              Replaying...
            </>
          ) : (
            <>Replay Request</>
          )}
        </Button>
      </div>

      <style>{`
        .neeto-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(30, 41, 59, 0.04);
          padding: 2rem 1.5rem;
          margin: 1.5rem 0;
        }
        .replay-section {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          font-size: 1rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0.15rem;
        }
        .form-description {
          display: block;
          font-size: 0.92rem;
          color: #64748b;
          font-weight: 400;
          margin-top: 0.1rem;
          margin-bottom: 0.5rem;
        }
        .url-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          overflow-x: auto;
        }
        .url-icon {
          position: absolute;
          left: 0.75rem;
          color: #94a3b8;
          width: 1rem;
          height: 1rem;
          z-index: 1;
        }
        .url-input {
          padding-left: 2.5rem;
          min-width: 0;
          max-width: 100%;
          overflow-x: auto;
          white-space: pre;
        }
        .headers-textarea,
        .body-textarea {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.95rem;
          line-height: 1.5;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          color: #334155;
        }
        .replay-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }
        .replay-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .play-icon {
          width: 1rem;
          height: 1rem;
        }
        .spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid #64748b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RequestReplay; 