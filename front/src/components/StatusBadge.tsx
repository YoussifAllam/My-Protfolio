interface StatusBadgeProps {
  status: string;
}

function getStatusStyle(status: string): { dot: string; badge: string } {
  const s = status.toLowerCase();
  if (s.includes("production") || s.includes("active"))
    return { dot: "bg-[#22C55E]", badge: "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/25" };
  if (s.includes("development") || s.includes("progress"))
    return { dot: "bg-[#FFD343]", badge: "bg-[#FFD343]/10 text-[#FFD343] border-[#FFD343]/25" };
  if (s.includes("completed") || s.includes("deployed"))
    return { dot: "bg-[#4B9CD3]", badge: "bg-[#4B9CD3]/10 text-[#4B9CD3] border-[#4B9CD3]/25" };
  if (s.includes("research"))
    return { dot: "bg-[#44B78B]", badge: "bg-[#44B78B]/10 text-[#44B78B] border-[#44B78B]/25" };
  if (s.includes("service"))
    return { dot: "bg-[#64748B]", badge: "bg-[#64748B]/10 text-[#94A3B8] border-[#64748B]/25" };
  return { dot: "bg-[#64748B]", badge: "bg-[#172033] text-[#94A3B8] border-[#243044]" };
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { dot, badge } = getStatusStyle(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm border font-mono text-2xs ${badge}`}
      aria-label={`Status: ${status}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
