interface TechBadgeProps {
  label: string;
  variant?: "default" | "django" | "python" | "devops" | "ai" | "dim";
  size?: "sm" | "md";
}

const DJANGO_TECHS = ["Django", "Django REST Framework", "DRF", "Django ORM"];
const PYTHON_TECHS = ["Python", "PyQt5"];
const DEVOPS_TECHS = ["Docker", "Docker Compose", "CI/CD", "GitHub Actions", "Nginx", "Apache", "AWS EC2", "Prometheus", "Grafana"];
const AI_TECHS = ["OpenAI GPT", "Google Gemini", "LangChain", "YOLO", "CNN", "Deep Neural Networks", "Machine Learning"];

function inferVariant(label: string): TechBadgeProps["variant"] {
  if (DJANGO_TECHS.some((t) => label.includes(t))) return "django";
  if (PYTHON_TECHS.some((t) => label.includes(t))) return "python";
  if (DEVOPS_TECHS.some((t) => label.includes(t))) return "devops";
  if (AI_TECHS.some((t) => label.includes(t))) return "ai";
  return "default";
}

export default function TechBadge({ label, variant, size = "sm" }: TechBadgeProps) {
  const resolvedVariant: NonNullable<TechBadgeProps["variant"]> = variant ?? inferVariant(label) ?? "default";

  const styles: Record<NonNullable<TechBadgeProps["variant"]>, string> = {
    default: "bg-[#172033] text-[#94A3B8] border border-[#243044]",
    django: "bg-[#0C4B33]/30 text-[#44B78B] border border-[#0C4B33]/50",
    python: "bg-[#3776AB]/15 text-[#4B9CD3] border border-[#3776AB]/30",
    devops: "bg-[#172033] text-[#94A3B8] border border-[#243044]",
    ai: "bg-purple-950/30 text-purple-300 border border-purple-800/30",
    dim: "bg-transparent text-[#64748B] border border-[#1a2538]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center font-mono rounded ${styles[resolvedVariant]} ${sizeStyles[size]} whitespace-nowrap`}
    >
      {label}
    </span>
  );
}
