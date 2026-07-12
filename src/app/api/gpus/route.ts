import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const DEFAULT_GPUS = [
  { name: "RX 7900 XTX", vram: "24GB", tier: "الأفضل", notes: "أقوى كارت AMD للمستهلك، ROCm/Vulkan ممتاز للموديلات حتى 33B بكمّم" },
  { name: "RX 6800 XT", vram: "16GB", tier: "جيد جداً", notes: "VRAM كبيرة بسعر ممتاز، خيار قوي للموديلات المتوسطة (7B-14B)" },
  { name: "RTX 3090", vram: "24GB", tier: "الأفضل", notes: "خيار NVIDIA ممتاز للموديلات حتى 70B بكمّم — CUDA support كامل" },
  { name: "RTX 4060 Ti", vram: "16GB", tier: "جيد جداً", notes: "VRAM ممتازة في فئة متوسطة، CUDA كامل" },
  { name: "RX 6600 XT", vram: "8GB", tier: "جيد", notes: "كارت الـ setup بتاعنا — مناسب للموديلات الصغيرة (3B-8B) بـ Q4/Q5 عبر Vulkan" },
  { name: "RTX 3060", vram: "12GB", tier: "جيد", notes: "خيار NVIDIA اقتصادي للمبتدئين مع CUDA كامل" },
];

// GET /api/gpus
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const docs = await db.collection("gpus").find({}).sort({ vram: -1 }).toArray();
    if (docs.length > 0) {
      return NextResponse.json(docs.map((d: any) => { const { _id, ...r } = d; return r; }));
    }
  } catch {}
  return NextResponse.json(DEFAULT_GPUS);
}

// POST /api/gpus
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.vram) {
      return NextResponse.json({ error: "name + vram مطلوبة" }, { status: 400 });
    }
    const { db } = await connectToDatabase();
    const existing = await db.collection("gpus").findOne({ name: body.name });
    if (existing) return NextResponse.json({ error: "موجود" }, { status: 409 });
    await db.collection("gpus").insertOne({ ...body, created_at: new Date() });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/gpus
export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    const { db } = await connectToDatabase();
    await db.collection("gpus").deleteOne({ name });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
