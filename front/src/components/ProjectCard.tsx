import { Link } from "react-router";
import type { Project } from "../types/portfolio";
import TechBadge from "./TechBadge";
import StatusBadge from "./StatusBadge";
import ProjectSignature from "./ProjectSignature";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="project-card group bg-[#111827] border border-[#243044] rounded-xl overflow-hidden flex flex-col h-full"
      aria-label={`Project: ${project.name}`}
    >
      {/* Cover. Real screenshot when one exists, generated architecture
          signature otherwise — the flagship project is confidential and will
          never have one. */}
      <div className="h-40 relative overflow-hidden bg-[#0B1120] border-b border-[#1a2538] flex-shrink-0">
        {/* coverThumbnail is the pre-compressed ~640×360 WebP card size —
            using it instead of the full coverImage keeps the grid light. */}
        {project.coverThumbnail ?? project.coverImage ? (
          <img
            src={project.coverThumbnail ?? project.coverImage ?? undefined}
            alt={`${project.name} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ProjectSignature project={project} size="card" />
        )}

        {/* Confidential overlay */}
        {project.confidential && (
          <div className="absolute top-2 right-2">
            <span className="text-2xs font-mono bg-[#080D18]/80 border border-[#FFD343]/30 text-[#FFD343] px-1.5 py-0.5 rounded-sm">
              Confidential
            </span>
          </div>
        )}

      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#F8FAFC] text-base leading-snug">{project.name}</h3>
          {project.year && (
            <span className="text-2xs font-mono text-[#7C8BA3] whitespace-nowrap mt-0.5">
              {project.year}
            </span>
          )}
        </div>

        {/* Status + categories. Categories used to overlay the cover, where they
            collided with the signature's leaf row and were hard to read. */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <StatusBadge status={project.status} />
          {project.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-2xs font-mono text-[#7C8BA3] border border-[#243044] px-1.5 py-0.5 rounded-sm"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-[#94A3B8] line-clamp-3 leading-relaxed mb-4 flex-1">
          {project.shortDescription}
        </p>

        {/* Role */}
        <p className="text-xs font-mono text-[#7C8BA3] mb-3">
          <span className="text-[#4B9CD3]">role:</span> {project.role}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="text-2xs font-mono text-[#7C8BA3]">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1a2538]">
          <Link
            to={`/projects/${project.slug}`}
            className="group/btn flex items-center gap-1.5 text-sm text-[#4B9CD3] hover:text-[#F8FAFC] font-medium transition-colors"
            aria-label={`View details for ${project.name}`}
          >
            View Details
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
              className="transition-transform duration-150 group-hover/btn:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
            </svg>
          </Link>

          {/* External links */}
          <div className="flex items-center gap-1.5">
            {project.links
              .filter((l) => l.url && !project.confidential)
              .slice(0, 2)
              .map((link) => (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-[#7C8BA3] hover:text-[#4B9CD3] transition-colors"
                  aria-label={link.label}
                  title={link.label}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                    <path d="M3.5 3a.5.5 0 000 1H7.29L3.15 8.15a.5.5 0 10.7.7L8 4.71V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z"/>
                  </svg>
                </a>
              ))}
          </div>
        </div>
      </div>
    </article>
  );
}
