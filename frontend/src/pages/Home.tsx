import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createEndpoint = async () => {
    setLoading(true);
    const res = await fetch('/api/endpoints', { method: 'POST' });
    const data = await res.json();
    setLoading(false);
    navigate(`/endpoint/${data.uuid}`);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl mb-4">WebhookMirror</h1>
      <button onClick={createEndpoint} disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded">
        {loading ? 'Creating...' : 'Create Endpoint'}
      </button>
    </div>
  );
};

export default Home;
