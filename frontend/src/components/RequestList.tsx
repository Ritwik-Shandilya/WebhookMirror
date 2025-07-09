import React from 'react';
import RequestListItem, { Req } from './RequestListItem';

interface Props {
  requests: Req[];
  activeId: number | null;
  onSelect: (r: Req) => void;
}

const RequestList: React.FC<Props> = ({ requests, activeId, onSelect }) => (
  <ul className="space-y-2 request-list text-left">
    {requests.map(r => (
      <RequestListItem
        key={r.id}
        request={r}
        active={r.id === activeId}
        onClick={() => onSelect(r)}
      />
    ))}
  </ul>
);

export default RequestList;
