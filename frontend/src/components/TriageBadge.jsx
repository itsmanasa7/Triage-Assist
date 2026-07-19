export default function TriageBadge({ level }) {
  const labels = {
    emergency: "Emergency",
    urgent: "Urgent",
    routine: "Routine",
    unclear: "Unclear",
  };
  return (
    <span className={`badge badge--${level ?? "unclear"}`}>
      {labels[level] ?? "Unknown"}
    </span>
  );
}