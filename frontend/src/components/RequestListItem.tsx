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
}

const RequestListItem: React.FC<Props> = ({ request, onClick, active }) => (
  <li
    className={active ? 'request-item active' : 'request-item'}
    onClick={onClick}
  >
    <div className="flex justify-between">
      <span className="font-mono text-sm">{request.method}</span>
      <span className="text-xs">{new Date(request.created_at).toLocaleTimeString()}</span>
    </div>
    <pre className="code-box whitespace-pre-wrap text-xs mt-1">
      {request.body.slice(0, 80)}
    </pre>
  </li>
);

export default RequestListItem;
