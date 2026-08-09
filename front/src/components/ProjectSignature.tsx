import type { Project } from "../data/projects";

/**
 * A generated architecture "signature" for a project that has no screenshot.
 *
 * Every project's cover was an empty band: all `coverImage` are null, and the
 * flagship (jafco-analytics) is confidential so it can never have one. Backend
 * work also screenshots badly — a Django admin page under-sells it. The honest
 * picture of what was built is the topology, which we can derive from the
 * `technologies` / `categories` / `metrics` already on each project.
 *
 * Design constraints this file holds to:
 *  - Pure function of (project, size). No state, no timers, no Math.random,
 *    no Date.now — rendering twice yields byte-identical SVG.
 *  - Everything lives inside a fixed viewBox with preserveAspectRatio, so the
 *    percentage-positioned clipping bug the hero diagram had cannot recur.
 *  - Pills are packed by measured width and *dropped* into a "+N more" count
 *    rather than allowed to overflow.
 */

/* ────────────────────────────────────────────────── node kinds and palette */

type NodeKind =
  | "client"
  | "api"
  | "datastore"
  | "cache"
  | "worker"
  | "search"
  | "model"
  | "observe"
  | "infra"
  | "auth";

/** Opaque fills, so the ghosted metric reads as *behind* the pills. */
const KIND_STYLE: Record<NodeKind, { fill: string; stroke: string; text: string; dot: string }> = {
  api: { fill: "#172033", stroke: "#3776AB", text: "#4B9CD3", dot: "#4B9CD3" },
  client: { fill: "#111827", stroke: "#243044", text: "#94A3B8", dot: "#7C8BA3" },
  datastore: { fill: "#0E2A22", stroke: "#44B78B", text: "#44B78B", dot: "#44B78B" },
  search: { fill: "#0E2A22", stroke: "#2F7F63", text: "#44B78B", dot: "#44B78B" },
  cache: { fill: "#1C1A12", stroke: "#FFD343", text: "#FFD343", dot: "#FFD343" },
  worker: { fill: "#1C1A12", stroke: "#8A7420", text: "#FFD343", dot: "#FFD343" },
  model: { fill: "#0E2A22", stroke: "#2F7F63", text: "#44B78B", dot: "#44B78B" },
  observe: { fill: "#1F1608", stroke: "#8A5B12", text: "#F59E0B", dot: "#F59E0B" },
  infra: { fill: "#111827", stroke: "#243044", text: "#94A3B8", dot: "#7C8BA3" },
  auth: { fill: "#111827", stroke: "#243044", text: "#94A3B8", dot: "#7C8BA3" },
};

const KIND_FALLBACK_LABEL: Record<NodeKind, string> = {
  client: "Clients",
  api: "Service",
  datastore: "Database",
  cache: "Cache",
  worker: "Workers",
  search: "Search",
  model: "Model",
  observe: "Monitor",
  infra: "Runtime",
  auth: "Auth",
};

/** Leaf render order: storage first, plumbing last — reads as depth. */
const LEAF_ORDER: NodeKind[] = [
  "datastore",
  "cache",
  "worker",
  "search",
  "model",
  "observe",
  "infra",
  "auth",
];

/* ─────────────────────────────────────────────────────── the keyword table */

interface Rule {
  kw: string;
  kind: NodeKind;
  short: string;
}

/**
 * Ordered, most specific first. For a `technologies` entry the FIRST matching
 * rule wins; for the features blob every match is collected. When several rules
 * hit the same kind, the lowest index supplies the label — which is why
 * `docker` must precede `ci/cd`, and `postgres` must precede `sql`.
 */
const RAW_RULES: Rule[] = [
  // models / AI
  { kw: "openai", kind: "model", short: "OpenAI" },
  { kw: "gpt", kind: "model", short: "GPT" },
  { kw: "gemini", kind: "model", short: "Gemini" },
  { kw: "langchain", kind: "model", short: "LangChain" },
  { kw: "yolo", kind: "model", short: "YOLO" },
  { kw: "cnn", kind: "model", short: "CNN" },
  { kw: "neural", kind: "model", short: "DNN" },
  { kw: "deep learning", kind: "model", short: "DNN" },
  { kw: "machine learning", kind: "model", short: "ML" },
  { kw: "tensorflow", kind: "model", short: "TF" },
  { kw: "pytorch", kind: "model", short: "PyTorch" },
  { kw: "computer vision", kind: "model", short: "Vision" },
  { kw: "text-to-speech", kind: "model", short: "TTS" },
  // search
  { kw: "elasticsearch", kind: "search", short: "Elastic" },
  { kw: "opensearch", kind: "search", short: "Search" },
  { kw: "full-text", kind: "search", short: "Search" },
  // cache
  { kw: "redis", kind: "cache", short: "Redis" },
  { kw: "memcached", kind: "cache", short: "Memcache" },
  { kw: "caching", kind: "cache", short: "Cache" },
  { kw: "cache", kind: "cache", short: "Cache" },
  // workers / queues
  { kw: "celery", kind: "worker", short: "Celery" },
  { kw: "rabbitmq", kind: "worker", short: "RabbitMQ" },
  { kw: "kafka", kind: "worker", short: "Kafka" },
  { kw: "background worker", kind: "worker", short: "Workers" },
  { kw: "async", kind: "worker", short: "Async" },
  { kw: "queue", kind: "worker", short: "Queue" },
  // datastore
  { kw: "postgres", kind: "datastore", short: "PostgreSQL" },
  { kw: "mysql", kind: "datastore", short: "MySQL" },
  { kw: "mongo", kind: "datastore", short: "MongoDB" },
  { kw: "sqlite", kind: "datastore", short: "SQLite" },
  { kw: "ms sql", kind: "datastore", short: "MSSQL" },
  { kw: "database", kind: "datastore", short: "Database" },
  { kw: "indexing", kind: "datastore", short: "Database" },
  { kw: "records", kind: "datastore", short: "Database" },
  { kw: "transaction", kind: "datastore", short: "Database" },
  { kw: "inventory", kind: "datastore", short: "Database" },
  { kw: "sql", kind: "datastore", short: "SQL" },
  // observability
  { kw: "grafana", kind: "observe", short: "Grafana" },
  { kw: "prometheus", kind: "observe", short: "Prometheus" },
  { kw: "sentry", kind: "observe", short: "Sentry" },
  { kw: "monitoring", kind: "observe", short: "Monitor" },
  // auth
  { kw: "authentication", kind: "auth", short: "Auth" },
  { kw: "authorization", kind: "auth", short: "Auth" },
  { kw: "oauth", kind: "auth", short: "OAuth" },
  { kw: "permissions", kind: "auth", short: "RBAC" },
  { kw: "role-based", kind: "auth", short: "RBAC" },
  { kw: "jwt", kind: "auth", short: "JWT" },
  { kw: "auth", kind: "auth", short: "Auth" },
  // infra
  { kw: "kubernetes", kind: "infra", short: "K8s" },
  { kw: "docker", kind: "infra", short: "Docker" },
  { kw: "nginx", kind: "infra", short: "Nginx" },
  { kw: "apache", kind: "infra", short: "Apache" },
  { kw: "aws", kind: "infra", short: "AWS" },
  { kw: "github actions", kind: "infra", short: "Actions" },
  { kw: "ci/cd", kind: "infra", short: "CI/CD" },
  { kw: "load balancing", kind: "infra", short: "LB" },
  { kw: "vps", kind: "infra", short: "VPS" },
  // clients
  { kw: "react native", kind: "client", short: "Mobile" },
  { kw: "react", kind: "client", short: "React" },
  { kw: "next.js", kind: "client", short: "Next.js" },
  { kw: "vue", kind: "client", short: "Vue" },
  { kw: "flutter", kind: "client", short: "Flutter" },
  { kw: "pyqt", kind: "client", short: "PyQt5" },
  // api / core — broadest, therefore last
  { kw: "django rest", kind: "api", short: "Django REST" },
  { kw: "drf", kind: "api", short: "Django REST" },
  { kw: "fastapi", kind: "api", short: "FastAPI" },
  { kw: "graphql", kind: "api", short: "GraphQL" },
  { kw: "flask", kind: "api", short: "Flask" },
  { kw: "django", kind: "api", short: "Django" },
  { kw: "rest api", kind: "api", short: "REST API" },
  { kw: "api", kind: "api", short: "API" },
  { kw: "python", kind: "api", short: "Python" },
];

/**
 * Keywords of four characters or fewer match on word boundaries, so "sql"
 * cannot fire inside "postgresql" and "auth" cannot fire inside
 * "authentication" (where the longer rule has already matched).
 */
function makeTest(kw: string): (t: string) => boolean {
  if (kw.length > 4) return (t) => t.includes(kw);
  const escaped = kw.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`);
  return (t) => re.test(t);
}

const RULES = RAW_RULES.map((r) => ({ ...r, test: makeTest(r.kw) }));

/** Weak second source — only kinds a category genuinely implies. */
const CATEGORY_KIND: Record<string, NodeKind | undefined> = {
  AI: "model",
  "Machine Learning": "model",
  "Computer Vision": "model",
  Research: "model",
  DevOps: "infra",
  "Data Platform": "datastore",
};

/** Ingress label when no client-side technology is declared. First match wins. */
const INGRESS_BY_CATEGORY: [string, string][] = [
  ["Computer Vision", "Camera"],
  ["Desktop Apps", "Desktop"],
  ["E-commerce", "Storefront"],
  ["Logistics", "Operations"],
  ["Full Stack", "Web App"],
  ["Research", "Researchers"],
  ["Enterprise System", "Branches"],
];

/* ────────────────────────────────────────────────────────────── derivation */

interface Entry {
  kind: NodeKind;
  short: string;
  rank: number;
  tier: number;
}

interface SigNode {
  kind: NodeKind;
  label: string;
}

interface Signature {
  ingress: SigNode;
  core: SigNode;
  leaves: SigNode[];
  overflow: number;
  ghost: { text: string; tone: "metric" | "label" };
  summary: string;
}

function absorb(map: Map<NodeKind, Entry>, e: Entry): void {
  const cur = map.get(e.kind);
  if (!cur || e.tier < cur.tier || (e.tier === cur.tier && e.rank < cur.rank)) {
    map.set(e.kind, e);
  }
}

function firstHit(text: string, tier: number): Entry | null {
  const t = text.toLowerCase();
  for (let i = 0; i < RULES.length; i++) {
    if (RULES[i].test(t)) {
      return { kind: RULES[i].kind, short: RULES[i].short, rank: i, tier };
    }
  }
  return null;
}

function allHits(text: string, tier: number): Entry[] {
  const t = text.toLowerCase();
  const out: Entry[] = [];
  for (let i = 0; i < RULES.length; i++) {
    if (RULES[i].test(t)) {
      out.push({ kind: RULES[i].kind, short: RULES[i].short, rank: i, tier });
    }
  }
  return out;
}

/* The ghosted headline figure. */

const SCALE_RULES: { re: RegExp; fmt: (m: RegExpMatchArray) => string }[] = [
  {
    re: /(~?\s*\d[\d.,]*)\s*(billion|million|thousand)\b/i,
    fmt: (m) => {
      const unit = m[2].toLowerCase();
      const suffix = unit === "billion" ? "B" : unit === "million" ? "M" : "K";
      return "~" + m[1].replace(/[~\s]/g, "") + suffix;
    },
  },
  { re: /(\d[\d.,]*\s*%)/, fmt: (m) => m[1].replace(/\s+/g, "") },
  { re: /\b(\d[\d.,]*)\s?([KMB])\+?/, fmt: (m) => m[1] + m[2].toUpperCase() + "+" },
  { re: /\b(\d+)(st|nd|rd|th)\s+place\b/i, fmt: (m) => m[1] + m[2].toLowerCase() },
  { re: /\b(\d{1,3}(?:,\d{3})+)\+?/, fmt: (m) => m[1] + "+" },
];

function extractScale(text: string): string | null {
  for (const rule of SCALE_RULES) {
    const m = text.match(rule.re);
    if (m) return rule.fmt(m);
  }
  return null;
}

function deriveGhost(project: Project): Signature["ghost"] {
  // 1. A curated metric — prefer whichever one the subtitle already headlines.
  if (project.metrics.length > 0) {
    const picked =
      project.metrics.find((mt) => project.subtitle.includes(mt.value)) ?? project.metrics[0];
    return { text: picked.value, tone: "metric" };
  }
  // 2. A quantity already stated in the copy (features are terser than prose).
  const fromFeatures = project.features.length ? extractScale(project.features.join(" | ")) : null;
  const scale = fromFeatures ?? extractScale(project.shortDescription);
  if (scale) return { text: scale, tone: "metric" };
  // 3. The most specific category — always last in these arrays.
  const cats = project.categories;
  const label = cats.length > 0 ? cats[cats.length - 1] : project.projectType;
  return { text: label.toUpperCase(), tone: "label" };
}

function countLeaves(kinds: Map<NodeKind, Entry>, consumed: Set<NodeKind>): number {
  return LEAF_ORDER.filter((k) => kinds.has(k) && !consumed.has(k)).length;
}

function deriveSignature(project: Project, maxLeaves: number): Signature {
  const kinds = new Map<NodeKind, Entry>();

  // Pass A — technologies. Authoritative; first matching rule per string.
  for (const tech of project.technologies) {
    const hit = firstHit(tech, 0);
    if (hit) absorb(kinds, hit);
  }

  // `client` becomes the ingress and `api` the core, so neither is a leaf.
  const reserved = new Set<NodeKind>(["client", "api"]);

  // Passes B and C only run while the topology is still thin, so data-rich
  // projects keep their distinct shape instead of homogenising.
  if (countLeaves(kinds, reserved) < 3) {
    for (const cat of project.categories) {
      const kind = CATEGORY_KIND[cat];
      if (kind) {
        absorb(kinds, { kind, short: KIND_FALLBACK_LABEL[kind], rank: RULES.length, tier: 1 });
      }
    }
  }
  if (countLeaves(kinds, reserved) < 3 && project.features.length > 0) {
    for (const hit of allHits(project.features.join(" | "), 2)) absorb(kinds, hit);
  }

  // Ingress: a declared client technology beats a category guess beats "Clients".
  const clientEntry = kinds.get("client");
  let ingressLabel = "Clients";
  if (clientEntry && clientEntry.tier === 0) {
    ingressLabel = clientEntry.short;
  } else {
    for (const [cat, label] of INGRESS_BY_CATEGORY) {
      if (project.categories.includes(cat)) {
        ingressLabel = label;
        break;
      }
    }
  }
  const ingress: SigNode = { kind: "client", label: ingressLabel };

  // Core: the API if there is one, else the model, else a generic service.
  const apiEntry = kinds.get("api");
  const modelEntry = kinds.get("model");
  const core: SigNode = apiEntry
    ? { kind: "api", label: apiEntry.short }
    : modelEntry
      ? { kind: "model", label: modelEntry.short }
      : { kind: "api", label: KIND_FALLBACK_LABEL.api };

  const consumed = new Set<NodeKind>(["client", core.kind]);
  const all: SigNode[] = LEAF_ORDER.filter((k) => kinds.has(k) && !consumed.has(k)).map((k) => {
    const entry = kinds.get(k);
    return { kind: k, label: entry ? entry.short : KIND_FALLBACK_LABEL[k] };
  });

  // Totality: every project yields at least ingress + core + one leaf, even
  // one declaring no technologies at all.
  if (all.length === 0) {
    all.push(
      core.kind === "api"
        ? { kind: "datastore", label: KIND_FALLBACK_LABEL.datastore }
        : { kind: "infra", label: KIND_FALLBACK_LABEL.infra },
    );
  }

  const leaves = all.slice(0, maxLeaves);
  const overflow = all.length - leaves.length;

  const names = leaves.map((l) => l.label);
  const list =
    names.length > 1
      ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
      : names[0];
  const ghost = deriveGhost(project);

  return {
    ingress,
    core,
    leaves,
    overflow,
    ghost,
    summary:
      `Architecture: ${ingress.label} to ${core.label}, backed by ${list}` +
      (overflow > 0 ? `, and ${overflow} more service${overflow > 1 ? "s" : ""}` : "") +
      "." +
      (ghost.tone === "metric" ? ` Headline figure: ${ghost.text}.` : ""),
  };
}

/* ───────────────────────────────────────────────────────────────── layout */

export type SignatureSize = "card" | "detail";

interface Metrics {
  W: number;
  H: number;
  pad: number;
  gapMax: number;
  font: number;
  kindFont: number;
  showKind: boolean;
  padX: number;
  dotR: number;
  radius: number;
  rowY: [number, number, number];
  maxLeaves: number;
  minPill: number;
  ghostMax: number;
  ghostLabelMax: number;
  footFont: number;
}

const SIZES: Record<SignatureSize, Metrics> = {
  card: {
    W: 320,
    H: 132,
    pad: 6,
    gapMax: 70,
    font: 11,
    kindFont: 0,
    showKind: false,
    padX: 7,
    dotR: 2,
    radius: 5,
    // Leaf row stops at 0.74 so the "+N more" footer has clear air beneath it.
    rowY: [0.14, 0.44, 0.74],
    maxLeaves: 4,
    minPill: 46,
    ghostMax: 76,
    ghostLabelMax: 34,
    footFont: 8,
  },
  detail: {
    // Wider than 4:3 so the band letterboxes less at desktop widths.
    W: 760,
    H: 210,
    pad: 8,
    gapMax: 132,
    font: 14,
    // Kind sublabels are dropped: "PostgreSQL / datastore" is redundant, and
    // at a 375px viewport the band scales them to ~4.6px — illegible.
    kindFont: 0,
    showKind: false,
    padX: 10,
    dotR: 2.6,
    radius: 7,
    rowY: [0.15, 0.46, 0.78],
    maxLeaves: 5,
    minPill: 68,
    ghostMax: 112,
    ghostLabelMax: 48,
    footFont: 9,
  },
};

/** JetBrains Mono (and any monospace fallback) advances at ~0.62em. */
const ADVANCE = 0.62;

function pillWidth(label: string, m: Metrics): number {
  return Math.max(
    m.minPill,
    Math.round(label.length * m.font * ADVANCE + m.padX * 2 + m.dotR * 2 + 5),
  );
}

const pillHeight = (m: Metrics) => (m.showKind ? m.font + m.kindFont + 14 : m.font + 10);

interface Placed extends SigNode {
  x: number;
  y: number;
  w: number;
  h: number;
}

function layoutSignature(sig: Signature, m: Metrics) {
  const h = pillHeight(m);
  const rows = m.rowY.map((r) => Math.round(r * m.H)) as [number, number, number];
  const cx = m.W / 2;

  const ingress: Placed = {
    ...sig.ingress,
    x: cx,
    y: rows[0],
    w: pillWidth(sig.ingress.label, m),
    h,
  };
  const core: Placed = { ...sig.core, x: cx, y: rows[1], w: pillWidth(sig.core.label, m), h };

  // Deterministic horizontal packing. The row is centred inside [pad, W-pad]
  // and pills are dropped until it fits, so overflow is impossible by
  // construction rather than by tuning.
  const avail = m.W - m.pad * 2;
  let items = sig.leaves.slice();
  let widths = items.map((l) => pillWidth(l.label, m));
  let overflow = sig.overflow;
  const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);

  while (items.length > 1 && sum(widths) + 4 * (items.length - 1) > avail) {
    items = items.slice(0, -1);
    widths = widths.slice(0, -1);
    overflow += 1;
  }

  const n = items.length;
  const totalW = sum(widths);
  const gap = n > 1 ? Math.min(m.gapMax, Math.max(4, (avail - totalW) / (n - 1))) : 0;
  let cursor = m.pad + Math.max(0, (avail - (totalW + gap * (n - 1))) / 2);

  const leaves: Placed[] = items.map((leaf, i) => {
    const w = Math.min(widths[i], avail);
    const placed: Placed = { ...leaf, x: cursor + w / 2, y: rows[2], w, h };
    cursor += w + gap;
    return placed;
  });

  const links = [
    { x1: ingress.x, y1: ingress.y + h / 2, x2: core.x, y2: core.y - h / 2 },
    ...leaves.map((l) => ({ x1: core.x, y1: core.y + h / 2, x2: l.x, y2: l.y - h / 2 })),
  ];

  // Ghost sized from character count, so it can never overflow the box.
  const isLabel = sig.ghost.tone === "label";
  const maxFs = isLabel ? m.ghostLabelMax : m.ghostMax;
  const adv = isLabel ? 0.72 : ADVANCE;
  const len = Math.max(sig.ghost.text.length, 2);
  const ghostSize = Math.max(12, Math.min(maxFs, (m.W * 0.86) / (adv * len)));

  return {
    ingress,
    core,
    leaves,
    links,
    overflow,
    ghostSize,
    ghostSpacing: isLabel ? ghostSize * 0.1 : 0,
    ghostY: rows[1],
  };
}

/* ────────────────────────────────────────────────────────────── component */

function Pill({ node, m }: { node: Placed; m: Metrics }) {
  const s = KIND_STYLE[node.kind];
  const left = node.x - node.w / 2;
  const dotX = left + m.padX + m.dotR;
  const textX = node.x + (m.dotR * 2 + 5) / 2;
  const midY = m.showKind ? node.y - 4 : node.y;
  return (
    <g>
      <rect
        x={left}
        y={node.y - node.h / 2}
        width={node.w}
        height={node.h}
        rx={m.radius}
        fill={s.fill}
        stroke={s.stroke}
        strokeWidth={1}
      />
      <circle cx={dotX} cy={midY} r={m.dotR} fill={s.dot} />
      <text
        x={textX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono"
        fontSize={m.font}
        fontWeight={500}
        fill={s.text}
      >
        {node.label}
      </text>
      {m.showKind && (
        <text
          x={textX}
          y={node.y + m.kindFont + 1}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono"
          fontSize={m.kindFont}
          fill="#7C8BA3"
        >
          {node.kind}
        </text>
      )}
    </g>
  );
}

export default function ProjectSignature({
  project,
  size = "card",
  decorative,
  animated = true,
  className = "",
}: {
  project: Project;
  size?: SignatureSize;
  /**
   * Defaults to true on cards, where ProjectCard already lists the same stack
   * as TechBadges a few pixels below — announcing it twice is noise. On the
   * detail hero it becomes a real role="img" with a generated description.
   */
  decorative?: boolean;
  animated?: boolean;
  className?: string;
}) {
  const m = SIZES[size];
  const sig = deriveSignature(project, m.maxLeaves);
  const l = layoutSignature(sig, m);
  const isDecorative = decorative ?? size === "card";

  const a11y = isDecorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": sig.summary } as const);

  return (
    <div {...a11y} className={`relative w-full h-full overflow-hidden bg-[#0B1120] ${className}`}>
      {/* Blueprint texture, kept as CSS so the SVG's letterboxing is invisible. */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #243044 0px, #243044 1px, transparent 1px, transparent 32px), repeating-linear-gradient(90deg, #243044 0px, #243044 1px, transparent 1px, transparent 32px)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 46%, rgba(55,118,171,0.12), rgba(11,17,32,0) 68%)",
        }}
      />

      <svg
        className="relative w-full h-full"
        viewBox={`0 0 ${m.W} ${m.H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        {/* The headline figure, ghosted behind the topology. */}
        <text
          x={m.W / 2}
          y={l.ghostY}
          textAnchor="middle"
          dominantBaseline="central"
          className="font-mono"
          fontSize={l.ghostSize}
          fontWeight={700}
          letterSpacing={l.ghostSpacing}
          fill={sig.ghost.tone === "metric" ? "#FFD343" : "#3776AB"}
          opacity={sig.ghost.tone === "metric" ? 0.08 : 0.11}
        >
          {sig.ghost.text}
        </text>

        {l.links.map((link, i) => (
          <line
            key={i}
            x1={link.x1}
            y1={link.y1}
            x2={link.x2}
            y2={link.y2}
            stroke="#243044"
            strokeWidth={1}
            strokeLinecap="round"
            className={animated ? "sig-link" : undefined}
            style={{ animationDelay: `${(i * 0.22).toFixed(2)}s` }}
          />
        ))}

        <Pill node={l.ingress} m={m} />
        <Pill node={l.core} m={m} />
        {l.leaves.map((leaf) => (
          <Pill key={leaf.kind} node={leaf} m={m} />
        ))}

        {l.overflow > 0 && (
          <text
            x={m.W - m.pad}
            y={m.H - m.footFont}
            textAnchor="end"
            className="font-mono"
            fontSize={m.footFont}
            fill="#7C8BA3"
          >
            +{l.overflow} more
          </text>
        )}
        {size === "detail" && (
          <text
            x={m.pad}
            y={m.H - m.footFont}
            className="font-mono"
            fontSize={m.footFont}
            fill="#7C8BA3"
          >
            // stack signature · derived from declared technologies
          </text>
        )}
      </svg>
    </div>
  );
}
