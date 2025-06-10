export interface BuildingArea {
  id: string
  name: string
  coordinates: { x: number; y: number; width: number; height: number }
  rooms: RoomArea[]
  color: string
}

export interface RoomArea {
  id: string
  name: string
  buildingId: string
  coordinates: { x: number; y: number; width: number; height: number }
  floor?: number
}

export interface CampusConfig {
  buildings: BuildingArea[]
  imageWidth: number
  imageHeight: number
}

// Default campus configuration based on the aerial image
export const defaultCampusConfig: CampusConfig = {
  imageWidth: 800,
  imageHeight: 600,
  buildings: [
    {
      id: "d4",
      name: "D4",
      coordinates: { x: 50, y: 80, width: 120, height: 80 },
      color: "#3b82f6",
      rooms: [
        {
          id: "d4-101",
          name: "D4-101",
          buildingId: "d4",
          coordinates: { x: 60, y: 90, width: 25, height: 20 },
          floor: 1,
        },
        {
          id: "d4-102",
          name: "D4-102",
          buildingId: "d4",
          coordinates: { x: 90, y: 90, width: 25, height: 20 },
          floor: 1,
        },
        {
          id: "d4-103",
          name: "D4-103",
          buildingId: "d4",
          coordinates: { x: 120, y: 90, width: 25, height: 20 },
          floor: 1,
        },
        {
          id: "d4-201",
          name: "D4-201",
          buildingId: "d4",
          coordinates: { x: 60, y: 120, width: 25, height: 20 },
          floor: 2,
        },
        {
          id: "d4-202",
          name: "D4-202",
          buildingId: "d4",
          coordinates: { x: 90, y: 120, width: 25, height: 20 },
          floor: 2,
        },
        {
          id: "lab-d4-a",
          name: "Lab D4-A",
          buildingId: "d4",
          coordinates: { x: 120, y: 120, width: 40, height: 30 },
          floor: 2,
        },
      ],
    },
    {
      id: "d3",
      name: "D3",
      coordinates: { x: 200, y: 80, width: 140, height: 100 },
      color: "#10b981",
      rooms: [
        {
          id: "hi-101",
          name: "HI-101",
          buildingId: "d3",
          coordinates: { x: 210, y: 90, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "hi-102",
          name: "HI-102",
          buildingId: "d3",
          coordinates: { x: 250, y: 90, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "hi-103",
          name: "HI-103",
          buildingId: "d3",
          coordinates: { x: 290, y: 90, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "hi-104",
          name: "HI-104",
          buildingId: "d3",
          coordinates: { x: 210, y: 125, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "hi-201",
          name: "HI-201",
          buildingId: "d3",
          coordinates: { x: 250, y: 125, width: 30, height: 25 },
          floor: 2,
        },
        {
          id: "hi-202",
          name: "HI-202",
          buildingId: "d3",
          coordinates: { x: 290, y: 125, width: 30, height: 25 },
          floor: 2,
        },
      ],
    },
    {
      id: "tc",
      name: "TC",
      coordinates: { x: 380, y: 80, width: 100, height: 120 },
      color: "#f59e0b",
      rooms: [
        {
          id: "tc-101",
          name: "TC-101",
          buildingId: "tc",
          coordinates: { x: 390, y: 90, width: 35, height: 30 },
          floor: 1,
        },
        {
          id: "tc-102",
          name: "TC-102",
          buildingId: "tc",
          coordinates: { x: 435, y: 90, width: 35, height: 30 },
          floor: 1,
        },
        {
          id: "tc-201",
          name: "TC-201",
          buildingId: "tc",
          coordinates: { x: 390, y: 130, width: 35, height: 30 },
          floor: 2,
        },
        {
          id: "auditorium-tc",
          name: "Auditorium TC",
          buildingId: "tc",
          coordinates: { x: 435, y: 130, width: 35, height: 50 },
          floor: 1,
        },
      ],
    },
    {
      id: "saw",
      name: "SAW",
      coordinates: { x: 150, y: 220, width: 180, height: 120 },
      color: "#ef4444",
      rooms: [
        {
          id: "saw-101",
          name: "SAW-101",
          buildingId: "saw",
          coordinates: { x: 160, y: 230, width: 40, height: 30 },
          floor: 1,
        },
        {
          id: "saw-102",
          name: "SAW-102",
          buildingId: "saw",
          coordinates: { x: 210, y: 230, width: 40, height: 30 },
          floor: 1,
        },
        {
          id: "cafeteria",
          name: "Cafeteria",
          buildingId: "saw",
          coordinates: { x: 260, y: 230, width: 60, height: 40 },
          floor: 1,
        },
        {
          id: "library",
          name: "Library",
          buildingId: "saw",
          coordinates: { x: 160, y: 280, width: 80, height: 50 },
          floor: 1,
        },
        {
          id: "saw-201",
          name: "SAW-201",
          buildingId: "saw",
          coordinates: { x: 250, y: 280, width: 40, height: 30 },
          floor: 2,
        },
      ],
    },
    {
      id: "pascasarjana",
      name: "Pascasarjana",
      coordinates: { x: 380, y: 220, width: 120, height: 80 },
      color: "#8b5cf6",
      rooms: [
        {
          id: "pg-101",
          name: "PG-101",
          buildingId: "pascasarjana",
          coordinates: { x: 390, y: 230, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "pg-102",
          name: "PG-102",
          buildingId: "pascasarjana",
          coordinates: { x: 430, y: 230, width: 30, height: 25 },
          floor: 1,
        },
        {
          id: "pg-201",
          name: "PG-201",
          buildingId: "pascasarjana",
          coordinates: { x: 390, y: 265, width: 30, height: 25 },
          floor: 2,
        },
        {
          id: "lab-pg-a",
          name: "Lab PG-A",
          buildingId: "pascasarjana",
          coordinates: { x: 430, y: 265, width: 60, height: 25 },
          floor: 2,
        },
      ],
    },
    {
      id: "other",
      name: "Other Areas",
      coordinates: { x: 550, y: 150, width: 80, height: 60 },
      color: "#6b7280",
      rooms: [
        {
          id: "parking",
          name: "Parking Area",
          buildingId: "other",
          coordinates: { x: 560, y: 160, width: 60, height: 20 },
          floor: 0,
        },
        {
          id: "garden",
          name: "Garden Area",
          buildingId: "other",
          coordinates: { x: 560, y: 185, width: 60, height: 20 },
          floor: 0,
        },
      ],
    },
  ],
}
