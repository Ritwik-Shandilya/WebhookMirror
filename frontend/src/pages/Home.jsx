import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const createEndpoint = async () => {
    try {
      const res = await fetch('/api/endpoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expires_at: null })
      });
      if (!res.ok) throw new Error('Failed to create endpoint');
      const data = await res.json();
      if (!data.uuid) throw new Error('Invalid response');
      navigate(`/endpoint/${data.uuid}`);
    } catch (err) {
      alert('Failed to create endpoint. Is the backend running?');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Webhook Mirror</div>
        <button className="start-btn" onClick={createEndpoint}>Start Testing</button>
      </header>
      <main className="hero">
        <h1>Test webhooks <span className="accent">instantly</span> with session-based URLs</h1>
        <p className="subtext">Capture, inspect and debug HTTP requests in real time. No sign up required.</p>
        <button className="cta" onClick={createEndpoint}>Start Testing Now</button>
        <div className="features">
          <div className="feature">Instant</div>
          <div className="feature">100% Free</div>
          <div className="feature">Real-time</div>
        </div>
      </main>
      <style>{`
        .home-container {
          min-height: 100vh;
          background: #ffffff;
          color: #1f2937;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
        }
        .home-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          background: #ffffff;
          z-index: 10;
        }
        .logo {
          font-weight: 700;
          font-size: 1.25rem;
        }
        .start-btn {
          background: #22C55E;
          color: #ffffff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .start-btn:hover {
          background: #16a34a;
        }
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 1rem;
        }
        .hero h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .accent {
          color: #3B82F6;
        }
        .subtext {
          color: #6B7280;
          font-size: 1.125rem;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        .cta {
          background: #22C55E;
          color: #ffffff;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.25rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .cta:hover {
          background: #16a34a;
        }
        .features {
          display: flex;
          gap: 1rem;
          margin-top: 3rem;
        }
        .feature {
          background: #F9FAFB;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          font-weight: 600;
        }
        @media (max-width: 640px) {
          .hero h1 {
            font-size: 2rem;
          }
          .features {
            flex-direction: column;
            align-items: center;
          }
        }
        @media (min-width: 768px) {
          .hero h1 {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
