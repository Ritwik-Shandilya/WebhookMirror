import React from 'react';

export interface Req {
  id: number;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

interface Props {
  request: Req;
  onClick: () => void;
  active: boolean;
  highlight?: string;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const RequestListItem: React.FC<Props> = ({ request, onClick, active, highlight }) => {
  const snippet = request.body.slice(0, 80);
  let content: string = snippet;
  if (highlight) {
    try {
      const regex = new RegExp(escapeRegExp(highlight), 'gi');
      content = snippet.replace(regex, match => `<mark>${match}</mark>`);
    } catch {}
  }
  return (
    <li
      className={active ? 'request-item active' : 'request-item'}
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span className="font-mono text-sm">{request.method}</span>
        <span className="text-xs">{new Date(request.created_at).toLocaleTimeString()}</span>
      </div>
      <pre className="code-box whitespace-pre-wrap text-xs mt-1" dangerouslySetInnerHTML={{ __html: content }} />
    </li>
  );
};

export default RequestListItem;
