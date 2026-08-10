/**
 * Mirrors the JSON shape the Django backend actually serializes
 * (apps/portfolio/serializers.py's CamelCaseModelSerializer). Field names
 * that aren't in the backend's FIELD_MAP (technologies, categories, metrics,
 * etc.) stay as-is on both sides — only explicitly mapped snake_case fields
 * become camelCase.
 */

export interface ProjectImageAsset {
  id: number;
  image: string;
  thumbnail: string | null;
  caption: string;
  imageType: string;
}

/** Legacy caption-only gallery entry with no real uploaded file. */
export interface LegacyProjectImage {
  src: string | null;
  caption: string;
  type: string;
}

export interface ProjectLink {
  type: string;
  label: string;
  url: string;
  icon?: string;
}

export interface ProjectChallenge {
  title: string;
  problem: string;
  approach: string;
  solution: string;
  result: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  note?: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  categories: string[];
  featured: boolean;
  biggestProject: boolean;
  confidential: boolean;
  company: string;
  year: string;
  startDate: string;
  endDate: string | null;
  status: string;
  role: string;
  projectType: string;
  /** Absolute URL to the optimized WebP cover (~1600×900), or null. */
  coverImage: string | null;
  /** Absolute URL to the optimized WebP card thumbnail (~640×360), or null. */
  coverThumbnail: string | null;
  /** Legacy caption-only entries — superseded by galleryImages where a real file exists. */
  images: LegacyProjectImage[];
  /** Real uploaded gallery images, already resized/compressed server-side. */
  galleryImages: ProjectImageAsset[];
  technologies: string[];
  features: string[];
  responsibilities: string[];
  challenges: ProjectChallenge[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
}

export interface ProfileMetric {
  value: string;
  label: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface AboutSection {
  id: string;
  title: string;
  content: string;
}

export interface Profile {
  name: string;
  primaryRole: string;
  headline: string;
  summary: string;
  location: string;
  email: string;
  availability: string;
  cvUrl: string;
  /** Absolute URL to the uploaded brand mark, or null if none is set yet
   *  (the nav falls back to its built-in "Y" mark SVG in that case). */
  siteLogo: string | null;
  techStack: string[];
  metrics: ProfileMetric[];
  socialLinks: SocialLink[];
  aboutSections: AboutSection[];
}

export interface ExperienceEntry {
  id: number;
  company: string;
  role: string;
  type: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  highlights: string[];
  technologies: string[];
  special: boolean;
  specialLabel: string;
}

export interface SkillGroup {
  id: number;
  category: string;
  icon: string;
  skills: string[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  highlight: string;
  highlightLabel: string;
  detail: string;
  color: string;
}

export interface Summary {
  profile: Profile | null;
  featuredProjects: Project[];
  projectsCount: number;
  categories: string[];
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  achievements: Achievement[];
}
