import type { Report, LocationStats } from "./types"

// In-memory database simulation with multiple storage options
class Database {
  private static instance: Database
  private reports: Report[] = []
  private listeners: Set<() => void> = new Set()
  private isInitialized = false
  private storageKey = "netcrowd_reports_v2"

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  constructor() {
    if (typeof window !== "undefined") {
      this.loadFromStorage()
      this.initializeDefaultData()
    }
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      // Try to load from localStorage first
      let stored = localStorage.getItem(this.storageKey)

      // If not found, try to load from sessionStorage (for temporary session)
      if (!stored) {
        stored = sessionStorage.getItem(this.storageKey)
      }

      if (stored) {
        try {
          const data = JSON.parse(stored)
          this.reports = data.map((report: any) => ({
            ...report,
            createdAt: new Date(report.createdAt),
            updatedAt: new Date(report.updatedAt),
          }))
          this.isInitialized = true
          console.log("Loaded reports from storage:", this.reports.length)
        } catch (error) {
          console.error("Failed to load reports from storage:", error)
          this.reports = []
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        const dataString = JSON.stringify(this.reports)

        // Save to both localStorage and sessionStorage for redundancy
        localStorage.setItem(this.storageKey, dataString)
        sessionStorage.setItem(this.storageKey, dataString)

        console.log("Data saved to storage:", this.reports.length, "reports")
      } catch (error) {
        console.error("Failed to save to storage:", error)
      }
    }
  }

  // Method to export data for sharing between browsers/devices
  exportData(): string {
    return JSON.stringify(
      {
        reports: this.reports,
        exportedAt: new Date().toISOString(),
        version: "2.0",
      },
      null,
      2,
    )
  }

  // Method to import data from another browser/device
  importData(jsonData: string): { success: boolean; message: string; imported: number } {
    try {
      const data = JSON.parse(jsonData)

      if (!data.reports || !Array.isArray(data.reports)) {
        return { success: false, message: "Invalid data format", imported: 0 }
      }

      const importedReports = data.reports.map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt),
        updatedAt: new Date(report.updatedAt),
      }))

      // Merge with existing data, avoiding duplicates
      const existingIds = new Set(this.reports.map((r) => r.id))
      const newReports = importedReports.filter((r: Report) => !existingIds.has(r.id))

      this.reports = [...this.reports, ...newReports]
      this.saveToStorage()
      this.notifyListeners()

      return {
        success: true,
        message: `Successfully imported ${newReports.length} new reports`,
        imported: newReports.length,
      }
    } catch (error) {
      return {
        success: false,
        message: "Failed to parse data: " + (error instanceof Error ? error.message : "Unknown error"),
        imported: 0,
      }
    }
  }

  // Method to sync data across tabs/windows
  syncAcrossTabs() {
    if (typeof window !== "undefined") {
      // Listen for storage changes from other tabs
      window.addEventListener("storage", (e) => {
        if (e.key === this.storageKey && e.newValue) {
          try {
            const data = JSON.parse(e.newValue)
            this.reports = data.map((report: any) => ({
              ...report,
              createdAt: new Date(report.createdAt),
              updatedAt: new Date(report.updatedAt),
            }))
            this.notifyListeners()
            console.log("Synced data from another tab:", this.reports.length, "reports")
          } catch (error) {
            console.error("Failed to sync data from another tab:", error)
          }
        }
      })
    }
  }

  private notifyListeners() {
    console.log("Notifying listeners, current reports:", this.reports.length)
    this.listeners.forEach((listener) => {
      try {
        listener()
      } catch (error) {
        console.error("Error in listener:", error)
      }
    })
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private formatTimestamp(date: Date): string {
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  private initializeDefaultData() {
    if (this.reports.length === 0 && !this.isInitialized) {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      const defaultReports: Report[] = [
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
          timestamp: this.formatTimestamp(new Date(now.getTime() - 4 * 60 * 60 * 1000)),
          createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
          updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
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
          timestamp: this.formatTimestamp(new Date(now.getTime() - 5 * 60 * 60 * 1000)),
          createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
          updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
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
          timestamp: this.formatTimestamp(new Date(yesterday.getTime() - 6 * 60 * 60 * 1000)),
          createdAt: new Date(yesterday.getTime() - 6 * 60 * 60 * 1000),
          updatedAt: yesterday,
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
          status: "resolved",
          timestamp: this.formatTimestamp(new Date(now.getTime() - 7 * 60 * 60 * 1000)),
          createdAt: new Date(now.getTime() - 7 * 60 * 60 * 1000),
          updatedAt: now,
        },
      ]

      this.reports = defaultReports
      this.saveToStorage()
      this.isInitialized = true
      console.log("Initialized with default data:", this.reports.length, "reports")
    }

    // Enable cross-tab sync
    this.syncAcrossTabs()
  }

  // CRUD Operations (unchanged)
  getAllReports(filters?: {
    building?: string
    status?: string
    severity?: string
  }): Report[] {
    let filteredReports = [...this.reports]

    if (filters?.building && filters.building !== "all") {
      filteredReports = filteredReports.filter((report) => report.building === filters.building)
    }

    if (filters?.status && filters.status !== "all") {
      filteredReports = filteredReports.filter((report) => report.status === filters.status)
    }

    if (filters?.severity && filters.severity !== "all") {
      filteredReports = filteredReports.filter((report) => report.severity === filters.severity)
    }

    return filteredReports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getReportById(id: string): Report | null {
    return this.reports.find((report) => report.id === id) || null
  }

  createReport(reportData: Omit<Report, "id" | "status" | "timestamp" | "createdAt" | "updatedAt">): Report {
    const now = new Date()

    // Generate unique ID
    const existingIds = this.reports.map((r) => r.id)
    let newId = `RPT-${String(this.reports.length + 1).padStart(3, "0")}`
    let counter = this.reports.length + 1

    while (existingIds.includes(newId)) {
      counter++
      newId = `RPT-${String(counter).padStart(3, "0")}`
    }

    const newReport: Report = {
      ...reportData,
      id: newId,
      status: "new",
      timestamp: this.formatTimestamp(now),
      createdAt: now,
      updatedAt: now,
    }

    this.reports.push(newReport)
    console.log("Created new report:", newReport.id, "Total reports:", this.reports.length)
    this.saveToStorage()
    this.notifyListeners()

    return newReport
  }

  updateReport(id: string, updates: Partial<Report>): Report | null {
    const reportIndex = this.reports.findIndex((report) => report.id === id)

    if (reportIndex === -1) {
      console.error("Report not found:", id)
      return null
    }

    const now = new Date()
    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      ...updates,
      updatedAt: now,
    }

    console.log("Updated report:", id, "New status:", updates.status)
    this.saveToStorage()
    this.notifyListeners()

    return this.reports[reportIndex]
  }

  deleteReport(id: string): boolean {
    const reportIndex = this.reports.findIndex((report) => report.id === id)

    if (reportIndex === -1) {
      console.error("Report not found for deletion:", id)
      return false
    }

    this.reports.splice(reportIndex, 1)
    console.log("Deleted report:", id, "Remaining reports:", this.reports.length)
    this.saveToStorage()
    this.notifyListeners()

    return true
  }

  // Analytics methods (unchanged)
  getLocationStats(): LocationStats[] {
    const stats: { [key: string]: LocationStats } = {}

    this.reports.forEach((report) => {
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
      } else if (!["false_report"].includes(report.status)) {
        stats[report.building].activeReports++
      }

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

  getReportStats() {
    const total = this.reports.length
    const resolved = this.reports.filter((r) => r.status === "resolved").length
    const active = this.reports.filter((r) => !["resolved", "false_report"].includes(r.status)).length

    const today = new Date()
    const todayString = today.toDateString()
    const resolvedToday = this.reports.filter(
      (r) => r.status === "resolved" && new Date(r.updatedAt).toDateString() === todayString,
    ).length

    return {
      total,
      active,
      resolved,
      resolvedToday,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
    }
  }

  getWeeklyTrend() {
    const now = new Date()
    const weekData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" })

      const dayReports = this.reports.filter(
        (report) => new Date(report.createdAt).toDateString() === date.toDateString(),
      ).length

      const dayResolved = this.reports.filter(
        (report) => report.status === "resolved" && new Date(report.updatedAt).toDateString() === date.toDateString(),
      ).length

      weekData.push({
        day: dayName,
        reports: dayReports,
        resolved: dayResolved,
      })
    }

    return weekData
  }

  getIssueTypesDistribution() {
    const issueTypes: { [key: string]: number } = {}

    this.reports.forEach((report) => {
      issueTypes[report.issueType] = (issueTypes[report.issueType] || 0) + 1
    })

    const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#f97316"]

    return Object.entries(issueTypes).map(([name, value], index) => ({
      name: name.replace(" Internet", "").replace(" Connection", ""),
      value,
      color: colors[index % colors.length],
    }))
  }

  clearAllData() {
    this.reports = []
    this.saveToStorage()
    this.notifyListeners()
  }

  resetToDefault() {
    this.reports = []
    this.isInitialized = false
    this.initializeDefaultData()
    this.notifyListeners()
  }
}

export const database = Database.getInstance()
