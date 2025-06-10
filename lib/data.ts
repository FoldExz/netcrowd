import type { Report, BuildingRooms, LocationStats } from "./types"

export const buildingRooms: BuildingRooms = {
  D4: [
    "D4-101",
    "D4-102",
    "D4-103",
    "D4-201",
    "D4-202",
    "D4-203",
    "D4-301",
    "D4-302",
    "Lab D4-A",
    "Lab D4-B",
    "Area Umum D4",
  ],
  D3: [
    "HI-101",
    "HI-102",
    "HI-103",
    "HI-104",
    "HI-201",
    "HI-202",
    "HI-203",
    "HI-204",
    "HI-301",
    "HI-302",
    "Area Umum D3",
  ],
  TC: [
    "TC-101",
    "TC-102",
    "TC-103",
    "TC-201",
    "TC-202",
    "TC-203",
    "Auditorium TC",
    "Lab TC-A",
    "Lab TC-B",
    "Area Umum TC",
  ],
  SAW: ["SAW-101", "SAW-102", "SAW-103", "SAW-201", "SAW-202", "Cafeteria", "Library", "Area Umum SAW"],
  Pascasarjana: ["PG-101", "PG-102", "PG-103", "PG-201", "PG-202", "Lab PG-A", "Area Umum Pascasarjana"],
  Other: ["Parking Area", "Garden Area", "Sports Field", "Other Location"],
}

// Mock data for demonstration
export const mockReports: Report[] = [
  {
    id: "RPT-001",
    name: "Ahmad Rizki",
    email: "ahmad.rizki@student.ac.id",
    building: "SAW",
    room: "Cafeteria",
    issueType: "Slow Internet Speed",
    device: "Laptop",
    description:
      "Internet speed is very slow, cannot load YouTube videos or download files. Speed test shows only 1 Mbps.",
    severity: "medium",
    status: "investigating",
    timestamp: "2024-01-15 14:30",
    createdAt: new Date("2024-01-15T14:30:00"),
    updatedAt: new Date("2024-01-15T15:00:00"),
  },
  {
    id: "RPT-002",
    name: "Sarah Putri",
    email: "sarah.putri@student.ac.id",
    building: "SAW",
    room: "Library",
    issueType: "No Internet Connection",
    device: "Smartphone",
    description: "Cannot connect to campus WiFi. Shows connected but no internet access.",
    severity: "high",
    status: "new",
    timestamp: "2024-01-15 13:45",
    createdAt: new Date("2024-01-15T13:45:00"),
    updatedAt: new Date("2024-01-15T13:45:00"),
  },
  {
    id: "RPT-003",
    name: "Budi Santoso",
    email: "budi.santoso@student.ac.id",
    building: "D3",
    room: "HI-101",
    issueType: "Intermittent Connection",
    device: "Laptop",
    description: "Connection keeps dropping every few minutes. Very disruptive during online classes.",
    severity: "high",
    status: "resolved",
    timestamp: "2024-01-15 12:20",
    createdAt: new Date("2024-01-15T12:20:00"),
    updatedAt: new Date("2024-01-15T16:30:00"),
  },
  {
    id: "RPT-004",
    name: "Maya Sari",
    email: "maya.sari@student.ac.id",
    building: "D4",
    room: "Lab D4-A",
    issueType: "High Latency/Ping",
    device: "Desktop Computer",
    description: "High ping when accessing online resources. Gaming and video calls are affected.",
    severity: "medium",
    status: "verified",
    timestamp: "2024-01-15 11:15",
    createdAt: new Date("2024-01-15T11:15:00"),
    updatedAt: new Date("2024-01-15T14:00:00"),
  },
  {
    id: "RPT-005",
    name: "Lisa Chen",
    email: "lisa.chen@student.ac.id",
    building: "TC",
    room: "TC-201",
    issueType: "Slow Internet Speed",
    device: "Laptop",
    description: "Very slow download speeds during peak hours. Cannot attend online meetings properly.",
    severity: "medium",
    status: "investigating",
    timestamp: "2024-01-15 15:45",
    createdAt: new Date("2024-01-15T15:45:00"),
    updatedAt: new Date("2024-01-15T16:00:00"),
  },
  {
    id: "RPT-006",
    name: "David Kim",
    email: "david.kim@student.ac.id",
    building: "D3",
    room: "HI-102",
    issueType: "WiFi Not Working",
    device: "Smartphone",
    description: "WiFi network not visible on device. Other networks are visible but campus WiFi is missing.",
    severity: "high",
    status: "new",
    timestamp: "2024-01-15 15:30",
    createdAt: new Date("2024-01-15T15:30:00"),
    updatedAt: new Date("2024-01-15T15:30:00"),
  },
  {
    id: "RPT-007",
    name: "Anna Rodriguez",
    email: "anna.rodriguez@student.ac.id",
    building: "SAW",
    room: "Cafeteria",
    issueType: "Slow Internet Speed",
    device: "Tablet",
    description: "Extremely slow internet during lunch hours. Cannot browse or use social media.",
    severity: "medium",
    status: "investigating",
    timestamp: "2024-01-15 15:15",
    createdAt: new Date("2024-01-15T15:15:00"),
    updatedAt: new Date("2024-01-15T15:45:00"),
  },
  {
    id: "RPT-008",
    name: "Michael Johnson",
    email: "michael.johnson@student.ac.id",
    building: "D4",
    room: "D4-201",
    issueType: "No Internet Connection",
    device: "Laptop",
    description: "Complete internet outage in the classroom. Cannot access any online resources.",
    severity: "critical",
    status: "verified",
    timestamp: "2024-01-15 10:30",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T11:00:00"),
  },
]

export function getLocationStats(): LocationStats[] {
  const stats: { [key: string]: LocationStats } = {}

  mockReports.forEach((report) => {
    if (!stats[report.building]) {
      stats[report.building] = {
        building: report.building,
        totalReports: 0,
        resolvedReports: 0,
        activeReports: 0,
        rooms: [],
      }
    }

    stats[report.building].totalReports++
    if (report.status === "resolved") {
      stats[report.building].resolvedReports++
    } else {
      stats[report.building].activeReports++
    }

    // Update room stats
    const existingRoom = stats[report.building].rooms.find((r) => r.room === report.room)
    if (existingRoom) {
      existingRoom.reports++
      if (report.status === "resolved") {
        existingRoom.resolved++
      }
    } else {
      stats[report.building].rooms.push({
        room: report.room,
        reports: 1,
        resolved: report.status === "resolved" ? 1 : 0,
      })
    }
  })

  return Object.values(stats).sort((a, b) => b.activeReports - a.activeReports)
}
