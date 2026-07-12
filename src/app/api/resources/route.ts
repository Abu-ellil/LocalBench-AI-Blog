import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/resources
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const docs = await db.collection("resources").find({}).toArray();

    if (docs.length > 0) {
      return NextResponse.json(
        docs.map((r: any) => {
          const { _id, ...rest } = r;
          return rest;
        })
      );
    }
  } catch {
    // fallback
  }

  const { resources } = await import("@/lib/data");
  return NextResponse.json(resources);
}

// POST /api/resources — إضافة مصدر جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.url) {
      return NextResponse.json(
        { error: "title + url مطلوبة" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const existing = await db.collection("resources").findOne({ url: body.url });
    if (existing) {
      return NextResponse.json({ error: "URL موجود" }, { status: 409 });
    }

    const resource = {
      title: body.title,
      description: body.description || "",
      url: body.url,
      domain: body.domain || (() => { try { return new URL(body.url).hostname } catch { return "" } })(),
      category: body.category || "غير مصنف",
      created_at: new Date(),
    };

    const result = await db.collection("resources").insertOne(resource);
    return NextResponse.json(
      { id: result.insertedId, success: true },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: "فشل الإضافة", detail: e.message },
      { status: 500 }
    );
  }
}

// DELETE /api/resources
export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "url مطلوب" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("resources").deleteOne({ url });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "فشل الحذف", detail: e.message },
      { status: 500 }
    );
  }
}
