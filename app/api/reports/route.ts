import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const building = searchParams.get("building")
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")

    const filters = {
      building: building || undefined,
      status: status || undefined,
      severity: severity || undefined,
    }

    const reports = database.getAllReports(filters)
    console.log("API GET reports:", reports.length)
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("API POST received data:", body)

    const newReport = database.createReport({
      name: body.name,
      email: body.email || "",
      building: body.building,
      room: body.room,
      issueType: body.issueType,
      device: body.device,
      description: body.description,
      severity: body.severity,
    })

    console.log("API POST created report:", newReport.id)
    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}
