import { useState } from "react";

const HOW_IT_WORKS = [
  {
    icon: "search",
    title: "Semantic Search",
    body: "Your symptom description is converted into a mathematical embedding using a sentence-transformer model. The AI retrieves the 3 most semantically similar entries from a curated rural-health knowledge base.",
  },
  {
    icon: "shield",
    title: "Guidance, Not Diagnosis",
    body: "Results are reference guidance aligned with standard triage protocols. They are not a diagnosis or replacement for professional medical care. Always involve a qualified health worker or doctor.",
  },
  {
    icon: "lock",
    title: "Privacy First",
    body: "All consultations are encrypted with AES-256 (Fernet) before being stored. No names or personal identifiers are ever recorded. Data stays on your local server.",
  },
];

const ICON_MAP = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  lock: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
};

export default function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="how-it-works">
      <button
        className="hiw-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        id="how-it-works-toggle"
      >
        <span>How this works</span>
        <svg
          className={`hiw-chevron${open ? " hiw-chevron--open" : ""}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="hiw-content" role="region" aria-label="How Triage Assist works">
          {HOW_IT_WORKS.map(item => (
            <div key={item.icon} className="hiw-item">
              <div className="hiw-icon">{ICON_MAP[item.icon]}</div>
              <div>
                <p className="hiw-item-title">{item.title}</p>
                <p className="hiw-item-body">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}