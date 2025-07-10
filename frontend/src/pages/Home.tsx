import React, { useEffect, useState } from 'react';
import SidebarLayout from '../components/SidebarLayout';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowMore(true);
    window.addEventListener('scroll', handleScroll, { once: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarLayout>
    <div className="home-page">
      <style>{`
        .home-page {
          font-family: Arial, sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #f9fafb;
          color: #1f2937;
          position: relative;
        }
        .home-top-actions {
          position: absolute;
          top: 2rem;
          right: 2rem;
          z-index: 10;
        }
        @media (max-width: 768px) {
          .home-top-actions {
            position: static;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
            right: 0;
            top: 0;
          }
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
          gap: 0.75rem;
          padding: 1rem;
          flex-wrap: wrap;
        }
        .feature {
          background: #22C55E;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .actions {
          padding-bottom: 2rem;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }
        .info-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          padding: 1rem;
          margin-bottom: 2rem;
        }
        .info-item {
          background: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          text-align: left;
          color: #6b7280;
          font-size: 1.125rem;
        }
        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .hero h1 { font-size: 3rem; }
          .subtext { font-size: 1.25rem; }
          .section-title { font-size: 3rem; }
          .info-item { font-size: 1.25rem; }
        }
      `}</style>
      <div className="home-top-actions">
        <button
          className="start-testing-btn home-cta-btn"
          onClick={() => navigate('/webhook')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Start Testing</span>
        </button>
      </div>
      <main className="hero">
        <h1>Debug webhooks <span>effortlessly</span></h1>
        <p className="subtext">Spin up a session-based URL and watch your requests arrive in real time.</p>
        {/* Removed endpoint creation controls */}
      </main>
      <section className="features">
        <div className="feature">Easy setup</div>
        <div className="feature">Open source</div>
        <div className="feature">Session-based</div>
      </section>
      {showMore && (
        <>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Example curl command:</p>
          <pre className="code-box" style={{ display: 'inline-block', textAlign: 'left' }}>{`curl -X POST http://localhost:3000/<endpoint-id> -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
        </div>
        <h2 className="section-title">Features</h2>
        <div className="info-grid">
          <div className="info-item">Sidebar navigation with quick access to Start Testing, Dashboard and API Tester</div>
          <div className="info-item">Export captured requests to JSON</div>
          <div className="info-item">Clear all requests for an endpoint</div>
          <div className="info-item">Copy any request as a cURL command</div>
        </div>
        <h2 className="section-title">How it works</h2>
        <div className="info-grid">
          <div className="info-item">1. Create a unique endpoint from the Start Testing page</div>
          <div className="info-item">2. Send HTTP requests from your service or via curl</div>
          <div className="info-item">3. Inspect the requests here in real time</div>
        </div>
        </>
      )}
    </div>
    </SidebarLayout>
  );
};

export default Home;
