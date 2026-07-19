import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTriage } from "../api/triageApi";
import ResultCard from "../components/ResultCard";
import StatsFooter from "../components/StatsFooter";
import DisclaimerBanner from "../components/DisclaimerBanner";

const PLACEHOLDER = "Describe patient symptoms in your own words...\n\nExample: Child, 5 years old, has had high fever for 3 days, now having difficulty breathing and bluish lips.";
const MAX_CHARS = 1000;

export default function TriagePage() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationMsg, setValidationMsg] = useState(null);

  async function handleAnalyze() {
    const trimmed = symptoms.trim();

    // Client-side validation
    if (!trimmed) {
      setValidationMsg("Please describe the patient symptoms before analyzing.");
      return;
    }
    if (trimmed.length > MAX_CHARS) {
      setValidationMsg(`Description too long — please keep it under ${MAX_CHARS} characters.`);
      return;
    }

    setValidationMsg(null);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await fetchTriage(trimmed);
      setResult(data);
    } catch (err) {
      if (err.message.includes("429")) {
        setError("Too many requests — please wait a moment before trying again.");
      } else if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("Load failed") ||
        err.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        setError("Cannot reach server — check connection or confirm the backend is running.");
      } else {
        setError(`Server error: ${err.message}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAnalyze();
  }

  function handleReset() {
    setResult(null);
    setSymptoms("");
    setError(null);
    setValidationMsg(null);
  }

  const charCount = symptoms.length;
  const nearLimit = charCount > MAX_CHARS * 0.85;

  return (
    <div className="page-triage">
      <header className="triage-header">
        <button className="back-btn" onClick={() => navigate("/")} aria-label="Back to home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="triage-header-title">TRIAGE<span className="accent-dot">-</span>ASSIST</span>
        <div style={{ width: 32 }} />
      </header>

      <DisclaimerBanner />

      <main className="container triage-main">
        <h2 className="triage-title">Patient Triage</h2>
        <p className="triage-subtitle">Describe the patient symptoms below. Be as detailed as possible.</p>

        <div className="input-group">
          <textarea
            id="symptoms-input"
            className={`symptom-textarea${validationMsg ? " textarea--error" : ""}`}
            value={symptoms}
            onChange={e => { setSymptoms(e.target.value); if (validationMsg) setValidationMsg(null); }}
            onKeyDown={handleKeyDown}
            placeholder={PLACEHOLDER}
            rows={6}
            maxLength={MAX_CHARS + 50}
            aria-label="Patient symptom description"
            aria-describedby={validationMsg ? "validation-msg" : undefined}
          />
          <div className="input-meta">
            {validationMsg ? (
              <p id="validation-msg" className="validation-msg" role="alert">{validationMsg}</p>
            ) : (
              <p className="input-hint">Tip: Press Ctrl + Enter to analyze quickly</p>
            )}
            <span className={`char-count${nearLimit ? " char-count--warn" : ""}`}>
              {charCount}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <button
          id="analyze-btn"
          className="btn-primary analyze-btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
              Analyze Symptoms
            </>
          )}
        </button>

        {error && (
          <div className="error-banner" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0}}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="result-section-wrapper">
            <p className="result-heading">Triage Result</p>
            <ResultCard result={result} />
            <button className="btn-ghost reset-btn" onClick={handleReset}>
              New Triage
            </button>
          </div>
        )}
      </main>

      <StatsFooter />
    </div>
  );
}