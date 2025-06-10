"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User, Smartphone, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { InteractiveCampusMap } from "@/components/interactive-campus-map"
import { useReports, useLocationStats } from "@/hooks/use-database"

const getStatusColor = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800"
    case "verified":
      return "bg-purple-100 text-purple-800"
    case "investigating":
      return "bg-yellow-100 text-yellow-800"
    case "resolved":
      return "bg-green-100 text-green-800"
    case "false_report":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "critical":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ReportsPage() {
  const { reports, loading, refetch } = useReports()
  const { locationStats } = useLocationStats()

  const handleRefresh = () => {
    refetch()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/images/logo-netcrowd.png" alt="NetCrowd Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold text-gray-900">NetCrowd</h1>
              </Link>
              <span className="text-gray-400">|</span>
              <h2 className="text-lg font-medium text-gray-700">Public Reports</h2>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Report Issue
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Network Reports</h3>
          <p className="text-gray-600">
            View all reported network issues across campus. Data updates automatically when changes are made.
          </p>
        </div>

        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.issueType}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {report.building} - {report.room}
                        </span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{report.name}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Smartphone className="w-4 h-4" />
                        <span>{report.device}</span>
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.replace("_", " ").charAt(0).toUpperCase() +
                        report.status.replace("_", " ").slice(1)}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(report.severity)}>
                      {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{report.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Reported: {report.timestamp}</span>
                  </span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{report.id}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Campus Network Status</h3>
          <InteractiveCampusMap locationStats={locationStats} isAdmin={false} />
        </div>
      </main>
    </div>
  )
}
