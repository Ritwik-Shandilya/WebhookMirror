import React from 'react';
import RequestListItem, { Req } from './RequestListItem';

interface Props {
  requests: Req[];
  activeId: number | null;
  onSelect: (r: Req) => void;
  highlight?: string;
}

const RequestList: React.FC<Props> = ({ requests, activeId, onSelect, highlight }) => (
  <ul className="space-y-2 request-list text-left">
    {requests.map(r => (
      <RequestListItem
        key={r.id}
        request={r}
        active={r.id === activeId}
        highlight={highlight}
        onClick={() => onSelect(r)}
      />
    ))}
  </ul>
);

export default RequestList;
