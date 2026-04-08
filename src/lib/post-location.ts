import { decodeHtml } from "@/lib/utils";
import type { WPPost } from "@/types/wordpress";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ");

const LOCATION_ALIASES: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bde[-\s]?landsard\b/i, label: "De Landsard" },
  { pattern: /\bstrijen\b/i, label: "Strijen" },
  { pattern: /\bemmen\b/i, label: "Emmen" },
  { pattern: /\bberghem\b/i, label: "Berghem" },
  { pattern: /\bkerkrade\b/i, label: "Kerkrade" },
  { pattern: /\blelystad\b/i, label: "Lelystad" },
  { pattern: /\bassen\b/i, label: "Assen" },
  { pattern: /\bzandvoort\b/i, label: "Zandvoort" },
  { pattern: /\bspa(?:[-\s]?francorchamps)?\b/i, label: "Spa-Francorchamps" },
  { pattern: /\boss\b/i, label: "Oss" },
];

const extractLocationFromText = (value?: string | null) => {
  if (!value) return null;

  const text = decodeHtml(stripHtml(value));

  for (const { pattern, label } of LOCATION_ALIASES) {
    if (pattern.test(text)) {
      return label;
    }
  }

  const match = text.match(/\b(?:op|in|te)\s+(?:het\s+|de\s+)?([A-ZÀ-Ÿ][\wÀ-ÿ-]*(?:\s+[A-ZÀ-Ÿ][\wÀ-ÿ-]*)*)/);
  if (!match) return null;

  const candidate = match[1].trim();
  return /\d/.test(candidate) ? null : candidate;
};

const extractLocationFromTerms = (post: WPPost) => {
  const embedded = post._embedded as { "wp:term"?: Array<Array<{ name?: string; taxonomy?: string }>> } | undefined;
  const terms = embedded?.["wp:term"]?.flat() ?? [];

  for (const term of terms) {
    const name = term?.name?.trim();
    if (!name) continue;

    for (const { pattern, label } of LOCATION_ALIASES) {
      if (pattern.test(name)) {
        return label;
      }
    }
  }

  return null;
};

export const getPostCircuitLabel = (post: WPPost | null | undefined) => {
  if (!post) return "Onbekend circuit";

  const explicitCircuit = typeof post.meta?.circuit === "string" ? decodeHtml(post.meta.circuit).trim() : "";
  if (explicitCircuit) return explicitCircuit;

  return (
    extractLocationFromText(post.title?.rendered) ||
    extractLocationFromText(String(post.meta?._vsgfb_seo_title ?? "")) ||
    extractLocationFromText(String(post.meta?._vsgfb_meta_desc ?? "")) ||
    extractLocationFromText(post.excerpt?.rendered) ||
    extractLocationFromText(post.content?.rendered) ||
    extractLocationFromText(post.slug) ||
    extractLocationFromTerms(post) ||
    "Onbekend circuit"
  );
};
