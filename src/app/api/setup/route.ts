import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const DEFAULT_SETUP = {
  specs: [
    { label: "المعالج", value: "Intel Core i5-12400", sub: "12th Gen · 6 أنوية / 12 مسار", icon: "cpu" },
    { label: "الذاكرة", value: "24GB DDR4", sub: "لتشغيل النماذج والتطبيقات", icon: "ram" },
    { label: "كارت الشاشة", value: "AMD Radeon RX 6600 XT", sub: "8GB VRAM · RDNA 2", icon: "gpu" },
  ],
  software: ["llama.cpp (Vulkan)", "Ollama", "LM Studio", "KoboldCpp"],
  note: "كارت RX 6600 XT بـ 8GB VRAM من AMD — ده معناه إن GPU offload بيشتغل عبر Vulkan أو ROCm (مش CUDA زي NVIDIA). النماذج اللي بتشتغل كويس: 3B–8B بـ Q4_K_M / Q5_K_M. للنماذج الأكبر (13B+) هتحتاج CPU offload جزئي.",
};

// GET /api/setup
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("setup").findOne({ key: "main" });
    if (doc) {
      const { _id, ...rest } = doc;
      return NextResponse.json(rest);
    }
  } catch {}
  return NextResponse.json(DEFAULT_SETUP);
}

// PUT /api/setup
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();
    await db.collection("setup").updateOne(
      { key: "main" },
      { $set: { key: "main", ...body, updated_at: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
