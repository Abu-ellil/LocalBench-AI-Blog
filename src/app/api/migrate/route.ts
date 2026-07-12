import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { videos, resources } from "@/lib/data";

// POST /api/migrate — ينقل البيانات من data.ts لـ MongoDB (تشغيل مرة واحدة)
export async function POST() {
  try {
    const { db } = await connectToDatabase();

    const results = { videos: 0, resources: 0, skipped: 0 };

    // Migrate videos
    for (const v of videos) {
      const existing = await db.collection("videos").findOne({ slug: v.slug });
      if (existing) {
        results.skipped++;
        continue;
      }
      await db.collection("videos").insertOne({ ...v, created_at: new Date() });
      results.videos++;
    }

    // Migrate resources
    for (const r of resources) {
      const existing = await db.collection("resources").findOne({ url: r.url });
      if (existing) {
        results.skipped++;
        continue;
      }
      await db.collection("resources").insertOne({ ...r, created_at: new Date() });
      results.resources++;
    }

    const counts = {
      videos: await db.collection("videos").countDocuments(),
      resources: await db.collection("resources").countDocuments(),
      benchmarks: await db.collection("benchmarks").countDocuments(),
    };

    return NextResponse.json({ success: true, migrated: results, total: counts });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Migration failed", detail: e.message },
      { status: 500 }
    );
  }
}
