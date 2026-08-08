import { Link } from "react-router";
import TechBadge from "../components/TechBadge";
import StatusBadge from "../components/StatusBadge";

const FEATURED = {
  name: "JAFCO Analytics Backend",
  slug: "jafco-analytics",
  summary: "A Django analytics backend supporting more than 1,000 branches and processing approximately one billion sales records.",
  categories: ["Backend", "Enterprise System", "Data Platform"],
  role: "Python Backend Developer",
  company: "ADEX Jordan Company",
  date: "April 2026 — Present",
  status: "Active Development",
  technologies: ["Python", "Django", "PostgreSQL", "REST API"],
  confidential: true,
};

const ARCHITECTURE_NODES = [
  { label: "Data Sources", sublabel: "Branch POS systems", color: "dim" },
  { label: "Django Analytics Backend", sublabel: "Core processing layer", color: "blue" },
  { label: "Database Layer", sublabel: "Large-scale storage", color: "green" },
  { label: "Auth & Permissions", sublabel: "Role-based access", color: "dim" },
  { label: "Analytics Processing", sublabel: "Aggregation engine", color: "blue" },
  { label: "Client Dashboards", sublabel: "Reporting interface", color: "dim" },
];

const RESPONSIBILITIES = [
  "Developed Django backend functionality for the analytics platform",
  "Implemented APIs for data access and reporting workflows",
  "Worked with authentication and permissions systems",
  "Implemented tenant isolation for multi-tenant SaaS systems",
  "Contributed to business workflow implementation",
  "Translated complex client requirements into maintainable Django solutions",
  "Coordinated with international clients",
  "Supported rapid iteration and delivery cycles",
];

export default function FeaturedProject() {
  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Label */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FFD343]/25 bg-[#FFD343]/8 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD343]" aria-hidden="true" />
        <span className="text-xs font-mono text-[#FFD343]">Featured Case Study</span>
      </div>

      {/* Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-3">
            {FEATURED.name}
          </h1>
          <p className="text-[#94A3B8] text-base leading-relaxed mb-6">
            {FEATURED.summary}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {FEATURED.categories.map((cat) => (
              <span key={cat} className="text-xs font-mono px-2 py-0.5 rounded border border-[#243044] text-[#94A3B8] bg-[#111827]">
                {cat}
              </span>
            ))}
          </div>

          <StatusBadge status={FEATURED.status} />

          {FEATURED.confidential && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#FFD343]/25 bg-[#FFD343]/8 text-xs font-mono text-[#FFD343]">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              Confidential Enterprise Project
            </div>
          )}
        </div>

        {/* Metadata card */}
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-6 space-y-4">
          {[
            { label: "Role", value: FEATURED.role },
            { label: "Company", value: FEATURED.company },
            { label: "Timeline", value: FEATURED.date },
            { label: "Status", value: FEATURED.status },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="font-mono text-xs text-[#64748B] w-20 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-sm text-[#F8FAFC]">{value}</span>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <span className="font-mono text-xs text-[#64748B] w-20 flex-shrink-0 pt-0.5">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {FEATURED.technologies.map((t) => (
                <TechBadge key={t} label={t} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cover placeholder */}
      <div className="h-56 sm:h-72 bg-[#0B1120] border border-dashed border-[#243044] rounded-xl flex items-center justify-center mb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(0deg, #3776AB 0px, #3776AB 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #3776AB 0px, #3776AB 1px, transparent 1px, transparent 40px)"
        }} />
        <div className="text-center z-10">
          <p className="font-mono text-xs text-[#64748B]">// cover image placeholder</p>
          <p className="text-sm text-[#3776AB] mt-1">Replace with verified project screenshot</p>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-14" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Project Overview
        </h2>
        <div className="bg-[#111827] border border-[#243044] rounded-xl p-6 space-y-3 text-[#94A3B8] leading-relaxed">
          <p>
            JAFCO Analytics Backend is a large-scale enterprise analytics platform built for JAFCO,
            a major retail enterprise. The Django-powered backend supports more than{" "}
            <span className="text-[#FFD343] font-mono">1,000 branches</span> and processes
            approximately{" "}
            <span className="text-[#FFD343] font-mono">one billion sales records</span>.
          </p>
          <p>
            Youssif contributed to backend development and business workflows as part of his role at
            ADEX Jordan Company. The work included building Django backend functionality, implementing
            APIs, and translating client requirements into maintainable, scalable solutions.
          </p>
          <p>
            The project also involved contributions to additional multi-tenant SaaS systems and
            delivery applications within ADEX, covering tenant isolation, authentication, and
            business workflow implementation.
          </p>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="mb-14" aria-labelledby="responsibilities-heading">
        <h2 id="responsibilities-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Responsibilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {RESPONSIBILITIES.map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-[#111827] border border-[#243044] rounded-lg px-4 py-3">
              <span className="text-[#3776AB] font-mono text-xs mt-0.5 flex-shrink-0">{String(i + 1).padStart(2, "0")}.</span>
              <span className="text-sm text-[#94A3B8] leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-14" aria-labelledby="architecture-heading">
        <h2 id="architecture-heading" className="text-xl font-bold text-[#F8FAFC] mb-1 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Architecture
        </h2>
        <p className="text-xs font-mono text-[#64748B] mb-5 ml-4">
          // Illustrative architecture — replace with verified project architecture.
        </p>
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-6">
          <div className="flex flex-col items-center gap-3">
            {ARCHITECTURE_NODES.map((node, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`px-5 py-2.5 rounded-lg border text-center ${
                  node.color === "blue"
                    ? "border-[#3776AB]/50 bg-[#172033] text-[#4B9CD3]"
                    : node.color === "green"
                    ? "border-[#44B78B]/30 bg-[#0C4B33]/20 text-[#44B78B]"
                    : "border-[#243044] bg-[#111827] text-[#94A3B8]"
                }`}>
                  <div className="font-medium text-sm">{node.label}</div>
                  <div className="font-mono text-[10px] opacity-70 mt-0.5">{node.sublabel}</div>
                </div>
                {i < ARCHITECTURE_NODES.length - 1 && (
                  <div className="w-px h-5 bg-[#243044]" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery placeholders */}
      <section className="mb-14" aria-labelledby="gallery-heading">
        <h2 id="gallery-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Gallery
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {["Analytics Dashboard", "Branch-level Reports", "Data Processing Architecture", "API Overview", "Database Architecture"].map((cap) => (
            <div
              key={cap}
              className="aspect-video bg-[#0B1120] border border-dashed border-[#243044] rounded-lg flex flex-col items-center justify-center p-3"
            >
              <p className="font-mono text-[10px] text-[#64748B] text-center">{cap}</p>
              <p className="text-[10px] text-[#3776AB] mt-1">Replace with screenshot</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="flex items-center gap-4">
        <Link
          to={`/projects/${FEATURED.slug}`}
          className="px-5 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-medium text-sm rounded-lg transition-colors"
        >
          Full Project Details
        </Link>
        <Link
          to="/projects"
          className="text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors"
        >
          ← All Projects
        </Link>
      </div>
    </main>
  );
}
