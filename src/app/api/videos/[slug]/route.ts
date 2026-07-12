import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/videos/[slug] — يجيب فيديو واحد بالكامل من MongoDB
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { db } = await connectToDatabase();
    const video = await db.collection("videos").findOne({ slug });

    if (video) {
      const { _id, ...rest } = video;
      return NextResponse.json(rest);
    }
  } catch {
    // MongoDB مش متاح
  }

  // Fallback
  const { getVideoBySlug } = await import("@/lib/data");
  const localVideo = getVideoBySlug(slug);
  if (!localVideo) {
    return NextResponse.json({ error: "الفيديو غير موجود" }, { status: 404 });
  }
  return NextResponse.json(localVideo);
}

// PUT /api/videos/[slug] — تعديل فيديو موجود
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();

    if (!body.title || !body.youtubeId) {
      return NextResponse.json(
        { error: "title + youtubeId مطلوبة" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // لو الموديل موجود في MongoDB → حدّثه
    const existing = await db.collection("videos").findOne({ slug });
    if (!existing) {
      return NextResponse.json({ error: "الفيديو غير موجود" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.youtubeId !== undefined) {
      updateData.youtubeId = body.youtubeId;
      // حدّث الـ thumbnail كمان لو اتغير الـ ID
      if (!body.thumbnail) {
        updateData.thumbnail = `https://img.youtube.com/vi/${body.youtubeId}/maxresdefault.jpg`;
      }
    }
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.models !== undefined) updateData.models = body.models;
    if (body.prompts !== undefined) updateData.prompts = body.prompts;
    if (body.files !== undefined) updateData.files = body.files;
    updateData.updated_at = new Date();

    await db.collection("videos").updateOne({ slug }, { $set: updateData });

    return NextResponse.json({ success: true, slug, updated: Object.keys(updateData).length - 1 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "فشل التعديل", detail: e.message },
      { status: 500 }
    );
  }
}
