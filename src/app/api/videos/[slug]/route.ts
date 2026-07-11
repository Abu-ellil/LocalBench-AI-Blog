import { NextResponse } from "next/server";
import { getVideoBySlug as getLocal } from "@/lib/data";
import { getVideoBySlug as getSanity, mapSanityVideoToType } from "@/lib/sanity";

// GET /api/videos/[slug]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const video = await getSanity(slug);
    if (video) {
      return NextResponse.json(mapSanityVideoToType(video));
    }
  } catch {
    // fallback
  }

  const localVideo = getLocal(slug);
  if (!localVideo) {
    return NextResponse.json({ error: "الفيديو غير موجود" }, { status: 404 });
  }
  return NextResponse.json(localVideo);
}
