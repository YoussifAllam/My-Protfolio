import { useEffect, useState } from "react";

/**
 * Trimmed from five fact pairs to three: `experience` is stated in the hero
 * copy and `additional_expertise` is what the Core Specializations section is
 * for. The same five facts used to appear four times on the Home page.
 */
const LINES = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Youssif Hassan — Python Backend Developer" },
  { prompt: true, text: "main_specialization" },
  { prompt: false, text: "Django · DRF · PostgreSQL · Redis · Celery" },
  { prompt: true, text: "location" },
  { prompt: false, text: "Cairo, Egypt · available remote" },
];

export default function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleLines(LINES.length);
      return;
    }

    let current = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (current >= LINES.length) return;
      current += 1;
      setVisibleLines(current);
      // Read the delay for the line just shown — this indexed `current` after
      // incrementing, so the first delay was skipped and the last was undefined.
      const next = current % 2 === 0 ? 280 : 120;
      timeout = setTimeout(showNext, next);
    };

    timeout = setTimeout(showNext, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="bg-[#080D18] border border-[#243044] rounded-xl overflow-hidden font-mono"
      role="region"
      aria-label="Developer profile"
    >
      {/* Title bar. The macOS traffic lights that used to sit here are the
          single most template-looking element a developer portfolio can carry —
          and three off-palette colours besides. */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#243044] bg-[#0B1120]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#44B78B]" aria-hidden="true" />
        <span className="text-xs text-[#7C8BA3]">youssif@python-backend ~ zsh</span>
      </div>

      {/* The animated region is decorative — it announced all ten lines one at
          a time to screen readers. The same facts are exposed once, statically,
          in the sr-only block below. */}
      <div className="p-5 space-y-1.5" aria-hidden="true">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="text-sm leading-relaxed">
            {line.prompt ? (
              <span>
                <span className="text-[#44B78B]">$ </span>
                <span className="text-[#4B9CD3]">{line.text}</span>
              </span>
            ) : (
              <span className="text-[#F8FAFC] pl-3">{line.text}</span>
            )}
          </div>
        ))}
        <div className="text-sm">
          <span className="text-[#44B78B]">$ </span>
          <span className="terminal-cursor" />
        </div>
      </div>

      <ul className="sr-only">
        {LINES.filter((l) => !l.prompt).map((l) => (
          <li key={l.text}>{l.text}</li>
        ))}
      </ul>
    </div>
  );
}
