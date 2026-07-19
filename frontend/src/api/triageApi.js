const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchTriage(symptoms) {
  const res = await fetch(`${BASE_URL}/triage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms }),
  });
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

export async function fetchLogCount() {
  try {
    const res = await fetch(`${BASE_URL}/logs/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.encrypted_log_count ?? 0;
  } catch {
    return 0;
  }
}

export async function fetchHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}