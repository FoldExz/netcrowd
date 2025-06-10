import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const report = database.getReportById(params.id)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    console.log("API PATCH received:", params.id, body)

    const updatedReport = database.updateReport(params.id, body)

    if (!updatedReport) {
      console.error("Report not found for update:", params.id)
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    console.log("API PATCH success:", updatedReport.id)
    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("API DELETE received:", params.id)

    const success = database.deleteReport(params.id)

    if (!success) {
      console.error("Report not found for deletion:", params.id)
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    console.log("API DELETE success:", params.id)
    return NextResponse.json({ message: "Report deleted successfully" })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json({ error: "Failed to delete report" }, { status: 500 })
  }
}
