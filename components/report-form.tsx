"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function ReportForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Report submitted successfully!",
      description: "Thank you for helping improve campus network quality. We'll investigate this issue.",
    })

    setIsSubmitting(false)
    ;(e.target as HTMLFormElement).reset()
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
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input id="email" name="email" type="email" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select name="location" required>
              <SelectTrigger>
                <SelectValue placeholder="Select campus location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafeteria">Cafeteria</SelectItem>
                <SelectItem value="library">Library</SelectItem>
                <SelectItem value="building-a">Building A</SelectItem>
                <SelectItem value="building-b">Building B</SelectItem>
                <SelectItem value="building-c">Building C</SelectItem>
                <SelectItem value="lab-computer">Computer Lab</SelectItem>
                <SelectItem value="auditorium">Auditorium</SelectItem>
                <SelectItem value="dormitory">Dormitory</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select name="issueType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slow-speed">Slow Internet Speed</SelectItem>
                <SelectItem value="no-connection">No Internet Connection</SelectItem>
                <SelectItem value="intermittent">Intermittent Connection</SelectItem>
                <SelectItem value="wifi-not-working">WiFi Not Working</SelectItem>
                <SelectItem value="high-latency">High Latency/Ping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device">Device Type</Label>
            <Select name="device" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="desktop">Desktop Computer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Issue Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Please describe the network issue in detail..."
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
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
