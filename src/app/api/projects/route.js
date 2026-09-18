import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { fallbackProjects } from "@/data/fallbackProjects";

export async function GET() {
  try {
    const db = await getDb();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1 })
      .toArray();

    if (projects && projects.length > 0) {
      return NextResponse.json(projects);
    }
    return NextResponse.json(fallbackProjects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(fallbackProjects);
  }
}