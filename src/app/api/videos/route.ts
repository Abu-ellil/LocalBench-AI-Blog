import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/videos — من MongoDB
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
        docs.map((v: any) => {
          const { _id, ...rest } = v;
          return {
            slug: rest.slug,
            title: rest.title,
            description: rest.description,
            category: rest.category,
            date: rest.date,
            youtubeId: rest.youtubeId,
            thumbnail: rest.thumbnail,
            modelCount: (rest.models || []).length,
            promptCount: (rest.prompts || []).length,
            fileCount: (rest.files || []).length,
          };
        })
      );
    }
  } catch {
    // MongoDB مش متاح
  }

  // Fallback
  const { videos } = await import("@/lib/data");
  return NextResponse.json(
    videos.map((v: any) => ({
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

// POST /api/videos — إضافة فيديو جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    if (!body.slug || !body.title || !body.youtubeId) {
      return NextResponse.json(
        { error: "slug + title + youtubeId مطلوبة" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // تأكد مفيش duplicate
    const existing = await db.collection("videos").findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { error: "slug موجود بالفعل" },
        { status: 409 }
      );
    }

    const video = {
      slug: body.slug,
      title: body.title,
      description: body.description || "",
      category: body.category || "غير مصنف",
      date: body.date || new Date().toLocaleDateString("ar-EG"),
      youtubeId: body.youtubeId,
      thumbnail:
        body.thumbnail ||
        `https://img.youtube.com/vi/${body.youtubeId}/maxresdefault.jpg`,
      models: body.models || [],
      prompts: body.prompts || [],
      files: body.files || [],
      created_at: new Date(),
    };

    const result = await db.collection("videos").insertOne(video);
    return NextResponse.json(
      { id: result.insertedId, success: true, slug: body.slug },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "فشل الإضافة", detail: e.message },
      { status: 500 }
    );
  }
}

// DELETE /api/videos — حذف فيديو (by slug)
export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "slug مطلوب" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("videos").deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, slug });
  } catch (e: any) {
    return NextResponse.json(
      { error: "فشل الحذف", detail: e.message },
      { status: 500 }
    );
  }
}
