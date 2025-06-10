"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/database"
import type { Report, LocationStats } from "@/lib/types"

export function useReports(filters?: { building?: string; status?: string; severity?: string }) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use API for consistency
      const params = new URLSearchParams()
      if (filters?.building && filters.building !== "all") params.append("building", filters.building)
      if (filters?.status && filters.status !== "all") params.append("status", filters.status)
      if (filters?.severity && filters.severity !== "all") params.append("severity", filters.severity)

      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch reports")
      }

      const data = await response.json()
      console.log("Hook fetched reports:", data.length)
      setReports(data)
    } catch (err) {
      console.error("Hook fetch error:", err)
      // Fallback to database if API fails
      try {
        const data = database.getAllReports(filters)
        setReports(data)
        setError(null)
      } catch (dbErr) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()

    // Subscribe to database changes for real-time updates
    const unsubscribe = database.subscribe(() => {
      console.log("Database changed, refetching reports")
      fetchReports()
    })

    return unsubscribe
  }, [filters?.building, filters?.status, filters?.severity])

  return { reports, loading, error, refetch: fetchReports }
}

export function useLocationStats() {
  const [locationStats, setLocationStats] = useState<LocationStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/stats")
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await response.json()
      setLocationStats(data)
    } catch (err) {
      console.error("Stats fetch error:", err)
      // Fallback to database if API fails
      try {
        const data = database.getLocationStats()
        setLocationStats(data)
        setError(null)
      } catch (dbErr) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Subscribe to database changes for real-time updates
    const unsubscribe = database.subscribe(() => {
      console.log("Database changed, refetching stats")
      fetchStats()
    })

    return unsubscribe
  }, [])

  return { locationStats, loading, error, refetch: fetchStats }
}

export function useReportStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    resolved: 0,
    resolvedToday: 0,
    resolutionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateStats = () => {
      const reportStats = database.getReportStats()
      console.log("Updated stats:", reportStats)
      setStats(reportStats)
      setLoading(false)
    }

    updateStats()

    // Subscribe to database changes for real-time updates
    const unsubscribe = database.subscribe(() => {
      console.log("Database changed, updating stats")
      updateStats()
    })

    return unsubscribe
  }, [])

  return { stats, loading }
}
