import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// GET /api/benchmarks — كل نتائج الـ benchmark
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get("model");
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const { db } = await connectToDatabase();
    const query = model ? { model_name: model } : {};
    const results = await db
      .collection("benchmarks")
      .find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json(
      { error: "قاعدة البيانات غير متاحة", detail: e.message },
      { status: 503 }
    );
  }
}

// POST /api/benchmarks — إضافة نتيجة benchmark جديدة
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db } = await connectToDatabase();

    const result = {
      ...body,
      created_at: new Date(),
    };

    const insertResult = await db.collection("benchmarks").insertOne(result);

    return NextResponse.json(
      { id: insertResult.insertedId, success: true },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: "فشل في حفظ النتيجة" },
      { status: 500 }
    );
  }
}
