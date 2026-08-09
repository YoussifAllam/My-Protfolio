import type {
  Achievement,
  ExperienceEntry,
  Project,
  SkillGroup,
  Summary,
} from "../types/portfolio";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`);
  } catch {
    // Network failure (backend down, CORS, offline) — distinguished from an
    // HTTP error status so callers/UI can word them differently if useful.
    throw new ApiError("Could not reach the server. It may be offline.");
  }
  if (!res.ok) {
    throw new ApiError(`Request failed (${res.status})`, res.status);
  }
  return res.json() as Promise<T>;
}

/**
 * The `summary` endpoint bundles profile + featured projects + experience +
 * skills + achievements + categories in one response — nearly every page
 * except the full project list and a single project's detail needs only
 * this. Memoized at module scope so navigating Home → About → Experience
 * during one session reuses the first fetch instead of re-requesting on
 * every route change; a hard refresh naturally clears it.
 */
let summaryPromise: Promise<Summary> | null = null;

export function getSummary(): Promise<Summary> {
  summaryPromise ??= apiFetch<Summary>("/api/portfolio/summary/").catch((err) => {
    // A failed fetch must not poison the cache — the next consumer (or a
    // retry button) should get a fresh attempt, not a permanently rejected
    // promise.
    summaryPromise = null;
    throw err;
  });
  return summaryPromise;
}

/** Clears the memoized summary — call after posting data that summary reflects, if ever. */
export function invalidateSummary(): void {
  summaryPromise = null;
}

/**
 * Memoized the same way as `getSummary` — Projects (the full list) and
 * ProjectDetail (find-by-slug within that same list) both call this, and
 * navigating between them within one session should reuse the first fetch
 * rather than re-requesting identical data.
 */
let projectsPromise: Promise<Project[]> | null = null;

export function getProjects(): Promise<Project[]> {
  projectsPromise ??= apiFetch<Project[]>("/api/portfolio/projects/").catch((err) => {
    projectsPromise = null;
    throw err;
  });
  return projectsPromise;
}

export function invalidateProjects(): void {
  projectsPromise = null;
}

export function getProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/api/portfolio/projects/${encodeURIComponent(slug)}/`);
}

export function getExperience(): Promise<ExperienceEntry[]> {
  return apiFetch<ExperienceEntry[]>("/api/portfolio/experience/");
}

export function getSkills(): Promise<SkillGroup[]> {
  return apiFetch<SkillGroup[]>("/api/portfolio/skills/");
}

export function getAchievements(): Promise<Achievement[]> {
  return apiFetch<Achievement[]>("/api/portfolio/achievements/");
}
