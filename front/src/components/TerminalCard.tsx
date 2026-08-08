import { useEffect, useState } from "react";

const LINES = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "Youssif Hassan — Python Backend Developer" },
  { prompt: true, text: "experience" },
  { prompt: false, text: "2.5+ years" },
  { prompt: true, text: "main_specialization" },
  { prompt: false, text: "Django · DRF · PostgreSQL · Redis · Celery" },
  { prompt: true, text: "additional_expertise" },
  { prompt: false, text: "PyQt5 · DevOps · AI · Machine Learning" },
  { prompt: true, text: "location" },
  { prompt: false, text: "Cairo, Egypt" },
];

export default function TerminalCard() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisibleLines(LINES.length);
      setDone(true);
      return;
    }

    let current = 0;
    const delays = LINES.map((_, i) => (i === 0 ? 400 : i % 2 === 0 ? 280 : 120));
    let timeout: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (current >= LINES.length) {
        setDone(true);
        return;
      }
      current += 1;
      setVisibleLines(current);
      timeout = setTimeout(showNext, delays[current] ?? 200);
    };

    timeout = setTimeout(showNext, 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="bg-[#080D18] border border-[#243044] rounded-xl overflow-hidden font-mono"
      role="region"
      aria-label="Developer profile terminal"
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#243044] bg-[#0B1120]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F56]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
        <span className="w-3 h-3 rounded-full bg-[#27C93F]" aria-hidden="true" />
        <span className="ml-3 text-xs text-[#64748B]">youssif@python-backend ~ zsh</span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-1.5" aria-live="polite" aria-label="Terminal output">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="text-sm leading-relaxed">
            {line.prompt ? (
              <span>
                <span className="text-[#22C55E]">$ </span>
                <span className="text-[#4B9CD3]">{line.text}</span>
              </span>
            ) : (
              <span className="text-[#F8FAFC] pl-3">{line.text}</span>
            )}
          </div>
        ))}

        {/* Cursor */}
        {!done && (
          <div className="text-sm">
            <span className="text-[#22C55E]">$ </span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        )}

        {done && (
          <div className="text-sm">
            <span className="text-[#22C55E]">$ </span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  );
}
