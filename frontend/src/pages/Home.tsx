import React from 'react';
import SidebarLayout from '../components/SidebarLayout';

const Home = () => {

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
        .info-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          padding: 1rem;
          margin-bottom: 2rem;
        }
        .info-item {
          background: #ffffff;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          text-align: left;
        }
        @media (min-width: 768px) {
          .hero h1 { font-size: 3rem; }
          .subtext { font-size: 1.25rem; }
        }
      `}</style>
      <main className="hero">
        <h1>Debug webhooks <span>effortlessly</span></h1>
        <p className="subtext">Spin up a session-based URL and watch your requests arrive in real time.</p>
        {/* Removed endpoint creation controls */}
      </main>
      <section className="features">
        <div className="feature">Instant</div>
        <div className="feature">100% Free</div>
        <div className="feature">Real-time</div>
      </section>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ marginBottom: '0.5rem' }}>Example curl command:</p>
        <pre className="code-box" style={{ display: 'inline-block', textAlign: 'left' }}>{`curl -X POST http://localhost:3000/<endpoint-id> -H "Content-Type: application/json" -d '{"hello":"world"}'`}</pre>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Features</h2>
      <div className="info-grid">
        <div className="info-item">Sidebar navigation with quick access to Start Testing, Dashboard and API Tester</div>
        <div className="info-item">Export captured requests to JSON</div>
        <div className="info-item">Clear all requests for an endpoint</div>
        <div className="info-item">Copy any request as a cURL command</div>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>How it works</h2>
      <div className="info-grid">
        <div className="info-item">1. Create a unique endpoint from the Start Testing page</div>
        <div className="info-item">2. Send HTTP requests from your service or via curl</div>
        <div className="info-item">3. Inspect the requests here in real time</div>
      </div>
    </div>
    </SidebarLayout>
  );
};

export default Home;
