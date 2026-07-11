import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/benchmarks/[model] — كل نتائج الـ benchmark لموديل معين
export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  try {
    const { model: modelParam } = await params;
    const modelName = decodeURIComponent(modelParam);
    const { db } = await connectToDatabase();

    // Get all benchmarks for this model
    const benchmarks = await db
      .collection("benchmarks")
      .find({ model_name: modelName })
      .sort({ created_at: -1 })
      .toArray();

    if (benchmarks.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على نتائج لهذا النموذج" },
        { status: 404 }
      );
    }

    // Calculate aggregated stats
    const scores = benchmarks.map((b) => b.final_score || 0);
    const speeds = benchmarks.map((b) => b.tokens_per_sec || 0);
    const ttfts = benchmarks.map((b) => b.ttft_ms || 0);
    const vrams = benchmarks.map((b) => b.vram_peak_mb || 0);

    const avg = (arr: number[]) =>
      Math.round((arr.reduce((s, v) => s + v, 0) / arr.length) * 10) / 10;
    const max = (arr: number[]) => Math.max(...arr);
    const min = (arr: number[]) => Math.min(...arr);

    return NextResponse.json({
      model: modelName,
      benchmarkCount: benchmarks.length,
      stats: {
        score: { avg: avg(scores), max: max(scores), min: min(scores) },
        tokensPerSec: { avg: avg(speeds), max: max(speeds), min: min(speeds) },
        ttftMs: { avg: avg(ttfts), max: max(ttfts), min: min(ttfts) },
        vramMb: { avg: avg(vrams), max: max(vrams), min: min(vrams) },
      },
      benchmarks: benchmarks.map((b) => ({
        id: b._id.toString(),
        score: b.final_score || 0,
        tokensPerSec: b.tokens_per_sec || 0,
        ttftMs: b.ttft_ms || 0,
        vramMb: b.vram_peak_mb || 0,
        createdAt: b.created_at,
      })),
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متاحة", detail: e.message },
      { status: 503 }
    );
  }
}
