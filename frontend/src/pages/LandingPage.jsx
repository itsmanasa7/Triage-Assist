import { useNavigate } from "react-router-dom";
import StatsFooter from "../components/StatsFooter";
import HowItWorks from "../components/HowItWorks";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="page-landing">
      <div className="container landing-content">
        <div className="logo-mark" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="16" fill="#58a6ff" fillOpacity="0.12" />
            <path d="M28 14v28M14 28h28" stroke="#58a6ff" strokeWidth="4" strokeLinecap="round" />
            <circle cx="28" cy="28" r="10" stroke="#58a6ff" strokeWidth="3" />
          </svg>
        </div>

        <h1 className="landing-title">
          SAHAYAK<span className="accent-dot">.</span>AI
        </h1>

        <p className="landing-tagline">
          AI Triage Assistant for Rural Health Workers
        </p>

        <p className="landing-description">
          Describe patient symptoms in plain language. Get instant,
          evidence-aligned triage guidance. Every interaction is encrypted at rest.
        </p>

        <button
          id="start-triage-btn"
          className="btn-primary landing-cta"
          onClick={() => navigate("/triage")}
        >
          Start Triage
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <HowItWorks />

        <div className="hackathon-badge">
          <span>Idea2Impact Hackathon 2026</span>
          <span className="badge-sep">·</span>
          <span>Theme 3: Crisis Management &amp; HealthTech</span>
        </div>
      </div>
      <StatsFooter />
    </div>
  );
}