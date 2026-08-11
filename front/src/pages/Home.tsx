import { useMemo } from "react";
import { Link } from "react-router";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import TerminalCard, { type TerminalLine } from "../components/TerminalCard";
import TechBadge from "../components/TechBadge";
import ProjectCard from "../components/ProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import DownloadCV from "../components/DownloadCV";
import Section from "../components/Section";
import { PageLoading, PageError } from "../components/ApiState";
import { useReveal } from "../hooks/useReveal";
import { useApi } from "../hooks/useApi";
import { getSummary } from "../lib/api";
import type { Project } from "../types/portfolio";

/**
 * Which profile metric links to which project. This attribution isn't
 * modeled on the backend (Profile.metrics is a flat value/label list), so the
 * mapping lives here as presentation logic — the numbers and labels
 * themselves still come from the API.
 *
 * Cut from the original 7 metrics deliberately: "2.5+ years" (already in the
 * hero copy), "1,000+ branches" (same fact as ~1B, split into two tiles it
 * only dilutes), "5K+ daily API requests" (0.06 req/s; beside "1B records" it
 * invites arithmetic that costs credibility — it stays on the Mutqinai page
 * where the context fits), "80% shorter deploys" (a second BAGGR delivery
 * metric in one strip).
 */
const PROOF_VALUES = ["~1B", "40%", "99.9%"] as const;
const PROOF_SLUGS: Record<string, string> = {
  "~1B": "jafco-analytics",
  "40%": "baggr-logistics",
  "99.9%": "baggr-logistics",
};
/** The one amber element allowed on the page. */
const LOUD_VALUE = "~1B";

const ICON_DESKTOP = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113 17H7a1 1 0 01-.704-1.69l.804-.321L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
  </svg>
);
const ICON_DEVOPS = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);
const ICON_AI = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M13 7H7v6h6V7z" />
    <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
  </svg>
);
const ICON_BACKEND = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

/**
 * Backend `SkillGroup`s are fine-grained (12 categories — "Databases",
 * "Caching & Queues", "Security", ... — see Experience.tsx, which lists all
 * of them). Home's specialization cards are a teaser, not the full inventory,
 * so groups are merged into the same 4 buckets the design already uses.
 * Matching is by exact category name; anything unmatched is simply not shown
 * here (it's still on /experience).
 */
const BUCKETS = [
  {
    id: "backend",
    title: "Backend Engineering",
    icon: ICON_BACKEND,
    accent: "bg-[#3776AB]/15 text-[#4B9CD3]",
    categories: ["Backend", "Databases", "Caching & Queues", "Security", "Version Control"],
  },
  {
    id: "desktop",
    title: "Desktop Applications",
    icon: ICON_DESKTOP,
    accent: "bg-[#172033] text-[#94A3B8]",
    categories: ["Desktop Development"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    icon: ICON_DEVOPS,
    accent: "bg-[#172033] text-[#94A3B8]",
    categories: ["DevOps & CI/CD", "Cloud & Infrastructure", "Monitoring"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    icon: ICON_AI,
    accent: "bg-[#7C5CFF]/15 text-[#A78BFA]",
    categories: ["Machine Learning", "Deep Learning", "AI Integrations"],
  },
] as const;

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className={className} aria-hidden="true">
    <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
  </svg>
);

function pickFlagship(projects: Project[]) {
  const flagship = projects.find((p) => p.biggestProject) ?? null;
  const rest = projects.filter((p) => p.slug !== flagship?.slug).slice(0, 3);
  return { flagship, rest };
}

export default function Home() {
  const { data: summary, loading, error, retry } = useApi(getSummary);

  // Hooks must run unconditionally — computed before the loading/error
  // returns below, even though their inputs are only meaningful once data
  // has arrived.
  const proofRef = useReveal<HTMLDivElement>({ group: true });
  const workRef = useReveal<HTMLDivElement>({ group: true });
  const specRef = useReveal<HTMLDivElement>({ group: true });

  const buckets = useMemo(() => {
    const skills = summary?.skills ?? [];
    return BUCKETS.map((bucket) => ({
      ...bucket,
      skills: skills
        .filter((g) => (bucket.categories as readonly string[]).includes(g.category))
        .flatMap((g) => g.skills),
    })).filter((bucket) => bucket.skills.length > 0);
  }, [summary]);

  const terminalLines: TerminalLine[] | undefined = useMemo(() => {
    const profile = summary?.profile;
    if (!profile) return undefined;
    return [
      { prompt: true, text: "whoami" },
      { prompt: false, text: `${profile.name} — ${profile.primaryRole}` },
      { prompt: true, text: "main_specialization" },
      { prompt: false, text: profile.techStack.slice(0, 5).join(" · ") },
      { prompt: true, text: "location" },
      { prompt: false, text: `${profile.location} · available remote` },
    ];
  }, [summary]);

  if (loading) return <PageLoading label="home" />;
  if (error || !summary?.profile) {
    return <PageError message={error ?? "No profile data was returned."} onRetry={retry} />;
  }

  const { profile, featuredProjects } = summary;
  const { flagship, rest: otherFeatured } = pickFlagship(featuredProjects);
  const aboutIntro =
    profile.aboutSections.find((s) => s.id === "intro")?.content ?? profile.summary;

  interface ProofItem {
    value: string;
    label: string;
    slug: string;
    name: string | undefined;
  }
  const proof: ProofItem[] = PROOF_VALUES.map((value): ProofItem | null => {
    const metric = profile.metrics.find((m) => m.value === value);
    if (!metric) return null;
    const slug = PROOF_SLUGS[value];
    const project = featuredProjects.find((p) => p.slug === slug);
    return { ...metric, slug, name: project?.name };
  }).filter((p): p is ProofItem => p !== null);

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Section first space="loose" aria-label="Introduction">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-14">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#44B78B]/25 bg-[#44B78B]/10 mb-7">
              <span className="w-2 h-2 rounded-full bg-[#44B78B] status-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-[#44B78B]">{profile.availability}</span>
            </div>

            {/* One h1. The name is what a recruiter confirms; the proposition
                is what they are scanning for, so it carries the display size. */}
            <h1 className="mb-6">
              <span className="block font-mono text-lg text-[#94A3B8] mb-4">
                {profile.name}
                <span className="text-[#7C8BA3] px-1.5">/</span>
                <span className="text-[#4B9CD3]">{profile.primaryRole}</span>
              </span>
              <span className="block text-display text-[#F8FAFC]">{profile.headline}</span>
            </h1>

            <p className="text-lead text-[#94A3B8] max-w-[46ch] mb-8">{profile.summary}</p>

            {/* One primary, one secondary, one text link. At 375 the primary
                goes full width, which kills the old 2+1 orphan wrap. */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
              <Link
                to="/projects"
                className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150 active:scale-[0.98] active:brightness-95"
              >
                See the work
                <Arrow />
              </Link>
              <div className="flex items-center gap-4">
                <DownloadCV variant="hero" />
                <Link
                  to="/contact"
                  className="text-sm font-medium text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors duration-150 active:opacity-70"
                >
                  Or get in touch →
                </Link>
              </div>
            </div>

            <ul className="flex flex-wrap gap-2 list-none" aria-label="Core technologies">
              {profile.techStack.slice(0, 5).map((tech) => (
                <li key={tech}>
                  <TechBadge label={tech} size="md" />
                </li>
              ))}
            </ul>
          </div>

          {/* items-stretch (the default) rather than items-center: centring the
              row was what left a large void beside the diagram at desktop. */}
          <div
            className="bg-[#0B1120] border border-[#243044] rounded-2xl p-5 sm:p-6 relative overflow-hidden animate-fade-in flex items-center"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <span className="text-2xs font-mono text-[#7C8BA3]">// backend architecture</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#44B78B] status-pulse" aria-hidden="true" />
            </div>
            <div className="w-full">
              <ArchitectureDiagram />
            </div>
          </div>
        </div>
      </Section>

      {/* ── Proof ────────────────────────────────────────────────────────── */}
      {proof.length > 0 && (
        <Section tone="band" space="tight" aria-label="Verified results">
          <div
            ref={proofRef}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#1a2538]"
          >
            {proof.map(({ value, label, slug, name }) => (
              <div key={label} className="pt-8 first:pt-0 sm:pt-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <div
                  className={`font-mono font-bold text-display-sm leading-none mb-3 ${
                    value === LOUD_VALUE ? "text-[#FFD343]" : "text-[#F8FAFC]"
                  }`}
                >
                  {value}
                </div>
                <p className="text-sm text-[#94A3B8] leading-snug mb-3 max-w-[30ch]">{label}</p>
                {name && (
                  <Link
                    to={`/projects/${slug}`}
                    className="inline-flex items-center gap-1 font-mono text-2xs text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors duration-150 active:opacity-70"
                  >
                    {name} <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Selected Work ────────────────────────────────────────────────── */}
      <Section
        space="loose"
        eyebrow="featured_projects = Project.objects.filter(featured=True)"
        title="Selected Work"
        action={
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors duration-150 active:opacity-70"
          >
            All projects
            <Arrow />
          </Link>
        }
      >
        {flagship && <FeaturedProjectCard project={flagship} />}
        <div ref={workRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {otherFeatured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Section>

      {/* ── Core Specializations ─────────────────────────────────────────── */}
      {buckets.length > 0 && (
        <Section space="default" eyebrow="// expertise" title="Core Specializations">
          <div ref={specRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {buckets.map((bucket) => (
              <article
                key={bucket.id}
                className="h-full bg-gradient-to-b from-[#151D2E] to-[#0F1626] border border-[#212B3D] rounded-xl p-5 hover:border-[#3776AB]/40 transition-colors duration-150"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${bucket.accent}`}
                >
                  {bucket.icon}
                </div>
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-3">{bucket.title}</h3>
                <ul className="flex flex-wrap gap-1.5 list-none">
                  {bucket.skills.map((s) => (
                    <li key={s}>
                      <TechBadge label={s} />
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>
      )}

      {/* ── Terminal + About ─────────────────────────────────────────────── */}
      <Section space="default" aria-label="About">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <TerminalCard lines={terminalLines} />
          <div>
            <p className="font-mono text-xs text-[#4B9CD3] mb-3">// about</p>
            <p className="text-lead text-[#94A3B8] mb-6">{aboutIntro}</p>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-sm font-medium text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors duration-150 active:opacity-70"
            >
              More about me
              <Arrow className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Section>

      {/* ── Closing ask ──────────────────────────────────────────────────── */}
      <Section tone="band" space="loose" aria-labelledby="cta-heading">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-[#4B9CD3] mb-3">// next_step</p>
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-4">
            Hiring for a Django backend? Let&apos;s talk about the system.
          </h2>
          <p className="text-lead text-[#94A3B8] mb-8">
            Based in {profile.location} and available for remote work worldwide. I reply within
            24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link
              to="/contact"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150 active:scale-[0.98] active:brightness-95"
            >
              Start a conversation
              <Arrow />
            </Link>
            <DownloadCV variant="hero" />
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-sm text-[#7C8BA3] hover:text-[#4B9CD3] transition-colors duration-150 active:opacity-70"
            >
              {profile.email}
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
