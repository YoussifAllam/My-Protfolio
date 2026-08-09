import { useState, useMemo } from "react";
import { projects, CATEGORIES, type Project } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

type SortKey = "featured" | "newest" | "oldest" | "alpha";

/** Undated projects sort to the end under both date orders, never to the top. */
const dateKey = (p: Project, whenMissing: string) => p.startDate ?? whenMissing;

const SORTERS: Record<SortKey, (a: Project, b: Project) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name),
  newest: (a, b) => dateKey(b, "0000-00").localeCompare(dateKey(a, "0000-00")),
  oldest: (a, b) => dateKey(a, "9999-99").localeCompare(dateKey(b, "9999-99")),
  alpha: (a, b) => a.name.localeCompare(b.name),
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const list = projects.filter((p) => {
      const matchCat = activeCategory === "All" || p.categories.includes(activeCategory);
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categories.some((c) => c.toLowerCase().includes(q)) ||
        p.technologies.some((t) => t.toLowerCase().includes(q)) ||
        p.role.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });

    return list.sort(SORTERS[sort]);
  }, [activeCategory, search, sort]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    CATEGORIES.filter((c) => c !== "All").forEach((cat) => {
      counts[cat] = projects.filter((p) => p.categories.includes(cat)).length;
    });
    return counts;
  }, []);

  return (
    <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs text-[#3776AB] mb-2">// projects</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#F8FAFC] mb-3">Projects</h1>
        <p className="text-[#94A3B8] max-w-xl">
          Production backend systems, scalable platforms, AI-powered products, full-stack
          applications, and Python desktop software.
        </p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Category filters - scrollable on mobile */}
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 flex-1"
          role="group"
          aria-label="Project category filters"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? "bg-[#3776AB] text-white border border-[#3776AB]"
                  : "bg-[#111827] text-[#94A3B8] border border-[#243044] hover:border-[#3776AB]/50 hover:text-[#F8FAFC]"
              }`}
              aria-pressed={activeCategory === cat}
            >
              {cat}
              <span
                className={`font-mono text-[10px] ${activeCategory === cat ? "text-white/70" : "text-[#64748B]"}`}
              >
                {categoryCounts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-[#111827] border border-[#243044] text-[#94A3B8] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#3776AB] appearance-none min-w-[140px]"
          aria-label="Sort projects"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, technologies, or solutions..."
          className="w-full bg-[#111827] border border-[#243044] text-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-lg text-sm placeholder-[#64748B] focus:outline-none focus:border-[#3776AB] transition-colors"
          aria-label="Search projects"
        />
      </div>

      {/* Count */}
      <p className="text-xs font-mono text-[#64748B] mb-6">
        Showing {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
        {search ? ` matching "${search}"` : ""}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-20 border border-dashed border-[#243044] rounded-xl">
          <div className="font-mono text-[#64748B] text-sm mb-2">
            # No projects match your current filters.
          </div>
          <p className="text-[#94A3B8] text-sm mb-6">
            Try adjusting the category or search terms.
          </p>
          <button
            onClick={() => { setActiveCategory("All"); setSearch(""); }}
            className="px-4 py-2 text-sm bg-[#172033] border border-[#243044] hover:border-[#3776AB] text-[#94A3B8] hover:text-[#F8FAFC] rounded-lg transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </main>
  );
}
