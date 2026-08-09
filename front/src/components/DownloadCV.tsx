/**
 * The single source of truth for the Download CV action.
 *
 * Previously this was four separate `href="#download-cv"` anchors. Under
 * `createHashRouter` that sets `location.hash`, which react-router parses as the
 * pathname `download-cv` — matching no route and replacing the page with an
 * error screen. Never use `href="#..."` in this app.
 *
 * BASE_URL is load-bearing: vite.config.ts derives `base` from FIGMA_PUBLIC_URL,
 * so a hardcoded "/Youssif-Hassan-CV.pdf" 404s on the hosted build.
 *
 * REQUIRED ASSET: front/public/Youssif-Hassan-CV.pdf must exist. Without it the
 * dev server's SPA fallback serves index.html, so the visitor downloads an HTML
 * file with a .pdf extension.
 */
const CV_FILE = "Youssif-Hassan-CV.pdf";
const CV_URL = `${import.meta.env.BASE_URL}${CV_FILE}`;

type Variant = "primary" | "hero" | "outline" | "block";

const VARIANTS: Record<Variant, string> = {
  // Header CTA — rounded-lg like every other button; it was the lone `rounded`.
  primary:
    "px-4 py-2 text-sm font-medium bg-[#3776AB] hover:bg-[#4B9CD3] active:brightness-95 text-white rounded-lg transition-colors duration-150 font-sans",
  // Home hero, sits beside the primary "Explore My Projects" button
  hero:
    "px-5 py-2.5 bg-[#172033] hover:bg-[#111827] active:bg-[#080D18] border border-[#243044] hover:border-[#3776AB] text-[#F8FAFC] font-semibold text-sm rounded-lg transition-all duration-150",
  // Contact sidebar
  outline:
    "w-full py-2.5 bg-[#172033] hover:bg-[#111827] active:bg-[#080D18] border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-medium rounded-lg transition-all",
  // Mobile menu footer
  block:
    "w-full py-3 text-sm font-semibold bg-[#3776AB] hover:bg-[#4B9CD3] active:brightness-95 text-white rounded-lg transition-colors",
};

export default function DownloadCV({
  variant = "primary",
  showIcon = false,
  className = "",
}: {
  variant?: Variant;
  showIcon?: boolean;
  className?: string;
}) {
  return (
    <a
      href={CV_URL}
      download={CV_FILE}
      className={`inline-flex items-center justify-center gap-2 active:scale-[0.98] ${VARIANTS[variant]} ${className}`}
    >
      {showIcon && (
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
      Download CV
    </a>
  );
}
