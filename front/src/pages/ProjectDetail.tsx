import { useParams, Link, Navigate } from "react-router";
import TechBadge from "../components/TechBadge";
import StatusBadge from "../components/StatusBadge";
import ProjectSignature from "../components/ProjectSignature";
import { PageLoading, PageError } from "../components/ApiState";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDialog } from "../hooks/useDialog";
import { useApi } from "../hooks/useApi";
import { getProjects } from "../lib/api";
import type { Project } from "../types/portfolio";

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M3.5 3a.5.5 0 000 1H7.29L3.15 8.15a.5.5 0 10.7.7L8 4.71V8.5a.5.5 0 001 0v-5a.5.5 0 00-.5-.5h-5z"/>
    </svg>
  );
}

/** "April 2026 — Present" style range, or null when no dates are recorded. */
function timeline(project: Project): string | null {
  if (!project.startDate) return null;
  return project.endDate ? `${project.startDate} — ${project.endDate}` : project.startDate;
}

interface GalleryItem {
  thumb: string;
  full: string;
  caption: string;
}

/** Real uploaded gallery images first, then any legacy caption entry that
 * happens to carry a real `src` (forward-compat; none exist in current data). */
function buildGallery(project: Project): GalleryItem[] {
  const fromUploads: GalleryItem[] = project.galleryImages.map((g) => ({
    thumb: g.thumbnail ?? g.image,
    full: g.image,
    caption: g.caption,
  }));
  const fromLegacy: GalleryItem[] = project.images
    .filter((img): img is typeof img & { src: string } => Boolean(img.src))
    .map((img) => ({ thumb: img.src, full: img.src, caption: img.caption }));
  return [...fromUploads, ...fromLegacy];
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: projects, loading, error, retry } = useApi(getProjects);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const project = useMemo(
    () => projects?.find((p) => p.slug === slug) ?? null,
    [projects, slug],
  );
  const gallery = useMemo(() => (project ? buildGallery(project) : []), [project]);

  // The gallery array above isn't available until data has loaded, but hooks
  // can't be conditional — the arrow-key handler reads the current length
  // from this ref instead of closing over `gallery.length` directly.
  const galleryLenRef = useRef(0);
  galleryLenRef.current = gallery.length;

  const handleLightboxKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") setLightboxIdx((i) => (i && i > 0 ? i - 1 : i));
    if (e.key === "ArrowRight") {
      setLightboxIdx((i) => (i !== null && i < galleryLenRef.current - 1 ? i + 1 : i));
    }
  }, []);
  const lightboxRef = useDialog<HTMLDivElement>(
    lightboxIdx !== null,
    () => setLightboxIdx(null),
    handleLightboxKey,
  );

  useEffect(() => {
    if (project) document.title = `${project.name} — Youssif Hassan`;
  }, [project]);

  if (loading) return <PageLoading label="project" />;
  if (error) return <PageError message={error} onRetry={retry} />;
  if (!project) return <Navigate to="/projects" replace />;

  const currentIdx = projects!.findIndex((p) => p.slug === slug);
  const prevProject = currentIdx > 0 ? projects![currentIdx - 1] : null;
  const nextProject = currentIdx < projects!.length - 1 ? projects![currentIdx + 1] : null;

  const related = projects!
    .filter((p) => p.slug !== project.slug && p.categories.some((c) => project.categories.includes(c)))
    .slice(0, 3);

  const visibleLinks = project.links.filter(
    (l) => l.url && (!project.confidential || l.type === "landing-page"),
  );

  return (
    <main className="pt-24 pb-20">
      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-8">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-[#7C8BA3] hover:text-[#4B9CD3] transition-colors mb-6">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M6.707 12.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L3.414 7H12a1 1 0 110 2H3.414l3.293 3.293a1 1 0 010 1.414z" />
          </svg>
          All Projects
        </Link>

        {/* Cover. No fixed height on the image case: forcing a box shape
            means either cropping a portrait screenshot (object-cover) or
            leaving empty bars around it (object-contain in a fixed box).
            Sizing the box to the image's own intrinsic ratio (h-auto) fills
            both dimensions with zero cropping and zero empty space — every
            cover just gets the hero width and whatever height that implies.
            The generated-signature fallback has no intrinsic size of its
            own, so it keeps the old fixed height. */}
        <div className="w-full bg-[#0B1120] border border-[#243044] rounded-2xl overflow-hidden mb-8 relative">
          {project.coverImage ? (
            <img
              src={project.coverImage}
              alt={`${project.name} cover`}
              className="w-full h-auto max-h-[75vh] object-contain mx-auto"
            />
          ) : (
            <div className="h-48 sm:h-64">
              <ProjectSignature project={project} size="detail" decorative={false} />
            </div>
          )}
          {project.confidential && (
            <div className="absolute top-3 left-3">
              <span className="text-2xs font-mono bg-[#080D18]/80 border border-[#FFD343]/30 text-[#FFD343] px-2 py-1 rounded-sm flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Confidential Enterprise Project
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.categories.map((cat) => (
                <span key={cat} className="text-xs font-mono px-2 py-0.5 rounded-sm border border-[#243044] text-[#7C8BA3] bg-[#111827]">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mb-2">{project.name}</h1>
            <p className="text-[#94A3B8] text-base mb-4">{project.subtitle}</p>
            <StatusBadge status={project.status} />

            <div className="mt-6 text-[#94A3B8] leading-relaxed whitespace-pre-line">
              {project.fullDescription}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 self-start bg-[#0B1120] border border-[#243044] rounded-xl p-5" aria-label="Project details">
            <dl className="space-y-4">
            {[
              { label: "Role", value: project.role },
              { label: "Timeline", value: timeline(project) },
              { label: "Type", value: project.projectType },
              { label: "Status", value: project.status },
              { label: "Company", value: project.company },
            ]
              .filter((f): f is { label: string; value: string } => Boolean(f.value))
              .map(({ label, value }) => (
                <div key={label}>
                  <dt className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-1">{label}</dt>
                  <dd className="text-sm text-[#F8FAFC]">{value}</dd>
                </div>
              ))}

            <div>
              <dt className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-2">Technologies</dt>
              <dd className="flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <TechBadge key={t} label={t} />
                ))}
              </dd>
            </div>

            {visibleLinks.length > 0 && (
              <div>
                <dt className="font-mono text-2xs text-[#7C8BA3] uppercase tracking-wider mb-2">Links</dt>
                <dd className="flex flex-col gap-2">
                  {visibleLinks.map((link) => (
                    <a
                      key={link.type}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs text-[#4B9CD3] hover:text-[#F8FAFC] transition-colors"
                    >
                      <LinkIcon />
                      {link.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
            </dl>
          </aside>
        </div>
      </div>

      {/* Responsibilities */}
      {project.responsibilities.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12" aria-labelledby="resp-heading">
          <h2 id="resp-heading" className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#3776AB]" aria-hidden="true" />
            Responsibilities
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
            {project.responsibilities.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                <span className="text-[#4B9CD3] font-mono text-xs mt-0.5">›</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Metrics */}
      {project.metrics.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12 border-y border-[#1a2538] py-10 bg-[#0B1120]" aria-labelledby="metrics-heading">
          <div className="max-w-7xl mx-auto">
            <h2 id="metrics-heading" className="text-lg font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-[#FFD343]" aria-hidden="true" />
              Verified Results
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {project.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <div className="text-3xl font-bold font-mono text-[#F8FAFC] mb-1">{m.value}</div>
                  <div className="text-sm text-[#94A3B8]">{m.label}</div>
                  {m.note && <div className="text-xs font-mono text-[#7C8BA3] mt-0.5">{m.note}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenges */}
      {project.challenges.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12" aria-labelledby="challenges-heading">
          <h2 id="challenges-heading" className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#3776AB]" aria-hidden="true" />
            Technical Challenges
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {project.challenges.map((ch, i) => (
              <div key={i} className="bg-[#111827] border border-[#243044] rounded-xl p-6">
                <h3 className="font-semibold text-[#F8FAFC] mb-4">{ch.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Challenge", text: ch.problem, color: "text-[#F59E0B]" },
                    { label: "Approach", text: ch.approach, color: "text-[#4B9CD3]" },
                    { label: "Solution", text: ch.solution, color: "text-[#4B9CD3]" },
                    { label: "Result", text: ch.result, color: "text-[#22C55E]" },
                  ].map(({ label, text, color }) => (
                    <div key={label}>
                      <div className={`font-mono text-2xs ${color} uppercase tracking-wider mb-2`}>{label}</div>
                      <p className="text-sm text-[#94A3B8] leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery. Grid tiles use the ~480×270 compressed thumbnail; the
          lightbox loads the larger ~1920×1080 variant only when opened. */}
      {gallery.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="text-lg font-bold text-[#F8FAFC] mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-[#3776AB]" aria-hidden="true" />
            Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className="text-left cursor-zoom-in"
                aria-label={`Open ${img.caption} full size`}
              >
                <img
                  src={img.thumb}
                  alt={img.caption}
                  // object-contain (not object-cover): a portrait phone
                  // screenshot cropped to this 16:9 box would lose most of
                  // its content, so the image is letterboxed on the fill
                  // color instead — landscape shots still fill the box edge
                  // to edge since they're already close to 16:9.
                  className="w-full aspect-video object-contain bg-[#0B1120] rounded-lg border border-[#243044] hover:border-[#3776AB]/50 transition-colors"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox. The keydown handler lives on `document` via useDialog's
          capture-phase listener, so Escape/arrows work regardless of what
          inside the dialog currently has focus. */}
      {lightboxIdx !== null && gallery[lightboxIdx] && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            className="absolute inset-0 cursor-default"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close lightbox"
            tabIndex={-1}
          />

          <button
            className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors active:opacity-70"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {lightboxIdx > 0 && (
            <button
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors active:opacity-70"
              onClick={() => setLightboxIdx(lightboxIdx - 1)}
              aria-label="Previous image"
            >
              <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          {lightboxIdx < gallery.length - 1 && (
            <button
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white/60 hover:text-white transition-colors active:opacity-70"
              onClick={() => setLightboxIdx(lightboxIdx + 1)}
              aria-label="Next image"
            >
              <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <img
            src={gallery[lightboxIdx].full}
            alt={gallery[lightboxIdx].caption}
            className="relative max-w-full max-h-[85vh] object-contain rounded-lg"
          />
          <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/60">
            {gallery[lightboxIdx].caption}
            <span className="ml-3 font-mono text-xs text-white/40">{lightboxIdx + 1} / {gallery.length}</span>
          </p>
        </div>
      )}

      {/* Related projects */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-lg font-bold text-[#F8FAFC] mb-4">Related Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link
                key={p.slug}
                to={`/projects/${p.slug}`}
                className="bg-[#111827] border border-[#243044] hover:border-[#3776AB]/40 rounded-xl p-4 transition-colors group"
              >
                <div className="text-sm font-medium text-[#F8FAFC] group-hover:text-[#4B9CD3] transition-colors mb-1">
                  {p.name}
                </div>
                <div className="text-xs text-[#7C8BA3] line-clamp-2">{p.shortDescription}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Prev / Next navigation */}
      <nav
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#243044] pt-8 flex items-center justify-between"
        aria-label="Project navigation"
      >
        <div>
          {prevProject && (
            <Link
              to={`/projects/${prevProject.slug}`}
              className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors group"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true">
                <path d="M6.707 12.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L3.414 7H12a1 1 0 110 2H3.414l3.293 3.293a1 1 0 010 1.414z" />
              </svg>
              <span>{prevProject.name}</span>
            </Link>
          )}
        </div>
        <Link to="/projects" className="text-sm text-[#7C8BA3] hover:text-[#94A3B8] transition-colors">
          All Projects
        </Link>
        <div>
          {nextProject && (
            <Link
              to={`/projects/${nextProject.slug}`}
              className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#4B9CD3] transition-colors group"
            >
              <span>{nextProject.name}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M7.293 1.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L10.586 8H2a1 1 0 110-2h8.586L7.293 2.707a1 1 0 010-1.414z" />
              </svg>
            </Link>
          )}
        </div>
      </nav>
    </main>
  );
}
