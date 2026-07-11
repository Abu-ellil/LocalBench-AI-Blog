import { NextResponse } from "next/server";
import { videos } from "@/lib/data";
import { getAllVideos, mapSanityVideoToType } from "@/lib/sanity";

// GET /api/videos
// بيجرّب Sanity الأول، لو مفيش اتصال بيستخدم الـ local data
export async function GET() {
  try {
    const sanityVideos = await getAllVideos();
    if (sanityVideos && sanityVideos.length > 0) {
      const mapped = sanityVideos.map(mapSanityVideoToType);
      return NextResponse.json(
        mapped.map((v) => ({
          slug: v.slug,
          title: v.title,
          description: v.description,
          category: v.category,
          date: v.date,
          youtubeId: v.youtubeId,
          thumbnail: v.thumbnail,
          modelCount: v.models.length,
          promptCount: v.prompts.length,
          fileCount: v.files.length,
        }))
      );
    }
  } catch {
    // Sanity مش متاح — fallback للـ local data
  }

  return NextResponse.json(
    videos.map((v) => ({
      slug: v.slug,
      title: v.title,
      description: v.description,
      category: v.category,
      date: v.date,
      youtubeId: v.youtubeId,
      thumbnail: v.thumbnail,
      modelCount: v.models.length,
      promptCount: v.prompts.length,
      fileCount: v.files.length,
    }))
  );
}
