"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LocationStats } from "@/lib/types"

interface CampusMapProps {
  locationStats: LocationStats[]
}

export function CampusMap({ locationStats }: CampusMapProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  const getBuildingColor = (activeReports: number) => {
    if (activeReports >= 5) return "#ef4444" // red-500
    if (activeReports >= 3) return "#f97316" // orange-500
    if (activeReports >= 1) return "#eab308" // yellow-500
    return "#22c55e" // green-500
  }

  const getBuildingStatus = (activeReports: number) => {
    if (activeReports >= 5) return "Critical"
    if (activeReports >= 3) return "High"
    if (activeReports >= 1) return "Medium"
    return "Good"
  }

  const selectedBuildingData = selectedBuilding
    ? locationStats.find((stat) => stat.building === selectedBuilding)
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Campus Map Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Network Status Map</CardTitle>
          <CardDescription>Interactive campus map showing network issue density by building</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gray-100 rounded-lg p-6 min-h-[400px]">
            {/* Campus Layout */}
            <svg viewBox="0 0 400 300" className="w-full h-full">
              {/* Building D4 */}
              <rect
                x="50"
                y="50"
                width="60"
                height="40"
                fill={getBuildingColor(locationStats.find((s) => s.building === "D4")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("D4")}
              />
              <text x="80" y="75" textAnchor="middle" className="text-sm font-medium fill-white">
                D4
              </text>

              {/* Building D3 */}
              <rect
                x="130"
                y="50"
                width="60"
                height="40"
                fill={getBuildingColor(locationStats.find((s) => s.building === "D3")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("D3")}
              />
              <text x="160" y="75" textAnchor="middle" className="text-sm font-medium fill-white">
                D3
              </text>

              {/* Building TC */}
              <rect
                x="210"
                y="50"
                width="60"
                height="40"
                fill={getBuildingColor(locationStats.find((s) => s.building === "TC")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("TC")}
              />
              <text x="240" y="75" textAnchor="middle" className="text-sm font-medium fill-white">
                TC
              </text>

              {/* Building SAW */}
              <rect
                x="90"
                y="120"
                width="80"
                height="60"
                fill={getBuildingColor(locationStats.find((s) => s.building === "SAW")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("SAW")}
              />
              <text x="130" y="155" textAnchor="middle" className="text-sm font-medium fill-white">
                SAW
              </text>

              {/* Building Pascasarjana */}
              <rect
                x="190"
                y="120"
                width="70"
                height="50"
                fill={getBuildingColor(locationStats.find((s) => s.building === "Pascasarjana")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("Pascasarjana")}
              />
              <text x="225" y="150" textAnchor="middle" className="text-xs font-medium fill-white">
                Pascasarjana
              </text>

              {/* Other Areas */}
              <circle
                cx="320"
                cy="150"
                r="25"
                fill={getBuildingColor(locationStats.find((s) => s.building === "Other")?.activeReports || 0)}
                stroke="#374151"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedBuilding("Other")}
              />
              <text x="320" y="155" textAnchor="middle" className="text-xs font-medium fill-white">
                Other
              </text>
            </svg>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-xs">Good (0 issues)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-xs">Medium (1-2 issues)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-xs">High (3-4 issues)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs">Critical (5+ issues)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Details */}
      <Card>
        <CardHeader>
          <CardTitle>Building Details</CardTitle>
          <CardDescription>
            {selectedBuilding ? `Detailed information for ${selectedBuilding}` : "Click on a building to view details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedBuildingData ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{selectedBuildingData.building}</h3>
                <Badge
                  variant={
                    selectedBuildingData.activeReports >= 5
                      ? "destructive"
                      : selectedBuildingData.activeReports >= 3
                        ? "default"
                        : selectedBuildingData.activeReports >= 1
                          ? "secondary"
                          : "outline"
                  }
                >
                  {getBuildingStatus(selectedBuildingData.activeReports)}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedBuildingData.totalReports}</div>
                  <div className="text-sm text-gray-600">Total Reports</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{selectedBuildingData.activeReports}</div>
                  <div className="text-sm text-gray-600">Active Issues</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedBuildingData.resolvedReports}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Room-wise Issues</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedBuildingData.rooms
                    .sort((a, b) => b.reports - b.resolved - (a.reports - a.resolved))
                    .map((room) => (
                      <div key={room.room} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{room.room}</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {room.reports - room.resolved} active
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {room.reports} total
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>Click on a building in the map to view detailed information</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
