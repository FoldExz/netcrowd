"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, AlertTriangle, CheckCircle, Clock, Search, Filter, RefreshCw, Trash2, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { EnhancedCharts } from "@/components/enhanced-charts"
import { InteractiveCampusMap } from "@/components/interactive-campus-map"
import { DataManagement } from "@/components/data-management"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserMenu } from "@/components/auth/user-menu"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useReports, useLocationStats, useReportStats } from "@/hooks/use-database"

function AdminDashboardContent() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [filters, setFilters] = useState({
    search: "",
    building: "all",
    status: "all",
    severity: "all",
  })
  const { toast } = useToast()

  const authService = AuthService.getInstance()

  // Use custom hooks for real-time data
  const { reports, loading: reportsLoading, refetch: refetchReports } = useReports(filters)
  const { locationStats, loading: statsLoading, refetch: refetchStats } = useLocationStats()
  const { stats } = useReportStats()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Get active tab from URL hash
    const hash = window.location.hash.replace("#", "")
    if (hash && ["overview", "map", "reports", "data"].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    window.history.replaceState(null, "", `#${value}`)
  }

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status updated successfully",
          description: `Report ${reportId} status changed to ${newStatus}`,
        })
      } else {
        throw new Error("Failed to update status")
      }
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const deleteReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Report deleted successfully",
          description: `Report ${reportId} has been permanently deleted.`,
        })
      } else {
        throw new Error("Failed to delete report")
      }
    } catch (error) {
      toast({
        title: "Error deleting report",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    window.location.reload()
  }

  const handleRefresh = () => {
    refetchReports()
    refetchStats()
    toast({
      title: "Data refreshed",
      description: "All data has been updated to the latest version.",
    })
  }

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

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      filters.search === "" ||
      report.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.building.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.room.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase())

    return matchesSearch
  })

  if (reportsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
              <h2 className="text-lg font-medium text-gray-700">Admin Dashboard</h2>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/reports">
                <Button variant="outline" size="sm">
                  Public Reports
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Home
                </Button>
              </Link>
              {user && <UserMenu user={user} onLogout={handleLogout} />}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Welcome back, {user?.username}!</h3>
          <p className="text-gray-600">Manage network reports and monitor campus connectivity status.</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <p className="text-xs text-muted-foreground">Issues fixed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
              <p className="text-xs text-muted-foreground">Overall success rate</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Campus Map</TabsTrigger>
            <TabsTrigger value="reports">Manage Reports</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <EnhancedCharts locationStats={locationStats} />

            {/* Priority Buildings */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Buildings</CardTitle>
                <CardDescription>Buildings with the highest number of active issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationStats
                    .sort((a, b) => b.activeReports - a.activeReports)
                    .slice(0, 5)
                    .map((location, index) => (
                      <div
                        key={location.building}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0 ? "bg-red-500" : index === 1 ? "bg-orange-500" : "bg-yellow-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{location.building}</p>
                            <p className="text-sm text-gray-600">
                              {location.activeReports} active of {location.totalReports} total reports
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            location.activeReports > 5
                              ? "destructive"
                              : location.activeReports > 2
                                ? "default"
                                : "secondary"
                          }
                        >
                          {location.activeReports > 5 ? "Critical" : location.activeReports > 2 ? "High" : "Medium"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <InteractiveCampusMap locationStats={locationStats} isAdmin={true} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-10"
                      value={filters.search}
                      onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  <Select
                    value={filters.building}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, building: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Building" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buildings</SelectItem>
                      <SelectItem value="D4">D4</SelectItem>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="TC">TC</SelectItem>
                      <SelectItem value="SAW">SAW</SelectItem>
                      <SelectItem value="Pascasarjana">Pascasarjana</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="false_report">False Report</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.severity}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ search: "", building: "all", status: "all", severity: "all" })}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports Table */}
            <Card>
              <CardHeader>
                <CardTitle>Reports Management</CardTitle>
                <CardDescription>
                  Showing {filteredReports.length} of {reports.length} reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reported</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-mono text-sm">{report.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.name}</div>
                              {report.email && <div className="text-sm text-gray-500">{report.email}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.building}</div>
                              <div className="text-sm text-gray-500">{report.room}</div>
                            </div>
                          </TableCell>
                          <TableCell>{report.issueType}</TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(report.severity)}>
                              {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.replace("_", " ").charAt(0).toUpperCase() +
                                report.status.replace("_", " ").slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{report.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Select onValueChange={(value) => updateReportStatus(report.id, value)}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="verified">Verified</SelectItem>
                                  <SelectItem value="investigating">Investigating</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="false_report">False Report</SelectItem>
                                </SelectContent>
                              </Select>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center space-x-2">
                                      <AlertCircle className="w-5 h-5 text-red-600" />
                                      <span>Delete Report</span>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete report {report.id}? This action cannot be undone
                                      and will permanently remove the report from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteReport(report.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete Report
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <DataManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
