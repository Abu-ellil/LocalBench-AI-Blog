import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/leaderboard — ترتيب النماذج حسب الدرجة النهائية
export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const pipeline = [
      {
        $group: {
          _id: "$model_name",
          totalScore: { $avg: "$final_score" },
          benchmarkCount: { $sum: 1 },
          avgTtft: { $avg: "$ttft_ms" },
          avgTokensPerSec: { $avg: "$tokens_per_sec" },
          avgVramPeak: { $avg: "$vram_peak_mb" },
          lastUpdated: { $max: "$created_at" },
        },
      },
      { $sort: { totalScore: -1 } },
    ];

    // Try "scores" collection first, fallback to "benchmarks"
    let leaderboard = await db
      .collection("scores")
      .aggregate(pipeline)
      .toArray();

    if (leaderboard.length === 0) {
      leaderboard = await db
        .collection("benchmarks")
        .aggregate(pipeline)
        .toArray();
    }

    return NextResponse.json(
      leaderboard.map((entry, i) => ({
        rank: i + 1,
        model: entry._id,
        score: Math.round(entry.totalScore * 10) / 10,
        benchmarks: entry.benchmarkCount,
        avgTtftMs: Math.round(entry.avgTtft),
        avgTokensPerSec: Math.round(entry.avgTokensPerSec * 10) / 10,
        avgVramMb: Math.round(entry.avgVramPeak),
      }))
    );
  } catch (e) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متاحة" },
      { status: 503 }
    );
  }
}
