import { Link } from "react-router";
import type { Project } from "../data/projects";
import TechBadge from "./TechBadge";
import StatusBadge from "./StatusBadge";
import ProjectSignature from "./ProjectSignature";

/**
 * Full-width treatment for the flagship project, driven by `biggestProject`.
 *
 * In a 4-up grid the most important project was indistinguishable from the
 * other three. Dominance here comes from area and elevation — things a
 * screenshot can carry — rather than a 1px ring at 30% opacity.
 */
export default function FeaturedProjectCard({ project }: { project: Project }) {
  const metric = project.metrics[0];

  return (
    <article
      className="project-card group relative bg-[#172033] border border-[#3776AB]/30 rounded-xl overflow-hidden"
      aria-label={`Flagship project: ${project.name}`}
    >
      <span className="absolute left-0 inset-y-0 w-1 bg-[#3776AB] z-10" aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Signature */}
        <div className="relative h-44 sm:h-56 lg:h-auto lg:min-h-[280px] border-b lg:border-b-0 lg:border-r border-[#243044]">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={`${project.name} cover`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            // "card" rather than "detail": this panel is nearly square, and the
            // wide detail viewBox would letterbox down to ~0.6 scale here.
            <ProjectSignature project={project} size="card" decorative={false} />
          )}
        </div>

        {/* Detail */}
        <div className="p-6 sm:p-7 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-mono text-2xs uppercase tracking-wider text-[#4B9CD3] border border-[#3776AB]/40 bg-[#3776AB]/10 px-2 py-0.5 rounded-sm">
              Flagship project
            </span>
            <StatusBadge status={project.status} />
            {project.confidential && (
              <span className="text-2xs font-mono border border-[#FFD343]/30 text-[#FFD343] px-1.5 py-0.5 rounded-sm">
                Confidential
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-[#94A3B8] leading-relaxed mb-5">{project.shortDescription}</p>

          {metric && (
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b border-[#243044]">
              <span className="font-mono text-3xl font-bold text-[#FFD343] leading-none">
                {metric.value}
              </span>
              <span className="text-sm text-[#94A3B8]">{metric.label}</span>
            </div>
          )}

          <ul className="flex flex-wrap gap-1.5 mb-6 list-none" aria-label="Technologies">
            {project.technologies.slice(0, 5).map((t) => (
              <li key={t}>
                <TechBadge label={t} />
              </li>
            ))}
          </ul>

          <div className="mt-auto flex flex-wrap items-center gap-4">
            <Link
              to={`/projects/${project.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#3776AB] hover:bg-[#4B9CD3] text-white font-semibold text-sm rounded-lg transition-colors duration-150 active:scale-[0.98] active:brightness-95"
            >
              Read the case study
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
                className="transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
              </svg>
            </Link>
            {project.company && (
              <span className="font-mono text-2xs text-[#7C8BA3]">{project.company}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
