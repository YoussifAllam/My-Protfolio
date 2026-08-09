import { Link } from "react-router";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import TerminalCard from "../components/TerminalCard";
import TechBadge from "../components/TechBadge";
import ProjectCard from "../components/ProjectCard";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import DownloadCV from "../components/DownloadCV";
import Section from "../components/Section";
import { useReveal } from "../hooks/useReveal";
import { getFeaturedProjects, getBiggestProject, getProjectBySlug } from "../data/projects";
import { CONTACT_EMAIL } from "../data/social";

/** Five, not eight — the rest appear under Core Specializations. */
const HERO_TECHS = ["Python", "Django", "Django REST Framework", "PostgreSQL", "Docker"];

/**
 * Three attributed numbers, down from seven unattributed ones.
 *
 * Cut deliberately: "2.5+ years" (already in the hero copy), "1,000+ branches"
 * (same fact about the same project as ~1B — folded into its label), "5K+ daily
 * API requests" (0.06 req/s; beside "1B records" it invites arithmetic that
 * costs credibility — it stays on the Mutqinai page where the context fits),
 * and "80% shorter deploys" (a second BAGGR delivery metric in one strip).
 *
 * `loud` marks the single amber element on the page.
 */
const PROOF = [
  {
    value: "~1B",
    label: "sales records served across 1,000+ retail branches",
    slug: "jafco-analytics",
    loud: true,
  },
  {
    value: "40%",
    label: "faster API responses after query and index work",
    slug: "baggr-logistics",
    loud: false,
  },
  {
    value: "99.9%",
    label: "production uptime, monitored with Prometheus and Grafana",
    slug: "baggr-logistics",
    loud: false,
  },
] as const;

const BACKEND_SKILLS = [
  "Python", "Django", "Django REST Framework", "REST APIs", "Authentication",
  "Role-based Permissions", "PostgreSQL", "MySQL", "MS SQL Server", "Redis",
  "Celery", "WebSockets", "Elasticsearch",
];

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

/** Badge budget: five each, remainder as a count. Home held 43 of these. */
const SUPPORTING = [
  {
    id: "desktop",
    title: "Desktop Applications",
    icon: ICON_DESKTOP,
    skills: ["PyQt5", "Desktop Dashboards", "REST API Integration", "Background Workers", "Multithreading", "Linux Applications", "Windows Applications", "Local System Integrations"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    icon: ICON_DEVOPS,
    skills: ["Docker", "Docker Compose", "GitHub Actions", "CI/CD", "AWS EC2", "VPS Deployment", "Nginx", "Apache", "Load Balancing", "Prometheus", "Grafana"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    icon: ICON_AI,
    skills: ["OpenAI GPT", "Google Gemini", "LangChain", "Regression", "Classification", "Time-series Forecasting", "CNNs", "Image Classification", "Transfer Learning", "Action Detection", "Deep Neural Networks"],
  },
];

const ICON_BACKEND = (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className={className} aria-hidden="true">
    <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
  </svg>
);

const flagship = getBiggestProject();
const otherFeatured = getFeaturedProjects()
  .filter((p) => p.slug !== flagship?.slug)
  .slice(0, 3);

export default function Home() {
  // The hero keeps its existing animate-fade-up/fade-in and is never revealed
  // — it's above the fold. Everything below gets a group reveal on scroll.
  const proofRef = useReveal<HTMLDivElement>({ group: true });
  const workRef = useReveal<HTMLDivElement>({ group: true });
  const specRef = useReveal<HTMLDivElement>({ group: true });

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Section first space="loose" aria-label="Introduction">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-14">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#44B78B]/25 bg-[#44B78B]/10 mb-7">
              <span className="w-2 h-2 rounded-full bg-[#44B78B] status-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-[#44B78B]">
                Available for Python and Django opportunities
              </span>
            </div>

            {/* One h1. The name is what a recruiter confirms; the proposition
                is what they are scanning for, so it carries the display size. */}
            <h1 className="mb-6">
              <span className="block font-mono text-sm text-[#94A3B8] mb-4">
                Youssif Hassan
                <span className="text-[#7C8BA3] px-1.5">/</span>
                <span className="text-[#4B9CD3]">Python Backend Developer</span>
              </span>
              <span className="block text-display text-[#F8FAFC]">
                Building scalable Django systems and powerful Python applications.
              </span>
            </h1>

            <p className="text-lead text-[#94A3B8] max-w-[46ch] mb-8">
              2.5+ years building scalable APIs, data-intensive platforms, containerized
              deployments, PyQt5 desktop applications, and AI-powered solutions.
            </p>

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
              {HERO_TECHS.map((tech) => (
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
      <Section tone="band" space="tight" aria-label="Verified results">
        <div
          ref={proofRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#1a2538]"
        >
          {PROOF.map(({ value, label, slug, loud }) => {
            const project = getProjectBySlug(slug);
            return (
              <div key={label} className="pt-8 first:pt-0 sm:pt-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
                <div
                  className={`font-mono font-bold text-display-sm leading-none mb-3 ${
                    loud ? "text-[#FFD343]" : "text-[#F8FAFC]"
                  }`}
                >
                  {value}
                </div>
                <p className="text-sm text-[#94A3B8] leading-snug mb-3 max-w-[30ch]">{label}</p>
                {project && (
                  <Link
                    to={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1 font-mono text-2xs text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors duration-150 active:opacity-70"
                  >
                    {project.name} <span aria-hidden="true">↗</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </Section>

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
      <Section space="default" eyebrow="// expertise" title="Core Specializations">
        {/* Dominance via area, elevation and a rail — a 1px ring at 30% opacity
            inside a 4-up grid was invisible in a screenshot. */}
        <article className="relative bg-[#172033] border border-[#3776AB]/30 rounded-xl p-6 sm:p-7 overflow-hidden mb-4">
          <span className="absolute left-0 inset-y-0 w-1 bg-[#3776AB]" aria-hidden="true" />
          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 items-start">
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#3776AB]/15 text-[#4B9CD3] flex items-center justify-center mb-4">
                {ICON_BACKEND}
              </div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">Backend Engineering</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Django, DRF and PostgreSQL at production scale — the work that fills most of
                my week.
              </p>
            </div>
            <ul className="flex flex-wrap gap-1.5 content-start list-none">
              {BACKEND_SKILLS.slice(0, 8).map((s) => (
                <li key={s}>
                  <TechBadge label={s} size="md" />
                </li>
              ))}
              <li className="self-center font-mono text-xs text-[#7C8BA3] px-1">
                +{BACKEND_SKILLS.length - 8} more
              </li>
            </ul>
          </div>
        </article>

        <div ref={specRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SUPPORTING.map((exp) => (
            <article
              key={exp.id}
              className="bg-[#111827] border border-[#243044] rounded-xl p-5 hover:border-[#3776AB]/40 transition-colors duration-150"
            >
              <div className="w-9 h-9 rounded-lg bg-[#172033] text-[#94A3B8] flex items-center justify-center mb-4">
                {exp.icon}
              </div>
              <h3 className="text-lead font-semibold text-[#F8FAFC] mb-3">{exp.title}</h3>
              <ul className="flex flex-wrap gap-1.5 list-none">
                {exp.skills.slice(0, 5).map((s) => (
                  <li key={s}>
                    <TechBadge label={s} />
                  </li>
                ))}
                {exp.skills.length > 5 && (
                  <li className="self-center font-mono text-2xs text-[#7C8BA3]">
                    +{exp.skills.length - 5}
                  </li>
                )}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ── Terminal + About ─────────────────────────────────────────────── */}
      <Section space="default" aria-label="About">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <TerminalCard />
          <div>
            <p className="font-mono text-xs text-[#4B9CD3] mb-3">// about</p>
            <p className="text-lead text-[#94A3B8] mb-6">
              I am a Python Backend Developer specializing in Django and Django REST Framework.
              I build scalable APIs, authentication and permission systems, asynchronous
              workflows, database-driven products, and production deployment infrastructure. I
              also develop PyQt5 desktop applications and have practical experience integrating
              AI and machine learning into real software products.
            </p>
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
            Based in Cairo and available for remote work worldwide. I reply within 24–48 hours.
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
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-sm text-[#7C8BA3] hover:text-[#4B9CD3] transition-colors duration-150 active:opacity-70"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
