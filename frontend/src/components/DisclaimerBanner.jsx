export default function DisclaimerBanner() {
  return (
    <div className="disclaimer-banner" role="note" aria-label="Medical disclaimer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink: 0, marginTop: "1px"}}>
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
      <span>
        This tool <strong>assists triage decisions only</strong>. Always escalate to a doctor for emergency or unclear cases. Not a replacement for professional medical care.
      </span>
    </div>
  );
}