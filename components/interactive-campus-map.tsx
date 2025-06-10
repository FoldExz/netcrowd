"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Plus, Edit, Trash2, MapPin } from "lucide-react"
import type { LocationStats } from "@/lib/types"
import type { CampusConfig, BuildingArea, RoomArea } from "@/lib/campus-config"
import { defaultCampusConfig } from "@/lib/campus-config"
import { useToast } from "@/hooks/use-toast"

interface InteractiveCampusMapProps {
  locationStats: LocationStats[]
  isAdmin?: boolean
}

export function InteractiveCampusMap({ locationStats, isAdmin = false }: InteractiveCampusMapProps) {
  const [campusConfig, setCampusConfig] = useState<CampusConfig>(defaultCampusConfig)
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isConfigMode, setIsConfigMode] = useState(false)
  const [showBuildingDialog, setShowBuildingDialog] = useState(false)
  const [showRoomDialog, setShowRoomDialog] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<BuildingArea | null>(null)
  const [editingRoom, setEditingRoom] = useState<RoomArea | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const getBuildingColor = (buildingId: string, activeReports: number) => {
    if (!isConfigMode) {
      if (activeReports >= 5) return "#ef4444" // red-500
      if (activeReports >= 3) return "#f97316" // orange-500
      if (activeReports >= 1) return "#eab308" // yellow-500
      return "#22c55e" // green-500
    }
    const building = campusConfig.buildings.find((b) => b.id === buildingId)
    return building?.color || "#6b7280"
  }

  const getBuildingStatus = (activeReports: number) => {
    if (activeReports >= 5) return "Critical"
    if (activeReports >= 3) return "High"
    if (activeReports >= 1) return "Medium"
    return "Good"
  }

  const getCoordinatesFromEvent = (event: React.MouseEvent) => {
    if (!mapRef.current) return { x: 0, y: 0 }
    const rect = mapRef.current.getBoundingClientRect()
    const scaleX = campusConfig.imageWidth / rect.width
    const scaleY = campusConfig.imageHeight / rect.height
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    }
  }

  const handleMapClick = (event: React.MouseEvent) => {
    if (!isConfigMode) return

    const coords = getCoordinatesFromEvent(event)

    if (isDrawing && drawStart) {
      // Finish drawing
      const width = Math.abs(coords.x - drawStart.x)
      const height = Math.abs(coords.y - drawStart.y)
      const x = Math.min(coords.x, drawStart.x)
      const y = Math.min(coords.y, drawStart.y)

      if (width > 10 && height > 10) {
        // Minimum size check
        setEditingBuilding({
          id: "",
          name: "",
          coordinates: { x, y, width, height },
          rooms: [],
          color: "#3b82f6",
        })
        setShowBuildingDialog(true)
      }

      setIsDrawing(false)
      setDrawStart(null)
    } else {
      // Start drawing
      setIsDrawing(true)
      setDrawStart(coords)
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return
    // This would update a preview rectangle while drawing
  }

  const saveBuildingConfig = (buildingData: Partial<BuildingArea>) => {
    if (!editingBuilding) return

    const newBuilding: BuildingArea = {
      ...editingBuilding,
      ...buildingData,
      id: buildingData.id || `building-${Date.now()}`,
    }

    setCampusConfig((prev) => ({
      ...prev,
      buildings: editingBuilding.id
        ? prev.buildings.map((b) => (b.id === editingBuilding.id ? newBuilding : b))
        : [...prev.buildings, newBuilding],
    }))

    setShowBuildingDialog(false)
    setEditingBuilding(null)
    toast({
      title: "Building saved",
      description: `Building ${newBuilding.name} has been saved successfully.`,
    })
  }

  const saveRoomConfig = (roomData: Partial<RoomArea>) => {
    if (!editingRoom || !selectedBuilding) return

    const newRoom: RoomArea = {
      ...editingRoom,
      ...roomData,
      id: roomData.id || `room-${Date.now()}`,
      buildingId: selectedBuilding,
    }

    setCampusConfig((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building) =>
        building.id === selectedBuilding
          ? {
              ...building,
              rooms: editingRoom.id
                ? building.rooms.map((r) => (r.id === editingRoom.id ? newRoom : r))
                : [...building.rooms, newRoom],
            }
          : building,
      ),
    }))

    setShowRoomDialog(false)
    setEditingRoom(null)
    toast({
      title: "Room saved",
      description: `Room ${newRoom.name} has been saved successfully.`,
    })
  }

  const deleteBuilding = (buildingId: string) => {
    setCampusConfig((prev) => ({
      ...prev,
      buildings: prev.buildings.filter((b) => b.id !== buildingId),
    }))
    toast({
      title: "Building deleted",
      description: "Building has been removed from the campus map.",
    })
  }

  const deleteRoom = (roomId: string) => {
    setCampusConfig((prev) => ({
      ...prev,
      buildings: prev.buildings.map((building) => ({
        ...building,
        rooms: building.rooms.filter((r) => r.id !== roomId),
      })),
    }))
    toast({
      title: "Room deleted",
      description: "Room has been removed from the building.",
    })
  }

  const selectedBuildingData = selectedBuilding
    ? locationStats.find((stat) => stat.building.toLowerCase() === selectedBuilding.toLowerCase())
    : null

  const selectedBuildingConfig = selectedBuilding ? campusConfig.buildings.find((b) => b.id === selectedBuilding) : null

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Campus Map Configuration</CardTitle>
                <CardDescription>Configure building and room locations on the campus map</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={isConfigMode ? "default" : "outline"}
                  onClick={() => setIsConfigMode(!isConfigMode)}
                  className="flex items-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>{isConfigMode ? "Exit Config" : "Configure Map"}</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          {isConfigMode && (
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Configuration Mode:</strong> Click and drag on the map to define building boundaries. Click on
                  existing buildings to edit or add rooms.
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Campus Map */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Campus Map</CardTitle>
            <CardDescription>
              {isConfigMode
                ? "Click and drag to define building areas"
                : "Click on buildings to view network status and details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              ref={mapRef}
              className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
              style={{ aspectRatio: `${campusConfig.imageWidth}/${campusConfig.imageHeight}` }}
              onClick={isConfigMode ? handleMapClick : undefined}
              onMouseMove={isConfigMode ? handleMouseMove : undefined}
            >
              {/* Campus aerial image */}
              <img
                src="/images/campus-aerial.png"
                alt="Campus Aerial View"
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Building overlays */}
              {campusConfig.buildings.map((building) => {
                const stats = locationStats.find((s) => s.building.toLowerCase() === building.name.toLowerCase())
                const activeReports = stats?.activeReports || 0

                return (
                  <div key={building.id}>
                    {/* Building area */}
                    <div
                      className={`absolute border-2 ${
                        isConfigMode
                          ? "border-blue-500 bg-blue-200 bg-opacity-30"
                          : "border-white bg-black bg-opacity-20 hover:bg-opacity-40 cursor-pointer"
                      } transition-all duration-200`}
                      style={{
                        left: `${(building.coordinates.x / campusConfig.imageWidth) * 100}%`,
                        top: `${(building.coordinates.y / campusConfig.imageHeight) * 100}%`,
                        width: `${(building.coordinates.width / campusConfig.imageWidth) * 100}%`,
                        height: `${(building.coordinates.height / campusConfig.imageHeight) * 100}%`,
                        backgroundColor: isConfigMode
                          ? `${building.color}40`
                          : `${getBuildingColor(building.id, activeReports)}40`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isConfigMode) {
                          setEditingBuilding(building)
                          setShowBuildingDialog(true)
                        } else {
                          setSelectedBuilding(building.id)
                          setSelectedRoom(null)
                        }
                      }}
                    >
                      {/* Building label */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium text-gray-800">
                          {building.name}
                          {!isConfigMode && stats && <div className="text-xs text-red-600">{activeReports} issues</div>}
                        </div>
                      </div>

                      {/* Room overlays */}
                      {!isConfigMode &&
                        building.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="absolute border border-gray-400 bg-white bg-opacity-60 hover:bg-opacity-80 cursor-pointer"
                            style={{
                              left: `${((room.coordinates.x - building.coordinates.x) / building.coordinates.width) * 100}%`,
                              top: `${((room.coordinates.y - building.coordinates.y) / building.coordinates.height) * 100}%`,
                              width: `${(room.coordinates.width / building.coordinates.width) * 100}%`,
                              height: `${(room.coordinates.height / building.coordinates.height) * 100}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedRoom(room.id)
                              setSelectedBuilding(building.id)
                            }}
                            title={room.name}
                          >
                            <div className="text-xs p-1 truncate">{room.name}</div>
                          </div>
                        ))}

                      {/* Config mode room overlays */}
                      {isConfigMode &&
                        building.rooms.map((room) => (
                          <div
                            key={room.id}
                            className="absolute border border-green-500 bg-green-200 bg-opacity-50 cursor-pointer"
                            style={{
                              left: `${((room.coordinates.x - building.coordinates.x) / building.coordinates.width) * 100}%`,
                              top: `${((room.coordinates.y - building.coordinates.y) / building.coordinates.height) * 100}%`,
                              width: `${(room.coordinates.width / building.coordinates.width) * 100}%`,
                              height: `${(room.coordinates.height / building.coordinates.height) * 100}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingRoom(room)
                              setSelectedBuilding(building.id)
                              setShowRoomDialog(true)
                            }}
                          >
                            <div className="text-xs p-1 truncate">{room.name}</div>
                          </div>
                        ))}

                      {/* Add room button in config mode */}
                      {isConfigMode && selectedBuilding === building.id && (
                        <Button
                          size="sm"
                          className="absolute bottom-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingRoom({
                              id: "",
                              name: "",
                              buildingId: building.id,
                              coordinates: {
                                x: building.coordinates.x + 10,
                                y: building.coordinates.y + 10,
                                width: 30,
                                height: 20,
                              },
                            })
                            setShowRoomDialog(true)
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    {/* Config mode controls */}
                    {isConfigMode && (
                      <div
                        className="absolute flex space-x-1"
                        style={{
                          left: `${(building.coordinates.x / campusConfig.imageWidth) * 100}%`,
                          top: `${((building.coordinates.y - 30) / campusConfig.imageHeight) * 100}%`,
                        }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingBuilding(building)
                            setShowBuildingDialog(true)
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteBuilding(building.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Drawing preview */}
              {isDrawing && drawStart && (
                <div
                  className="absolute border-2 border-dashed border-blue-500 bg-blue-200 bg-opacity-30 pointer-events-none"
                  style={{
                    left: `${(drawStart.x / campusConfig.imageWidth) * 100}%`,
                    top: `${(drawStart.y / campusConfig.imageHeight) * 100}%`,
                    width: "100px",
                    height: "60px",
                  }}
                />
              )}
            </div>

            {/* Legend */}
            {!isConfigMode && (
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
            )}
          </CardContent>
        </Card>

        {/* Building/Room Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isConfigMode ? "Configuration Details" : selectedBuilding ? "Building Details" : "Campus Overview"}
            </CardTitle>
            <CardDescription>
              {isConfigMode
                ? "Manage building and room configurations"
                : selectedBuilding
                  ? `Detailed information for ${selectedBuildingConfig?.name || selectedBuilding}`
                  : "Click on a building to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConfigMode ? (
              <Tabs defaultValue="buildings">
                <TabsList>
                  <TabsTrigger value="buildings">Buildings</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms</TabsTrigger>
                </TabsList>
                <TabsContent value="buildings" className="space-y-4">
                  <div className="space-y-2">
                    {campusConfig.buildings.map((building) => (
                      <div key={building.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>{building.name}</span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBuilding(building)
                              setShowBuildingDialog(true)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteBuilding(building.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="rooms" className="space-y-4">
                  {selectedBuildingConfig ? (
                    <div className="space-y-2">
                      <h4 className="font-medium">{selectedBuildingConfig.name} Rooms</h4>
                      {selectedBuildingConfig.rooms.map((room) => (
                        <div key={room.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>{room.name}</span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingRoom(room)
                                setShowRoomDialog(true)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteRoom(room.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        className="w-full"
                        onClick={() => {
                          setEditingRoom({
                            id: "",
                            name: "",
                            buildingId: selectedBuildingConfig.id,
                            coordinates: {
                              x: selectedBuildingConfig.coordinates.x + 10,
                              y: selectedBuildingConfig.coordinates.y + 10,
                              width: 30,
                              height: 20,
                            },
                          })
                          setShowRoomDialog(true)
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Room
                      </Button>
                    </div>
                  ) : (
                    <p className="text-gray-500">Select a building to manage its rooms</p>
                  )}
                </TabsContent>
              </Tabs>
            ) : selectedBuildingData && selectedBuildingConfig ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{selectedBuildingConfig.name}</h3>
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
                        <div
                          key={room.room}
                          className={`flex justify-between items-center p-2 rounded cursor-pointer ${
                            selectedRoom === room.room ? "bg-blue-100" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedRoom(selectedRoom === room.room ? null : room.room)}
                        >
                          <span className="text-sm flex items-center space-x-2">
                            <MapPin className="w-3 h-3" />
                            <span>{room.room}</span>
                          </span>
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
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Click on a building in the map to view detailed information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Building Configuration Dialog */}
      <Dialog open={showBuildingDialog} onOpenChange={setShowBuildingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBuilding?.id ? "Edit Building" : "Add New Building"}</DialogTitle>
            <DialogDescription>Configure building details and location on the campus map</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="building-name">Building Name</Label>
              <Input
                id="building-name"
                defaultValue={editingBuilding?.name}
                placeholder="e.g., D4, D3, TC"
                onChange={(e) => setEditingBuilding((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>
            <div>
              <Label htmlFor="building-id">Building ID</Label>
              <Input
                id="building-id"
                defaultValue={editingBuilding?.id}
                placeholder="e.g., d4, d3, tc"
                onChange={(e) =>
                  setEditingBuilding((prev) => (prev ? { ...prev, id: e.target.value.toLowerCase() } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="building-color">Building Color</Label>
              <Input
                id="building-color"
                type="color"
                defaultValue={editingBuilding?.color}
                onChange={(e) => setEditingBuilding((prev) => (prev ? { ...prev, color: e.target.value } : null))}
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="building-x">X Position</Label>
                <Input
                  id="building-x"
                  type="number"
                  defaultValue={editingBuilding?.coordinates.x}
                  onChange={(e) =>
                    setEditingBuilding((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, x: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="building-y">Y Position</Label>
                <Input
                  id="building-y"
                  type="number"
                  defaultValue={editingBuilding?.coordinates.y}
                  onChange={(e) =>
                    setEditingBuilding((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, y: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="building-width">Width</Label>
                <Input
                  id="building-width"
                  type="number"
                  defaultValue={editingBuilding?.coordinates.width}
                  onChange={(e) =>
                    setEditingBuilding((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, width: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="building-height">Height</Label>
                <Input
                  id="building-height"
                  type="number"
                  defaultValue={editingBuilding?.coordinates.height}
                  onChange={(e) =>
                    setEditingBuilding((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, height: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBuildingDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => saveBuildingConfig(editingBuilding || {})}>Save Building</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Configuration Dialog */}
      <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRoom?.id ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>Configure room details and location within the building</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                defaultValue={editingRoom?.name}
                placeholder="e.g., HI-101, Lab A, Cafeteria"
                onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, name: e.target.value } : null))}
              />
            </div>
            <div>
              <Label htmlFor="room-id">Room ID</Label>
              <Input
                id="room-id"
                defaultValue={editingRoom?.id}
                placeholder="e.g., hi-101, lab-a, cafeteria"
                onChange={(e) =>
                  setEditingRoom((prev) => (prev ? { ...prev, id: e.target.value.toLowerCase() } : null))
                }
              />
            </div>
            <div>
              <Label htmlFor="room-floor">Floor</Label>
              <Select
                defaultValue={editingRoom?.floor?.toString()}
                onValueChange={(value) =>
                  setEditingRoom((prev) => (prev ? { ...prev, floor: Number.parseInt(value) } : null))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Ground Floor</SelectItem>
                  <SelectItem value="1">1st Floor</SelectItem>
                  <SelectItem value="2">2nd Floor</SelectItem>
                  <SelectItem value="3">3rd Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="room-x">X Position</Label>
                <Input
                  id="room-x"
                  type="number"
                  defaultValue={editingRoom?.coordinates.x}
                  onChange={(e) =>
                    setEditingRoom((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, x: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="room-y">Y Position</Label>
                <Input
                  id="room-y"
                  type="number"
                  defaultValue={editingRoom?.coordinates.y}
                  onChange={(e) =>
                    setEditingRoom((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, y: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="room-width">Width</Label>
                <Input
                  id="room-width"
                  type="number"
                  defaultValue={editingRoom?.coordinates.width}
                  onChange={(e) =>
                    setEditingRoom((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, width: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="room-height">Height</Label>
                <Input
                  id="room-height"
                  type="number"
                  defaultValue={editingRoom?.coordinates.height}
                  onChange={(e) =>
                    setEditingRoom((prev) =>
                      prev
                        ? {
                            ...prev,
                            coordinates: { ...prev.coordinates, height: Number.parseInt(e.target.value) || 0 },
                          }
                        : null,
                    )
                  }
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRoomDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => saveRoomConfig(editingRoom || {})}>Save Room</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
