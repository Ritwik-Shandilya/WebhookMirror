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
    <div className="p-8 space-y-4 font-sans">
      <h1 className="text-3xl font-semibold">WebhookMirror</h1>
      <p className="text-gray-600">Generate a unique capture URL to inspect webhook payloads.</p>
      <button
        onClick={createEndpoint}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        {loading && <span className="loading-spinner" />}<span>{loading ? 'Creating...' : 'Create endpoint'}</span>
      </button>
    </div>
  );
};

export default Home;
