import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/videos/[slug] — يجيب فيديو واحد من MongoDB بالكامل (prompts, files, models)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { db } = await connectToDatabase();
    const video = await db.collection("videos").findOne({ slug });

    if (video) {
      // نشيل _id لأنه مش serializable
      const { _id, ...rest } = video;
      return NextResponse.json(rest);
    }
  } catch {
    // MongoDB مش متاح
  }

  // Fallback: local data (مؤقت)
  const { getVideoBySlug } = await import("@/lib/data");
  const localVideo = getVideoBySlug(slug);
  if (!localVideo) {
    return NextResponse.json({ error: "الفيديو غير موجود" }, { status: 404 });
  }
  return NextResponse.json(localVideo);
}
