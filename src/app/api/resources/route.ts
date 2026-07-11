import { NextResponse } from "next/server";
import { resources } from "@/lib/data";
import { getAllResources } from "@/lib/sanity";

// GET /api/resources
export async function GET() {
  try {
    const sanityResources = await getAllResources();
    if (sanityResources && sanityResources.length > 0) {
      return NextResponse.json(sanityResources);
    }
  } catch (e) {
    // fallback
  }

  return NextResponse.json(resources);
}
