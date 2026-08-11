import { Link } from "react-router";
import { PageLoading, PageError } from "../components/ApiState";
import { useApi } from "../hooks/useApi";
import { getSummary } from "../lib/api";

const achievementColors = {
  yellow: { border: "border-[#44B78B]/20", bg: "bg-[#44B78B]/5", text: "text-[#44B78B]" },
  blue: { border: "border-[#3776AB]/30", bg: "bg-[#3776AB]/8", text: "text-[#4B9CD3]" },
  green: { border: "border-[#44B78B]/20", bg: "bg-[#44B78B]/5", text: "text-[#44B78B]" },
};

export default function About() {
  const { data: summary, loading, error, retry } = useApi(getSummary);

  if (loading) return <PageLoading label="about" />;
  if (error || !summary?.profile) {
    return <PageError message={error ?? "No profile data was returned."} onRetry={retry} />;
  }

  const { profile, achievements } = summary;
  const yearsExperience = profile.metrics.find((m) => m.label === "Years Experience")?.value;
  const mainFramework = profile.techStack.find((t) => t === "Django") ?? profile.techStack[1];
  const desktopStack = profile.techStack.find((t) => t === "PyQt5");

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[#4B9CD3] mb-2">// about</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-4">
          About {profile.name}
        </h1>

        {/* Identity card */}
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-5 font-mono text-sm max-w-md mb-8">
          <div className="text-[#7C8BA3] mb-2 text-xs">// developer.py</div>
          <div className="text-[#94A3B8]">developer <span className="text-[#FFD343]">=</span> {"{"}</div>
          {[
            ["name", profile.name],
            ["primary_role", profile.primaryRole],
            ["main_framework", mainFramework],
            ["desktop", desktopStack],
            ["experience", yearsExperience ? `${yearsExperience} years` : undefined],
            ["location", profile.location],
          ]
            .filter((pair): pair is [string, string] => Boolean(pair[1]))
            .map(([k, v]) => (
              <div key={k} className="pl-4">
                <span className="text-[#4B9CD3]">"{k}"</span>
                <span className="text-[#7C8BA3]">: </span>
                <span className="text-[#22C55E]">"{v}"</span>
                <span className="text-[#7C8BA3]">,</span>
              </div>
            ))}
          <div className="text-[#94A3B8]">{"}"}</div>
        </div>
      </div>

      {/* Story sections */}
      <div className="space-y-10 mb-16">
        {profile.aboutSections.map((section) => (
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
      {achievements.length > 0 && (
        <section aria-labelledby="achievements-heading" className="mb-14">
          <h2 id="achievements-heading" className="text-xl font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-[#FFD343]" aria-hidden="true" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => {
              const c = achievementColors[ach.color as keyof typeof achievementColors] ?? achievementColors.blue;
              return (
                <article key={ach.id} className={`border rounded-xl p-5 ${c.border} ${c.bg}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-[#F8FAFC] text-sm leading-snug">{ach.title}</h3>
                    <div className={`font-mono font-bold text-lg leading-none ${c.text} flex-shrink-0`}>
                      {ach.highlight}
                    </div>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">{ach.description}</p>
                  <p className="font-mono text-2xs text-[#7C8BA3] mt-2">{ach.detail}</p>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Education — not modeled on the backend; this one fact stays static. */}
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
            <span className="font-mono text-xs text-[#7C8BA3] whitespace-nowrap">2020 — 2024</span>
          </div>
        </div>
      </section>

      {/* International section — likewise static curated detail. */}
      <section aria-labelledby="international-heading" className="mb-12">
        <h2 id="international-heading" className="text-xl font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#3776AB]" aria-hidden="true" />
          International Experience
        </h2>
        <div className="bg-[#0B1120] border border-[#243044] rounded-xl p-6">
          <p className="text-sm text-[#7C8BA3] font-mono mb-5">// remote delivery for clients and products across</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { country: "Jordan", detail: "ADEX — Current employer", home: false },
              { country: "Qatar", detail: "Prezza — E-commerce platform", home: false },
              { country: "Saudi Arabia", detail: "Emily's Luxury · Moussa Academy", home: false },
              { country: "USA", detail: "Agave World", home: false },
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
                  {home && <span className="ml-1 text-2xs font-mono text-[#4B9CD3]">home</span>}
                </div>
                <div className="text-2xs text-[#7C8BA3] leading-snug">{detail}</div>
              </div>
            ))}
          </div>
          <p className="text-xs font-mono text-[#7C8BA3] mt-4 text-center">
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
