import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [endpoint, setEndpoint] = useState<string | null>(null);

  const createEndpoint = async () => {
    const res = await fetch('/api/endpoints', { method: 'POST' });
    const data = await res.json();
    setEndpoint(data.uuid);
  };

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl mb-4">WebhookMirror</h1>
      {endpoint ? (
        <div>
          <p>Your endpoint URL:</p>
          <code>{window.location.origin + '/' + endpoint}</code>
        </div>
      ) : (
        <button onClick={createEndpoint} className="bg-blue-500 text-white px-4 py-2 rounded">Create Endpoint</button>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
