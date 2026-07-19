import TriageBadge from "./TriageBadge";

const levelColors = {
  emergency: "var(--clr-emergency)",
  urgent:    "var(--clr-urgent)",
  routine:   "var(--clr-routine)",
  unclear:   "var(--clr-unclear)",
};

export default function ResultCard({ result }) {
  const { triage_level, condition, recommended_action, red_flags, confidence } = result;
  const borderColor = levelColors[triage_level] ?? "var(--clr-border)";
  const pct = Math.round((confidence ?? 0) * 100);

  return (
    <div
      className="card result-card"
      style={{ borderLeftColor: borderColor, borderLeftWidth: "4px" }}
    >
      <div className="result-header">
        <TriageBadge level={triage_level} />
        <span className="confidence-pill">{pct}% match</span>
      </div>

      {condition && (
        <div className="result-section">
          <p className="result-label">Likely Condition</p>
          <p className="result-value">{condition}</p>
        </div>
      )}

      <div className="result-section">
        <p className="result-label">Recommended Action</p>
        <p className="result-value action-text">{recommended_action}</p>
      </div>

      {red_flags && red_flags.length > 0 && (
        <div className="result-section red-flags-section">
          <p className="result-label danger-label">Warning - Red Flags - Escalate Immediately</p>
          <ul className="red-flags-list">
            {red_flags.map((flag, i) => (
              <li key={i}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}