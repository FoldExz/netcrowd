import { NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET() {
  try {
    const locationStats = database.getLocationStats()
    return NextResponse.json(locationStats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
