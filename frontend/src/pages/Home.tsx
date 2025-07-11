import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import { Button } from "@bigbinary/neetoui";

const features = [
  {
    title: "Real-time Capture",
    description: "See HTTP requests appear instantly as they hit your endpoint. No refresh needed!",
    color: "#e0f2fe",
    accent: "#2563eb",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#2563eb" fillOpacity="0.12" />
        <path d="M32 16v32M16 32h32" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Request Inspector",
    description: "Peek into headers, body, and cookies. Debug with clarity and confidence.",
    color: "#fef9c3",
    accent: "#eab308",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#eab308" fillOpacity="0.12" />
        <rect x="20" y="20" width="24" height="24" rx="6" stroke="#eab308" strokeWidth="4" />
        <circle cx="32" cy="32" r="6" stroke="#eab308" strokeWidth="3" />
      </svg>
    )
  },
  {
    title: "Replay Requests",
    description: "Edit and resend any captured request. Test integrations and debug with ease!",
    color: "#e0e7ff",
    accent: "#6366f1",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#6366f1" fillOpacity="0.12" />
        <path d="M44 32c0-6.627-5.373-12-12-12s-12 5.373-12 12m0 0l4-4m-4 4l4 4" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: "Export & Share",
    description: "Export requests as JSON or cURL. Share with your team or save for later.",
    color: "#f3e8ff",
    accent: "#a21caf",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#a21caf" fillOpacity="0.12" />
        <path d="M24 40l8-8 8 8" stroke="#a21caf" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="20" y="20" width="24" height="8" rx="2" stroke="#a21caf" strokeWidth="3" />
      </svg>
    )
  },
  {
    title: "Instant Setup",
    description: "No sign-up, no hassle. Create endpoints and start testing in seconds!",
    color: "#dcfce7",
    accent: "#16a34a",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#16a34a" fillOpacity="0.12" />
        <path d="M32 20v16M32 36l6 6M32 36l-6 6" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: "Open Source",
    description: "Free for everyone. Fork, contribute, and make it yours!",
    color: "#f1f5f9",
    accent: "#334155",
    svg: (
      <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="32" fill="#334155" fillOpacity="0.12" />
        <path d="M24 40V24h16v16" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
        <circle cx="32" cy="32" r="6" stroke="#334155" strokeWidth="3" />
      </svg>
    )
  }
];

const Home = () => {
  return (
    <SidebarLayout>
      <div className="home-landing-scroll">
        <div className="home-top-actions-sticky">
          <Button
            label="Start Testing"
            style={{ minWidth: 120, background: '#7a6401', color: '#fff', border: 'none' }}
            size="large"
            className="home-cta-btn"
            onClick={() => window.location.href = "/webhook"}
          />
        </div>
        <section className="hero-section">
          <h1 className="hero-title">
            Debug webhooks <span className="hero-accent">effortlessly</span>
          </h1>
          <p className="hero-subtext">
            Spin up a session-based URL and watch your requests arrive in real time.
          </p>
        </section>
        {features.map((f, i) => (
          <section
            className="feature-section"
            key={f.title}
            style={{ background: f.color }}
          >
            <div className={`feature-content ${i % 2 === 1 ? 'reverse' : ''}`}>
              <div className="feature-svg">{f.svg}</div>
              <div className="feature-text">
                <h2 className="feature-title" style={{ color: f.accent }}>{f.title}</h2>
                <p className="feature-desc">{f.description}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
      <style>{`
        .home-landing-scroll {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: flex-start;
          overflow-y: auto;
          background: #f8fafc;
        }
        .home-top-actions-sticky {
          position: sticky;
          top: 0;
          right: 0;
          z-index: 20;
          display: flex;
          justify-content: flex-end;
          padding: 2rem 2rem 0 2rem;
          background: linear-gradient(to bottom, #f8fafc 90%, transparent 100%);
        }
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 8rem 0;
          margin-bottom: 2rem;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .hero-accent {
          color: #2563eb;
        }
        .hero-subtext {
          color: #6b7280;
          font-size: 1.25rem;
          text-align: center;
          max-width: 600px;
          margin-bottom: 2.5rem;
        }
        .feature-section {
          width: 100%;
          padding: 3rem 0;
          display: flex;
          justify-content: center;
        }
        .feature-content {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          max-width: 900px;
          width: 100%;
          padding: 0 2rem;
        }
        .feature-content.reverse {
          flex-direction: row-reverse;
        }
        .feature-svg {
          flex: 0 0 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .feature-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .feature-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          color: #334155;
          font-size: 1.15rem;
          line-height: 1.6;
        }
        @media (max-width: 900px) {
          .feature-content {
            flex-direction: column !important;
            gap: 1.5rem;
            padding: 0 1rem;
          }
          .feature-svg {
            margin-bottom: 1rem;
          }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem; }
          .home-top-actions-sticky { padding: 1rem 1rem 0 1rem; }
          .feature-section { padding: 2rem 0; }
        }
      `}</style>
    </SidebarLayout>
  );
};

export default Home;
