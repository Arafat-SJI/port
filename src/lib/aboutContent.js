import { ABOUT } from "@/data/portfolio";

/** Public portfolio visibility for About sub-blocks (dashboard toggles). Default: all shown. */
export const DEFAULT_ABOUT_VISIBILITY = {
  image: true,
  headline: true,
  intro: true,
  primaryCta: true,
  secondaryCta: true,
  summary: true,
  interests: true,
};

/** Fallback when Supabase has no `about` row yet. */
export const DEFAULT_ABOUT_CONTENT = {
  headlinePrefix: "Crafting digital ",
  headlineHighlight: "intelligence",
  headlineSuffix: " & architecture.",
  intro:
    "I'm **Arafat**, a Software Engineer focused on building high-performance AI-driven experiences and scalable backend architectures.",
  primaryCta: "View Projects",
  secondaryCta: "Download CV",
  /** Public URL of uploaded CV PDF (Supabase Storage). Empty = button inactive. */
  cvUrl: "",
  /** Public URL of About/hero portrait (Supabase Storage). Empty = no image. */
  imageUrl: "",
  summary: ABOUT.summary,
  interests: [...ABOUT.interests],
  visibility: { ...DEFAULT_ABOUT_VISIBILITY },
};

export function normalizeAboutVisibility(input) {
  let raw = input;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }
  const v = raw && typeof raw === "object" ? raw : {};
  return {
    image: v.image !== false,
    headline: v.headline !== false,
    intro: v.intro !== false,
    primaryCta: v.primaryCta !== false,
    secondaryCta: v.secondaryCta !== false,
    summary: v.summary !== false,
    interests: v.interests !== false,
  };
}

export const ABOUT_SETTINGS_KEY = "about";
export const CV_STORAGE_BUCKET = "portfolio-cv";
export const CV_STORAGE_PATH = "cv/resume.pdf";
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export const ABOUT_IMAGE_BUCKET = "portfolio-about";
export const ABOUT_IMAGE_PATH = "about/portrait";
export const ABOUT_IMAGE_MAX_BYTES = 3 * 1024 * 1024;
export const ABOUT_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/** Build intro from legacy name + tagline fields if needed. */
function introFromLegacy(raw) {
  if (typeof raw.intro === "string" && raw.intro.trim()) {
    return raw.intro;
  }
  const name = String(raw.name ?? "").trim();
  const tagline = String(raw.tagline ?? "").trim();
  if (name || tagline) {
    const boldName = name ? `**${name}**` : "";
    if (boldName && tagline) return `I'm ${boldName}, ${tagline}`;
    if (boldName) return `I'm ${boldName}`;
    return tagline;
  }
  return DEFAULT_ABOUT_CONTENT.intro;
}

/** Strip **bold** markers for plain-text uses (search, etc.). */
export function stripIntroMarkup(intro) {
  return String(intro ?? "").replace(/\*\*([^*]+)\*\*/g, "$1");
}

/**
 * Split intro into text / bold segments for rendering.
 * Markup: wrap bold parts in **like this** (storage only — UI shows real bold).
 */
export function parseIntroSegments(intro) {
  const text = String(intro ?? "");
  const segments = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: "text", value: text.slice(last, match.index) });
    }
    segments.push({ type: "bold", value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ type: "text", value: text.slice(last) });
  }
  if (!segments.length) {
    segments.push({ type: "text", value: text });
  }
  return segments;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert **markup** → HTML for a contenteditable editor. */
export function introMarkupToHtml(intro) {
  return parseIntroSegments(intro)
    .map((seg) =>
      seg.type === "bold"
        ? `<strong>${escapeHtml(seg.value)}</strong>`
        : escapeHtml(seg.value)
    )
    .join("");
}

/**
 * Convert contenteditable HTML → **markup** for storage.
 * Handles <strong>/<b> and plain text.
 */
export function introHtmlToMarkup(html) {
  if (typeof html !== "string") return "";
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n");

  // Temporary markers for bold tags so we can strip other tags safely
  let marked = withBreaks
    .replace(/<(strong|b)(\s[^>]*)?>/gi, "{{B}}")
    .replace(/<\/(strong|b)>/gi, "{{/B}}");

  marked = marked.replace(/<[^>]+>/g, "");
  marked = marked
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  // Collapse nested/adjacent bold markers into **text**
  marked = marked.replace(/\{\{B\}\}/g, "**").replace(/\{\{\/B\}\}/g, "**");
  // Fix accidental **** from adjacent bolds
  marked = marked.replace(/\*\*\*\*/g, "");
  return marked.replace(/\n+/g, " ").trim();
}

export function normalizeAboutContent(input) {
  const raw = input && typeof input === "object" ? input : {};
  const interests = Array.isArray(raw.interests)
    ? raw.interests.map((i) => String(i ?? "").trim()).filter(Boolean)
    : typeof raw.interests === "string"
      ? raw.interests
          .split(/\n|,/)
          .map((i) => i.trim())
          .filter(Boolean)
      : [...DEFAULT_ABOUT_CONTENT.interests];

  const intro = String(introFromLegacy(raw)).trim() || DEFAULT_ABOUT_CONTENT.intro;
  const cvUrl = String(raw.cvUrl ?? DEFAULT_ABOUT_CONTENT.cvUrl).trim();
  const imageUrl = String(raw.imageUrl ?? DEFAULT_ABOUT_CONTENT.imageUrl).trim();

  return {
    headlinePrefix: String(raw.headlinePrefix ?? DEFAULT_ABOUT_CONTENT.headlinePrefix),
    headlineHighlight: String(
      raw.headlineHighlight ?? DEFAULT_ABOUT_CONTENT.headlineHighlight
    ),
    headlineSuffix: String(raw.headlineSuffix ?? DEFAULT_ABOUT_CONTENT.headlineSuffix),
    intro,
    primaryCta: String(raw.primaryCta ?? DEFAULT_ABOUT_CONTENT.primaryCta),
    secondaryCta: String(raw.secondaryCta ?? DEFAULT_ABOUT_CONTENT.secondaryCta),
    cvUrl,
    imageUrl,
    summary: String(raw.summary ?? DEFAULT_ABOUT_CONTENT.summary),
    interests: interests.length ? interests : [...DEFAULT_ABOUT_CONTENT.interests],
    visibility: normalizeAboutVisibility(raw.visibility),
  };
}

/** Lines used by portfolio search for #about (skips hidden blocks). */
export function aboutSearchLines(content) {
  const about = normalizeAboutContent(content);
  const { visibility: vis } = about;
  const lines = [];
  if (vis.headline) {
    lines.push(
      `${about.headlinePrefix}${about.headlineHighlight}${about.headlineSuffix}`
    );
  }
  if (vis.intro) lines.push(stripIntroMarkup(about.intro));
  if (vis.summary) lines.push(about.summary);
  if (vis.interests) {
    lines.push(...about.interests.map((i) => `interest: ${i}`));
  }
  return lines;
}
