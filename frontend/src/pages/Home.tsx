import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import { Button } from "@bigbinary/neetoui";

const featureCards = [
  {
    title: "Easy setup",
    description: "Get started in seconds with a simple, intuitive interface."
  },
  {
    title: "Open source",
    description: "Completely open source and free to use for everyone."
  },
  {
    title: "Session-based",
    description: "Each endpoint is isolated and session-based for privacy."
  }
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
        <div className="feature-cards-wrapper">
          <div className="feature-cards">
            {featureCards.map(card => (
              <div className="feature-card" key={card.title}>
                <div className="feature-card-title">{card.title}</div>
                <div className="feature-card-desc">{card.description}</div>
              </div>
            ))}
          </div>
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
        .feature-cards-wrapper {
          width: 100%;
          max-width: 900px;
          margin-top: 4rem;
          display: flex;
          justify-content: flex-start;
        }
        .feature-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          width: 100%;
        }
        .feature-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 4px 24px rgba(37, 99, 235, 0.08), 0 1.5px 6px rgba(16, 185, 129, 0.07);
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          min-height: 140px;
          transition: box-shadow 0.2s, transform 0.2s;
          border: 1px solid #f3f4f6;
        }
        .feature-card:hover {
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.13), 0 3px 12px rgba(16, 185, 129, 0.12);
          transform: translateY(-4px) scale(1.03);
        }
        .feature-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #16a34a;
          margin-bottom: 0.5rem;
        }
        .feature-card-desc {
          color: #6b7280;
          font-size: 1.05rem;
        }
        @media (max-width: 900px) {
          .feature-cards {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            max-width: 400px;
          }
          .feature-cards-wrapper {
            justify-content: center;
          }
        }
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem; }
          .home-top-actions { right: 1rem; top: 1rem; }
          .feature-cards { margin-top: 2rem; }
        }
      `}</style>
    </SidebarLayout>
  );
};

export default Home;
