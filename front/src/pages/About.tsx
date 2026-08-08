import { Link } from "react-router";
import { achievements } from "../data/experience";

const SECTIONS = [
  {
    id: "intro",
    title: "Professional Introduction",
    content: `I am a Python Backend Developer with 2.5+ years of professional experience building scalable Django systems, production REST APIs, data-intensive platforms, and AI-powered products. I work primarily in Python and Django, with practical expertise across the full backend stack from database design to containerized deployment.`,
  },
  {
    id: "python",
    title: "Why Python",
    content: `Python's clarity and expressiveness allow me to focus on solving real problems rather than fighting the language. Its ecosystem — Django, DRF, Celery, NumPy, scikit-learn, PyTorch, OpenAI SDK — means I can move between backend systems, desktop applications, and AI integrations with the same language and the same rigorous thinking.`,
  },
  {
    id: "django",
    title: "Why Django Backend Engineering",
    content: `Django gives me the full stack to deliver: ORM, authentication, permissions, admin, migrations, signals, and a mature REST layer through DRF. I've used it to build systems handling billions of records, multi-tenant SaaS products, asynchronous workflows, and real-time APIs. The framework is opinionated enough to move fast and flexible enough to scale.`,
  },
  {
    id: "approach",
    title: "Backend Engineering Approach",
    content: `I start every system design from the data model. Clear schemas, proper indexing, and thoughtful query design are the difference between a backend that performs and one that fails under load. I favor explicit API contracts, layered authentication, granular permissions, and async task offloading for long-running operations — all running inside Docker with CI/CD automation from day one.`,
  },
  {
    id: "desktop",
    title: "Desktop Development",
    content: `I build PyQt5 desktop applications for use cases where web UIs aren't the right fit — local-first workflows, hardware integrations, and enterprise tooling on Linux and Windows. Desktop apps built in Python benefit from the same backend libraries, which means I can integrate REST APIs, run background workers, and handle multithreaded operations cleanly.`,
  },
  {
    id: "devops",
    title: "DevOps & Deployment",
    content: `Shipping code is part of the job. I containerize every project with Docker, automate testing and deployment with GitHub Actions CI/CD, configure Nginx and Apache for production serving, and monitor systems with Prometheus and Grafana. I've deployed to AWS EC2, Elastic Load Balancers, and VPS environments for clients in Jordan, Qatar, Saudi Arabia, and the US.`,
  },
  {
    id: "ai",
    title: "AI & Research",
    content: `I've integrated OpenAI GPT, Google Gemini, and LangChain into production platforms, built deep neural networks for health research in collaboration with Qassim University, and developed a computer vision system for Arabic Sign Language recognition. My Kaggle Notebooks Master ranking (61st globally) reflects consistent research and experimentation with real datasets.`,
  },
  {
    id: "teaching",
    title: "Teaching & Communication",
    content: `As a part-time instructor at Moussa Academy, I design and deliver programming lessons for students learning Python and software engineering. The discipline of explaining complex topics clearly has made me a better developer — I write code other engineers can read and maintain.`,
  },
];

const achievementColors = {
  yellow: { border: "border-[#FFD343]/20", bg: "bg-[#FFD343]/5", text: "text-[#FFD343]" },
  blue: { border: "border-[#3776AB]/30", bg: "bg-[#3776AB]/8", text: "text-[#4B9CD3]" },
  green: { border: "border-[#44B78B]/20", bg: "bg-[#44B78B]/5", text: "text-[#44B78B]" },
};

export default function About() {
  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[#3776AB] mb-2">// about</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
          About Youssif Hassan
        </h1>

        {/* Identity card */}
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-5 font-mono text-sm max-w-md mb-8">
          <div className="text-[#64748B] mb-2 text-xs">// developer.py</div>
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

      {/* Story sections */}
      <div className="space-y-10 mb-16">
        {SECTIONS.map((section) => (
          <section key={section.id} aria-labelledby={`section-${section.id}`}>
            <h2 id={`section-${section.id}`} className="flex items-center gap-2 text-lg font-bold text-[#F8FAFC] mb-3">
              <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
              {section.title}
            </h2>
            <p className="text-[#94A3B8] leading-relaxed ml-3">{section.content}</p>
          </section>
        ))}
      </div>

      {/* Achievements */}
      <section aria-labelledby="achievements-heading" className="mb-14">
        <h2 id="achievements-heading" className="text-xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#FFD343]" aria-hidden="true" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => {
            const c = achievementColors[ach.color as keyof typeof achievementColors] ?? achievementColors.blue;
            return (
              <article
                key={ach.id}
                className={`border rounded-xl p-5 ${c.border} ${c.bg}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-[#F8FAFC] text-sm leading-snug">{ach.title}</h3>
                  <div className={`font-mono font-bold text-lg leading-none ${c.text} flex-shrink-0`}>
                    {ach.highlight}
                  </div>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{ach.description}</p>
                <p className="font-mono text-[10px] text-[#64748B] mt-2">{ach.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Education */}
      <section aria-labelledby="education-heading" className="mb-12">
        <h2 id="education-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Education
        </h2>
        <div className="bg-[#111827] border border-[#243044] rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[#F8FAFC] mb-0.5">Bachelor of Computer Science</h3>
              <p className="text-sm text-[#94A3B8]">Benha University</p>
            </div>
            <span className="font-mono text-xs text-[#64748B] whitespace-nowrap">2020 — 2024</span>
          </div>
        </div>
      </section>

      {/* International section */}
      <section aria-labelledby="international-heading" className="mb-12">
        <h2 id="international-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          International Experience
        </h2>
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-6">
          <p className="text-sm text-[#64748B] font-mono mb-5">// remote delivery for clients and products across</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { country: "Jordan", detail: "ADEX — Current employer", home: false },
              { country: "Qatar", detail: "Prezza — E-commerce platform", home: false },
              { country: "Saudi Arabia", detail: "Emily's Luxury · Moussa Academy", home: false },
              { country: "Egypt", detail: "Home base — Cairo", home: true },
            ].map(({ country, detail, home }) => (
              <div
                key={country}
                className={`rounded-lg border p-3 text-center ${
                  home
                    ? "border-[#3776AB]/30 bg-[#3776AB]/8"
                    : "border-[#243044] bg-[#111827]"
                }`}
              >
                <div className={`font-semibold text-sm mb-1 ${home ? "text-[#4B9CD3]" : "text-[#F8FAFC]"}`}>
                  {country}
                  {home && <span className="ml-1 text-[10px] font-mono text-[#3776AB]">home</span>}
                </div>
                <div className="text-[10px] text-[#64748B] leading-snug">{detail}</div>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-[#64748B] mt-4 text-center">
            * All international work was delivered remotely unless otherwise noted.
          </p>
        </div>
      </section>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          to="/projects"
          className="px-5 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-medium text-sm rounded-lg transition-colors"
        >
          Explore Projects
        </Link>
        <Link
          to="/contact"
          className="px-5 py-2.5 border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] font-medium text-sm rounded-lg transition-all"
        >
          Get in Touch
        </Link>
      </div>
    </main>
  );
}
