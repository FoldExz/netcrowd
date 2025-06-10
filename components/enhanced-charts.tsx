"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import type { LocationStats } from "@/lib/types"
import { database } from "@/lib/database"

interface EnhancedChartsProps {
  locationStats: LocationStats[]
}

export function EnhancedCharts({ locationStats }: EnhancedChartsProps) {
  // Prepare data for building chart
  const buildingData = locationStats.map((stat) => ({
    building: stat.building,
    active: stat.activeReports,
    resolved: stat.resolvedReports,
    total: stat.totalReports,
  }))

  // Get real data from database
  const issueTypes = database.getIssueTypesDistribution()
  const trendData = database.getWeeklyTrend()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Reports by Building */}
      <Card>
        <CardHeader>
          <CardTitle>Reports by Building</CardTitle>
          <CardDescription>Active vs resolved issues across campus buildings</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="building" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" fill="#ef4444" name="Active Issues" />
              <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Issue Types Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Issue Types Distribution</CardTitle>
          <CardDescription>Breakdown of network problems by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {issueTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Report Trend</CardTitle>
          <CardDescription>Daily reports and resolution rate over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" name="New Reports" strokeWidth={2} />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" name="Resolved" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
