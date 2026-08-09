import { useId, type ReactNode } from "react";

/**
 * Page section with a consistent vertical rhythm.
 *
 * Sections previously carried ad-hoc bottom margins — mb-20/20/20/24/24 on
 * Home, mb-16/14/12/10 elsewhere — and Home used pt-28 against pt-24 on every
 * other page. Owning the padding here means adjacent sections always produce a
 * predictable gutter, and banded sections can go full-bleed without each page
 * re-deriving the container.
 */

type Space = "tight" | "default" | "loose";
type Tone = "plain" | "band";
type Width = "wide" | "narrow" | "prose";

const PAD_TOP: Record<Space, string> = {
  tight: "pt-10 sm:pt-12",
  default: "pt-14 sm:pt-20",
  loose: "pt-16 sm:pt-24",
};

const PAD_BOTTOM: Record<Space, string> = {
  tight: "pb-10 sm:pb-12",
  default: "pb-14 sm:pb-20",
  loose: "pb-16 sm:pb-24",
};

/** Clearance for the fixed 64px nav, replacing the old pt-24/pt-28 split. */
const FIRST_TOP = "pt-24 sm:pt-28";

const WIDTH: Record<Width, string> = {
  wide: "max-w-7xl",
  narrow: "max-w-6xl",
  prose: "max-w-3xl",
};

export default function Section({
  children,
  first = false,
  space = "default",
  tone = "plain",
  width = "wide",
  eyebrow,
  title,
  action,
  className = "",
  ...rest
}: {
  children: ReactNode;
  /** Adds clearance for the fixed 64px nav. Exactly one Section per page. */
  first?: boolean;
  space?: Space;
  tone?: Tone;
  width?: Width;
  /** Mono line above the title, e.g. "// expertise". */
  eyebrow?: string;
  title?: ReactNode;
  /** Trailing control in the header row, e.g. an "All projects →" link. */
  action?: ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "title">) {
  const headingId = useId();
  const hasHeader = Boolean(eyebrow || title || action);

  return (
    <section
      className={[
        tone === "band" ? "bg-[#0B1120] border-y border-[#1a2538]" : "",
        first ? FIRST_TOP : PAD_TOP[space],
        PAD_BOTTOM[space],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // Only claim a labelled region when there is a real heading to point at.
      {...(title ? { "aria-labelledby": headingId } : {})}
      {...rest}
    >
      <div className={`${WIDTH[width]} mx-auto px-4 sm:px-6 lg:px-8`}>
        {hasHeader && (
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              {eyebrow && (
                <p className="font-mono text-xs text-[#4B9CD3] mb-2">{eyebrow}</p>
              )}
              {title && (
                <h2 id={headingId} className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">
                  {title}
                </h2>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
