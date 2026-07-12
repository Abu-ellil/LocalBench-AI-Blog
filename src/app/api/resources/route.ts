import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import type { Resource } from "@/lib/types";

// GET /api/resources — يجيب المصادر من MongoDB
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const docs = await db
      .collection("resources")
      .find({})
      .toArray();

    if (docs.length > 0) {
      return NextResponse.json(
        docs.map((r: any) => {
          const { _id, ...rest } = r;
          return rest;
        })
      );
    }
  } catch {
    // MongoDB مش متاح
  }

  // Fallback: local data (مؤقت)
  const { resources } = await import("@/lib/data");
  return NextResponse.json(resources);
}
