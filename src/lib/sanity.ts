import { createClient } from "next-sanity";

// ====================================================================
// Sanity Configuration
// ====================================================================

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const isConfigured = projectId && projectId !== "YOUR_PROJECT_ID" && projectId.length > 0;

export const sanityConfig = {
  projectId: projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};

export const sanityClient = isConfigured
  ? createClient(sanityConfig)
  : null;

// ====================================================================
// GROQ Queries
// ====================================================================

const videoFields = `
  _id,
  title,
  "slug": slug.current,
  description,
  "category": category->title,
  publishedAt,
  youtubeId,
  thumbnail,
  models,
  prompts,
  files
`;

// ====================================================================
// Data Fetching — مع fallback تلقائي لـ local data
// ====================================================================

export async function getAllVideos() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "video"] | order(publishedAt desc) { ${videoFields} }`
    );
  } catch {
    return null;
  }
}

export async function getVideoBySlug(slug: string) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "video" && slug.current == $slug][0] { ${videoFields} }`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getAllResources() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "resource"] | order(title asc) {
        _id, title, description, url, domain,
        "category": category->title
      }`
    );
  } catch {
    return null;
  }
}

// ====================================================================
// Mapper: تحويل بيانات Sanity لـ TypeScript types
// ====================================================================

import type { Video, Resource } from "./types";

export function mapSanityVideoToType(s: any): Video {
  return {
    slug: s.slug || "",
    title: s.title || "",
    description: s.description || "",
    category: s.category || "غير مصنف",
    date: s.publishedAt
      ? new Date(s.publishedAt).toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    youtubeId: s.youtubeId || "",
    thumbnail:
      s.thumbnail ||
      (s.youtubeId
        ? `https://img.youtube.com/vi/${s.youtubeId}/maxresdefault.jpg`
        : ""),
    models: (s.models || []).map((m: any) => ({
      name: m.name || "",
      quantization: m.quantization || undefined,
      hardware: m.hardware || undefined,
      provider: m.provider || undefined,
      type: (m.type as "local" | "cloud") || "local",
    })),
    prompts: (s.prompts || []).map((p: any) => ({
      id: p.id || 0,
      title: p.title || "",
      content: p.content || "",
    })),
    files: (s.files || []).map((f: any) => ({
      id: f.id || 0,
      modelName: f.modelName || "",
      promptTitle: f.promptTitle || "",
      previewHtml: f.previewHtml || "",
      sourceCode: f.sourceCode || "",
    })),
  };
}

export function mapSanityResourceToType(s: any): Resource {
  return {
    title: s.title || "",
    description: s.description || "",
    url: s.url || "",
    domain: s.domain || "",
    category: s.category || "غير مصنف",
  };
}
