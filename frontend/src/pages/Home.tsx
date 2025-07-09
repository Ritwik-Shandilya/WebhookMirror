import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';

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
    <div className="home-page">
      <style>{`
        .home-page {
          font-family: Arial, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          color: #1f2937;
        }
        .hero {
          text-align: center;
          padding: 3rem 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .hero h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .hero h1 span { color: #3B82F6; }
        .subtext {
          color: #6b7280;
          font-size: 1.125rem;
          max-width: 600px;
          margin-bottom: 2rem;
        }
        .cta {
          background: #22C55E;
          color: #ffffff;
          border: none;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 6px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: background 0.2s, transform 0.1s;
        }
        .cta:hover { background: #16a34a; }
        .cta:active { transform: translateY(1px); }
        .features {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem 1rem 3rem;
          flex-wrap: wrap;
        }
        .feature {
          background: #ffffff;
          padding: 1rem 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          font-weight: 600;
          min-width: 120px;
          text-align: center;
        }
        .actions {
          padding-bottom: 2rem;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .hero h1 { font-size: 3rem; }
          .subtext { font-size: 1.25rem; }
        }
      `}</style>
      <SiteHeader />
      <main className="hero">
        <h1>Debug webhooks <span>effortlessly</span></h1>
        <p className="subtext">Spin up a session-based URL and watch your requests arrive in real time.</p>
        <button className="cta" onClick={createEndpoint}>Start Testing Now</button>
      </main>
      <section className="features">
        <div className="feature">Instant</div>
        <div className="feature">100% Free</div>
        <div className="feature">Real-time</div>
      </section>
      <div className="actions">
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/api-test" className="btn">API Tester</Link>
      </div>
    </div>
  );
};

export default Home;
