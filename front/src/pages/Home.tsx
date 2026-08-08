import { Link } from "react-router";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import TerminalCard from "../components/TerminalCard";
import TechBadge from "../components/TechBadge";
import ProjectCard from "../components/ProjectCard";
import { getFeaturedProjects } from "../data/projects";

const HERO_TECHS = [
  "Python", "Django", "Django REST Framework",
  "PostgreSQL", "Redis", "Celery", "Docker", "PyQt5",
];

const METRICS = [
  { value: "2.5+", label: "Years Experience", suffix: "" },
  { value: "1,000+", label: "Branches Supported", suffix: "" },
  { value: "~1B", label: "Sales Records Handled", suffix: "" },
  { value: "5K+", label: "Daily API Requests", suffix: "" },
  { value: "40%", label: "Faster Response Times", suffix: "" },
  { value: "80%", label: "Shorter Deployment Cycles", suffix: "" },
  { value: "99.9%", label: "Production Uptime", suffix: "" },
];

const EXPERTISE = [
  {
    id: "backend",
    title: "Backend Engineering",
    dominant: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
      </svg>
    ),
    color: "blue" as const,
    skills: ["Python", "Django", "Django REST Framework", "REST APIs", "Authentication", "Role-based Permissions", "PostgreSQL", "MySQL", "MS SQL Server", "Redis", "Celery", "WebSockets", "Elasticsearch"],
  },
  {
    id: "desktop",
    title: "Desktop Applications",
    dominant: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113 17H7a1 1 0 01-.704-1.69l.804-.321L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
      </svg>
    ),
    color: "dim" as const,
    skills: ["PyQt5", "Desktop Dashboards", "REST API Integration", "Background Workers", "Multithreading", "Linux Applications", "Windows Applications", "Local System Integrations"],
  },
  {
    id: "devops",
    title: "DevOps & Infrastructure",
    dominant: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
    color: "dim" as const,
    skills: ["Docker", "Docker Compose", "GitHub Actions", "CI/CD", "AWS EC2", "VPS Deployment", "Nginx", "Apache", "Load Balancing", "Prometheus", "Grafana"],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    dominant: false,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M13 7H7v6h6V7z" />
        <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
      </svg>
    ),
    color: "ai" as const,
    skills: ["OpenAI GPT", "Google Gemini", "LangChain", "Regression", "Classification", "Time-series Forecasting", "CNNs", "Image Classification", "Transfer Learning", "Action Detection", "Deep Neural Networks"],
  },
];

const cardColorStyles = {
  blue: "border-[#3776AB]/30 bg-[#172033]",
  dim: "border-[#243044] bg-[#111827]",
  ai: "border-purple-800/30 bg-[#111827]",
};

const iconColorStyles = {
  blue: "text-[#4B9CD3] bg-[#3776AB]/15",
  dim: "text-[#94A3B8] bg-[#172033]",
  ai: "text-purple-400 bg-purple-900/20",
};

const featuredProjects = getFeaturedProjects().slice(0, 4);

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section
        className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        aria-label="Hero"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="animate-fade-up">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/8 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-[#22C55E]">
                Available for Python and Django opportunities
              </span>
            </div>

            {/* Name + Role */}
            <h1 className="mb-1">
              <span className="block text-4xl sm:text-5xl font-bold text-[#F8FAFC] tracking-tight leading-none">
                Youssif Hassan
              </span>
              <span className="block font-mono text-[#4B9CD3] text-lg mt-2 mb-4">
                Python Backend Developer
              </span>
            </h1>

            {/* Headline */}
            <p className="text-2xl sm:text-3xl font-semibold text-[#F8FAFC] leading-snug mb-4">
              Building scalable Django systems and powerful Python applications.
            </p>

            {/* Supporting text */}
            <p className="text-[#94A3B8] leading-relaxed text-base mb-8 max-w-lg">
              Python Backend Developer with 2.5+ years of experience building scalable APIs,
              data-intensive platforms, containerized deployments, PyQt5 desktop applications,
              and AI-powered solutions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                to="/projects"
                className="px-5 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150"
              >
                Explore My Projects
              </Link>
              <a
                href="#download-cv"
                id="download-cv"
                className="px-5 py-2.5 bg-[#172033] hover:bg-[#111827] border border-[#243044] hover:border-[#3776AB] text-[#F8FAFC] font-semibold text-sm rounded-lg transition-all duration-150"
              >
                Download CV
              </a>
              <Link
                to="/contact"
                className="px-5 py-2.5 border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] font-semibold text-sm rounded-lg transition-all duration-150"
              >
                Contact Me
              </Link>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2" role="list" aria-label="Core technologies">
              {HERO_TECHS.map((tech) => (
                <TechBadge key={tech} label={tech} size="md" />
              ))}
            </div>
          </div>

          {/* Right: Architecture */}
          <div
            className="bg-[#0B1120] border border-[#243044] rounded-2xl p-6 relative overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Decorative corner */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-[#64748B]">
                // backend architecture
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
            </div>
            <ArchitectureDiagram />
          </div>
        </div>
      </section>

      {/* Terminal */}
      <section
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20"
        aria-label="Developer profile"
      >
        <div className="max-w-xl">
          <TerminalCard />
        </div>
      </section>

      {/* Metrics Strip */}
      <section
        className="border-y border-[#243044] bg-[#0B1120] py-10 mb-20"
        aria-label="Professional metrics"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-4">
            {METRICS.map((metric) => (
              <div key={metric.label} className="flex flex-col items-center text-center">
                <span className="text-2xl font-bold text-[#FFD343] font-mono leading-none mb-1">
                  {metric.value}
                </span>
                <span className="text-xs text-[#64748B] leading-tight max-w-[80px]">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] font-mono text-[#64748B] mt-6 opacity-70">
            * Metrics are verified from specific projects and linked to their respective contexts.
          </p>
        </div>
      </section>

      {/* About Preview */}
      <section
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20"
        aria-label="About preview"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-xs text-[#3776AB] mb-3">// about</p>
            <p className="text-[#94A3B8] leading-relaxed text-base mb-6">
              I am a Python Backend Developer specializing in Django and Django REST Framework.
              I build scalable APIs, authentication and permission systems, asynchronous workflows,
              database-driven products, and production deployment infrastructure. I also develop
              PyQt5 desktop applications and have practical experience integrating AI and machine
              learning into real software products.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm text-[#4B9CD3] hover:text-[#F8FAFC] font-medium transition-colors group"
            >
              More About Me
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
              </svg>
            </Link>
          </div>

          {/* Code identity card */}
          <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-5 font-mono text-sm">
            <div className="text-[#64748B] mb-2 text-xs">// identity.py</div>
            <div className="text-[#94A3B8]">developer <span className="text-[#FFD343]">=</span> {"{"}</div>
            {[
              ["name", '"Youssif Hassan"'],
              ["primary_role", '"Python Backend Developer"'],
              ["main_framework", '"Django"'],
              ["desktop", '"PyQt5"'],
              ["experience", '"2.5+ years"'],
              ["location", '"Cairo, Egypt"'],
            ].map(([k, v]) => (
              <div key={k} className="pl-4">
                <span className="text-[#4B9CD3]">"{k}"</span>
                <span className="text-[#64748B]">: </span>
                <span className="text-[#22C55E]">{v}</span>
                <span className="text-[#64748B]">,</span>
              </div>
            ))}
            <div className="text-[#94A3B8]">{"}"}</div>
          </div>
        </div>
      </section>

      {/* Main Expertise */}
      <section
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24"
        aria-label="Main expertise"
      >
        <div className="mb-10">
          <p className="font-mono text-xs text-[#3776AB] mb-2">// expertise</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Core Specializations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EXPERTISE.map((exp) => (
            <article
              key={exp.id}
              className={`border rounded-xl p-5 ${cardColorStyles[exp.color]} ${exp.dominant ? "ring-1 ring-[#3776AB]/30" : ""} transition-all hover:border-[#3776AB]/40`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${iconColorStyles[exp.color]}`}>
                {exp.icon}
              </div>
              <h3 className="font-semibold text-[#F8FAFC] mb-3 text-sm">{exp.title}</h3>
              <div className="flex flex-wrap gap-1.5">
                {exp.skills.map((skill) => (
                  <TechBadge key={skill} label={skill} />
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24"
        aria-label="Featured projects"
      >
        <div className="mb-10">
          <p className="font-mono text-xs text-[#44B78B] mb-2">
            featured_projects = Project.objects.filter(featured=True)
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC]">Featured Projects</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#172033] hover:bg-[#111827] border border-[#243044] hover:border-[#3776AB] text-[#F8FAFC] font-medium text-sm rounded-lg transition-all"
          >
            Explore All Projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
