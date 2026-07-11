import { createClient } from "next-sanity";

// ====================================================================
// Sanity Configuration
// ====================================================================
// لو projectId لسه "YOUR_PROJECT_ID"، الـ client مش هيتصل
// وكل الـ functions هترجع null تلقائياً (fallback للـ local data)
// ====================================================================

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const isConfigured = projectId && projectId !== "YOUR_PROJECT_ID" && projectId.length > 0;

export const sanityConfig = {
  projectId: projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};

// نفصل client: لو مش متكون، نستخدم null (fallback للـ local data)
export const sanityClient = isConfigured
  ? createClient(sanityConfig)
  : null;

// ====================================================================
// Data Fetching — مع fallback تلقائي
// ====================================================================

export async function getAllVideos() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(`
      *[_type == "video"] | order(publishedAt desc) {
        _id, title, slug, description,
        "category": category->title,
        publishedAt, youtubeId, thumbnail
      }
    `);
  } catch {
    return null;
  }
}

export async function getVideoBySlug(slug: string) {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "video" && slug.current == $slug][0]`,
      { slug }
    );
  } catch {
    return null;
  }
}

export async function getAllResources() {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch(`
      *[_type == "resource"] | order(title asc) {
        _id, title, description, url, domain,
        "category": category->title
      }
    `);
  } catch {
    return null;
  }
}
