import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import { Button } from "@bigbinary/neetoui";

const featureBadges = [
  "Easy setup",
  "Open source",
  "Session-based"
];

const Home = () => {
  return (
    <SidebarLayout>
      <div className="home-landing">
        <div className="home-top-actions">
          <Button
            label="Start Testing"
            style={{ minWidth: 120 }}
            size="large"
            className="home-cta-btn"
            onClick={() => window.location.href = "/webhook"}
          />
        </div>
        <div className="hero-section">
          <h1 className="hero-title">
            Debug webhooks <span className="hero-accent">effortlessly</span>
          </h1>
          <p className="hero-subtext">
            Spin up a session-based URL and watch your requests arrive in real time.
          </p>
        </div>
        <div className="feature-badges">
          {featureBadges.map(badge => (
            <span className="feature-badge" key={badge}>{badge}</span>
          ))}
        </div>
      </div>
      <style>{`
        .home-landing {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #f8fafc;
        }
        .home-top-actions {
          position: absolute;
          top: 2rem;
          right: 2rem;
          z-index: 10;
        }
        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          margin-top: 6vh;
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
        .feature-badges {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 4rem;
        }
        .feature-badge {
          background: #e6f9ed;
          color: #16a34a;
          padding: 0.5em 1.5em;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 1.05rem;
          box-shadow: none;
          border: none;
          cursor: default;
          letter-spacing: 0.01em;
          transition: none;
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem; }
          .home-top-actions { right: 1rem; top: 1rem; }
          .feature-badges { flex-direction: column; gap: 0.5rem; margin-top: 2rem; }
        }
      `}</style>
    </SidebarLayout>
  );
};

export default Home;
