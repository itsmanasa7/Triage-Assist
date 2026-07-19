import { useEffect, useState, useCallback } from "react";
import { fetchLogCount } from "../api/triageApi";

export default function StatsFooter({ refreshTrigger }) {
  const [count, setCount] = useState(null);
  const [offline, setOffline] = useState(false);

  const load = useCallback(() => {
    fetchLogCount()
      .then(n => { setCount(n); setOffline(false); })
      .catch(() => setOffline(true));
  }, []);

  useEffect(() => { load(); }, [load, refreshTrigger]);

  return (
    <footer className="stats-footer">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      {offline
        ? "Server offline — log count unavailable"
        : count === null
          ? "Connecting..."
          : `${count} consultation${count !== 1 ? "s" : ""} logged securely`}
    </footer>
  );
}