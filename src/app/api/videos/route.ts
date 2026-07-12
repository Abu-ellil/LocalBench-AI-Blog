import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { Video } from "@/lib/types";

// GET /api/videos — يجيب الفيديوهات من MongoDB
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection("videos")
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    if (docs.length > 0) {
      return NextResponse.json(
        docs.map((v: any) => ({
          slug: v.slug,
          title: v.title,
          description: v.description,
          category: v.category,
          date: v.date,
          youtubeId: v.youtubeId,
          thumbnail: v.thumbnail,
          modelCount: (v.models || []).length,
          promptCount: (v.prompts || []).length,
          fileCount: (v.files || []).length,
        }))
      );
    }
  } catch {
    // MongoDB مش متاح
  }

  // Fallback: local data (مؤقت)
  const { videos } = await import("@/lib/data");
  return NextResponse.json(
    videos.map((v: Video) => ({
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
