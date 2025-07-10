import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import RequestList from '../components/RequestList';
import { Req } from '../components/RequestListItem';
import RequestInspector from '../components/RequestInspector';
import SearchInput from '../components/SearchInput';
import LiveIndicator from '../components/LiveIndicator';
import { Button } from '@bigbinary/neetoui';


const EndpointPage: React.FC = () => {
  const { uuid } = useParams();
  const [endpointId, setEndpointId] = useState<number | null>(null);
  const [requests, setRequests] = useState<Req[]>([]);
  const [selected, setSelected] = useState<Req | null>(null);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  useEffect(() => {
    const fetchEndpoint = async () => {
      const res = await fetch(`/api/endpoints/by_uuid/${uuid}`);
      const data = await res.json();
      setEndpointId(data.id);
    };
    fetchEndpoint();
  }, [uuid]);

  useEffect(() => {
    if (!endpointId) return;
    const loadRequests = async () => {
      const res = await fetch(`/api/endpoints/${endpointId}/requests`);
      const data = await res.json();
      setRequests(data);
    };
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [endpointId]);

  const filtered = requests.filter(r => {
    const matchesMethod = methodFilter ? r.method === methodFilter : true;
    const text = (r.body + JSON.stringify(r.headers)).toLowerCase();
    const matchesSearch = search ? text.includes(search.toLowerCase()) : true;
    return matchesMethod && matchesSearch;
  });

  const clearRequests = async () => {
    if (!endpointId) return;
    if (!window.confirm('Clear all requests?')) return;
    await fetch(`/api/endpoints/${endpointId}/requests`, { method: 'DELETE' });
    const res = await fetch(`/api/endpoints/${endpointId}/requests`);
    setRequests(await res.json());
    setSelected(null);
  };

  const exportRequests = async () => {
    if (!endpointId) return;
    const res = await fetch(`/api/endpoints/${endpointId}/requests`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `endpoint-${uuid}-requests.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SidebarLayout>
    <div className="container" style={{maxWidth: '1200px'}}>
      <h1 className="header">Endpoint {uuid} <LiveIndicator /></h1>
      <div className="mb-2 space-x-2 text-left">
        <Button className="btn" onClick={exportRequests} variant="secondary">Export JSON</Button>
        <Button className="btn" onClick={clearRequests} variant="danger">Clear All</Button>
      </div>
      <div className="flex" style={{gap: '1rem', alignItems: 'flex-start'}}>
        <div style={{flex: '1'}}>
          <div className="mb-2 flex" style={{gap: '0.5rem', alignItems: 'center'}}>
            <select className="url-box" value={methodFilter} onChange={e => setMethodFilter(e.target.value)}>
              <option value="">All methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
              <option value="DELETE">DELETE</option>
            </select>
            <SearchInput value={search} onChange={setSearch} />
          </div>
          {search && (
            <div className="mb-2 text-left">
              <span className="text-sm">{filtered.length} {filtered.length === 1 ? 'match' : 'matches'}</span>
            </div>
          )}
          {filtered.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            <RequestList
              requests={filtered}
              activeId={selected?.id || null}
              onSelect={setSelected}
              highlight={search}
            />
          )}
        </div>
        <div style={{flex: '1'}}>
          {selected ? (
            <RequestInspector request={selected} endpointUuid={uuid as string} />
          ) : (
            <p>Select a request to inspect</p>
          )}
        </div>
      </div>
    </div>
    </SidebarLayout>
  );
};

export default EndpointPage;
