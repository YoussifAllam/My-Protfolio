import { Link } from "react-router";
import type { Project } from "../data/projects";
import TechBadge from "./TechBadge";
import StatusBadge from "./StatusBadge";

interface ProjectCardProps {
  project: Project;
}

function PlaceholderCover({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1120] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "repeating-linear-gradient(0deg, #243044 0px, #243044 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #243044 0px, #243044 1px, transparent 1px, transparent 32px)"
      }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-[#4B9CD3] text-center px-4 line-clamp-2">{name}</span>
      </div>
    </div>
  );
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className="project-card bg-[#111827] border border-[#243044] rounded-xl overflow-hidden flex flex-col h-full"
      aria-label={`Project: ${project.name}`}
    >
      {/* Cover */}
      <div className="h-44 relative overflow-hidden bg-[#0B1120] flex-shrink-0">
        {project.coverImage ? (
          <img
            src={project.coverImage}
            alt={`${project.name} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <PlaceholderCover name={project.name} />
        )}

        {/* Confidential overlay */}
        {project.confidential && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-mono bg-[#080D18]/80 border border-[#FFD343]/30 text-[#FFD343] px-1.5 py-0.5 rounded">
              Confidential
            </span>
          </div>
        )}

        {/* Category pills overlay */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {project.categories.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-[10px] font-mono bg-[#080D18]/80 text-[#64748B] border border-[#243044]/60 px-1.5 py-0.5 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[#F8FAFC] text-base leading-snug">{project.name}</h3>
          {project.year && (
            <span className="text-[11px] font-mono text-[#64748B] whitespace-nowrap mt-0.5">
              {project.year}
            </span>
          )}
        </div>

        <div className="mb-3">
          <StatusBadge status={project.status} />
        </div>

        {/* Description */}
        <p className="text-sm text-[#94A3B8] line-clamp-3 leading-relaxed mb-4 flex-1">
          {project.shortDescription}
        </p>

        {/* Role */}
        <p className="text-xs font-mono text-[#64748B] mb-3">
          <span className="text-[#3776AB]">role:</span> {project.role}
        </p>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
          {project.technologies.length > 4 && (
            <span className="text-[11px] font-mono text-[#64748B]">
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
                  className="p-1.5 text-[#64748B] hover:text-[#4B9CD3] transition-colors"
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
