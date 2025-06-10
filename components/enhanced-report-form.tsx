"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { buildingRooms } from "@/lib/data"

export function EnhancedReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedBuilding, setSelectedBuilding] = useState<string>("")
  const [availableRooms, setAvailableRooms] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (selectedBuilding && buildingRooms[selectedBuilding]) {
      setAvailableRooms(buildingRooms[selectedBuilding])
    } else {
      setAvailableRooms([])
    }
  }, [selectedBuilding])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const reportData = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string) || "",
      building: formData.get("building") as string,
      room: formData.get("room") as string,
      issueType: formData.get("issueType") as string,
      device: formData.get("device") as string,
      description: formData.get("description") as string,
      severity: formData.get("severity") as string,
    }

    console.log("Form submitting data:", reportData)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      })

      console.log("Form response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("Form submission success:", result)

        toast({
          title: "Report submitted successfully!",
          description: `Thank you for helping improve campus network quality. Report ID: ${result.id}`,
        })

        // Reset form
        ;(e.target as HTMLFormElement).reset()
        setSelectedBuilding("")
        setAvailableRooms([])
      } else {
        const errorData = await response.json()
        console.error("Form submission error:", errorData)
        throw new Error(errorData.error || "Failed to submit report")
      }
    } catch (error) {
      console.error("Form submission catch error:", error)
      toast({
        title: "Error submitting report",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Issue Report</CardTitle>
        <CardDescription>
          Please provide detailed information about the network issue you're experiencing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" name="email" type="email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="building">Building *</Label>
              <Select name="building" required onValueChange={setSelectedBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D4">D4</SelectItem>
                  <SelectItem value="D3">D3</SelectItem>
                  <SelectItem value="TC">TC</SelectItem>
                  <SelectItem value="SAW">SAW</SelectItem>
                  <SelectItem value="Pascasarjana">Pascasarjana</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room/Area *</Label>
              <Select name="room" required disabled={!selectedBuilding}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedBuilding ? "Select room/area" : "Select building first"} />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type *</Label>
            <Select name="issueType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Slow Internet Speed">Slow Internet Speed</SelectItem>
                <SelectItem value="No Internet Connection">No Internet Connection</SelectItem>
                <SelectItem value="Intermittent Connection">Intermittent Connection</SelectItem>
                <SelectItem value="WiFi Not Working">WiFi Not Working</SelectItem>
                <SelectItem value="High Latency/Ping">High Latency/Ping</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Device Type *</Label>
            <Select name="device" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laptop">Laptop</SelectItem>
                <SelectItem value="Smartphone">Smartphone</SelectItem>
                <SelectItem value="Tablet">Tablet</SelectItem>
                <SelectItem value="Desktop Computer">Desktop Computer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Issue Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please describe the network issue in detail..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level *</Label>
            <Select name="severity" required>
              <SelectTrigger>
                <SelectValue placeholder="How severe is this issue?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - Minor inconvenience</SelectItem>
                <SelectItem value="medium">Medium - Affects productivity</SelectItem>
                <SelectItem value="high">High - Cannot work/study</SelectItem>
                <SelectItem value="critical">Critical - Complete outage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
