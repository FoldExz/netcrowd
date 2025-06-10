export interface Report {
  id: string
  name: string
  email?: string
  building: string
  room: string
  issueType: string
  device: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  status: "new" | "verified" | "investigating" | "resolved" | "false_report"
  timestamp: string
  createdAt: Date
  updatedAt: Date
}

export interface BuildingRooms {
  [key: string]: string[]
}

export interface LocationStats {
  building: string
  totalReports: number
  resolvedReports: number
  activeReports: number
  rooms: {
    room: string
    reports: number
    resolved: number
  }[]
}
