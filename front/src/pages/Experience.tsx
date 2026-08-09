import { experiences, skillGroups, achievements } from "../data/experience";

const SKILL_ICON_MAP: Record<string, string> = {
  server: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z",
  database: "M3 7C3 5.343 6.134 4 10 4s7 1.343 7 3v10c0 1.657-3.134 3-7 3s-7-1.343-7-3V7z M3 7c0 1.657 3.134 3 7 3s7-1.343 7-3",
  lightning: "M13 10V3L4 14h7v7l9-11h-7z",
  gear: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  cloud: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  lock: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  brain: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  neural: "M13 7H7v6h6V7z M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z",
  ai: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v10m0 0h10m-10 0H5m10 0v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4m10 0h2a2 2 0 002-2V9m0 0h-2",
  desktop: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  git: "M9 3a6 6 0 000 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm6 2a2 2 0 110 4 2 2 0 010-4z",
};

export default function Experience() {
  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[#4B9CD3] mb-2">// experience</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-3">Experience</h1>
        <p className="text-[#94A3B8]">Professional timeline and technical skills.</p>
      </div>

      {/* Timeline */}
      <section aria-label="Work experience timeline" className="mb-16">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[#243044]" aria-hidden="true" />

          <ol className="space-y-8" role="list">
            {experiences.map((exp) => (
              <li key={exp.id} className="relative pl-14">
                {/* Dot */}
                <div
                  className={`absolute left-3.5 top-1.5 w-3 h-3 rounded-full border-2 -translate-x-1/2 ${
                    exp.special
                      ? "border-[#64748B] bg-[#080D18]"
                      : exp.current
                      ? "border-[#22C55E] bg-[#22C55E]"
                      : "border-[#3776AB] bg-[#080D18]"
                  }`}
                  aria-hidden="true"
                />

                <article className={`bg-[#111827] border rounded-xl p-5 ${exp.special ? "border-[#1a2538]" : "border-[#243044]"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <h2 className={`font-semibold text-base ${exp.special ? "text-[#94A3B8]" : "text-[#F8FAFC]"}`}>
                        {exp.role}
                      </h2>
                      <p className={`text-sm ${exp.special ? "text-[#94A3B8]" : "text-[#4B9CD3]"}`}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1 flex-shrink-0">
                      <span className="font-mono text-xs text-[#7C8BA3]">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate ?? "—"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xs font-mono text-[#7C8BA3] border border-[#1a2538] rounded-sm px-1.5 py-0.5">
                          {exp.type}
                        </span>
                        {exp.current && (
                          <span className="flex items-center gap-1 text-2xs font-mono text-[#22C55E]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] status-pulse" aria-hidden="true" />
                            Current
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-[#7C8BA3] mb-3">{exp.location}</p>

                  {!exp.special && (
                    <>
                      <ul className="space-y-1.5 mb-4" role="list">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                            <span className="text-[#4B9CD3] mt-0.5 flex-shrink-0">›</span>
                            {h}
                          </li>
                        ))}
                      </ul>

                      {exp.technologies && (
                        <div className="flex flex-wrap gap-1.5">
                          {exp.technologies.map((t) => (
                            <span
                              key={t}
                              className="font-mono text-2xs text-[#7C8BA3] border border-[#1a2538] rounded-sm px-1.5 py-0.5"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Skills */}
      <section aria-labelledby="skills-heading" className="mb-16">
        <h2 id="skills-heading" className="text-2xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Technical Skills
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group) => (
            <article
              key={group.category}
              className="bg-[#111827] border border-[#243044] rounded-xl p-4 hover:border-[#3776AB]/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4B9CD3"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={SKILL_ICON_MAP[group.icon] ?? SKILL_ICON_MAP.server} />
                </svg>
                <h3 className="font-mono text-xs text-[#4B9CD3] uppercase tracking-wider">
                  {group.category}
                </h3>
              </div>
              <ul className="space-y-1.5" role="list">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                    <span className="w-1 h-1 rounded-full bg-[#243044] flex-shrink-0" aria-hidden="true" />
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section aria-labelledby="ach-heading" className="mb-12">
        <h2 id="ach-heading" className="text-2xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#FFD343]" aria-hidden="true" />
          Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <article
              key={ach.id}
              className="bg-[#111827] border border-[#243044] rounded-xl p-5 hover:border-[#3776AB]/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-semibold text-[#F8FAFC] text-sm">{ach.title}</h3>
                <span className="font-mono font-bold text-[#4B9CD3] text-lg leading-none flex-shrink-0">
                  {ach.highlight}
                </span>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{ach.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Education */}
      <section aria-labelledby="edu-heading">
        <h2 id="edu-heading" className="text-2xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          Education
        </h2>
        <div className="bg-[#111827] border border-[#243044] rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-[#F8FAFC]">Bachelor of Computer Science</h3>
              <p className="text-sm text-[#4B9CD3] mt-0.5">Benha University</p>
            </div>
            <span className="font-mono text-xs text-[#7C8BA3] whitespace-nowrap">2020 — 2024</span>
          </div>
        </div>
      </section>
    </main>
  );
}
