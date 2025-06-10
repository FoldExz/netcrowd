"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, RefreshCw, AlertCircle, CheckCircle, Database } from "lucide-react"
import { database } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export function DataManagement() {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: boolean; message: string; imported: number } | null>(null)
  const { toast } = useToast()

  const handleExport = () => {
    try {
      const exportedData = database.exportData()
      const blob = new Blob([exportedData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `netcrowd-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
      })
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      toast({
        title: "No data to import",
        description: "Please paste the JSON data first.",
        variant: "destructive",
      })
      return
    }

    setIsImporting(true)
    setImportResult(null)

    try {
      const result = database.importData(importData)
      setImportResult(result)

      if (result.success) {
        toast({
          title: "Import successful",
          description: result.message,
        })
        setImportData("")
      } else {
        toast({
          title: "Import failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorResult = {
        success: false,
        message: "Unexpected error during import",
        imported: 0,
      }
      setImportResult(errorResult)
      toast({
        title: "Import failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data to default? This cannot be undone.")) {
      database.resetToDefault()
      toast({
        title: "Data reset successful",
        description: "All data has been reset to default values.",
      })
    }
  }

  const getCurrentStats = () => {
    const stats = database.getReportStats()
    return stats
  }

  const stats = getCurrentStats()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>
            Export, import, or reset your NetCrowd data. Useful for sharing data between browsers or devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Data Stats */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Current Database Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Reports:</span>
                <div className="font-bold text-lg">{stats.total}</div>
              </div>
              <div>
                <span className="text-gray-600">Active Issues:</span>
                <div className="font-bold text-lg text-red-600">{stats.active}</div>
              </div>
              <div>
                <span className="text-gray-600">Resolved:</span>
                <div className="font-bold text-lg text-green-600">{stats.resolved}</div>
              </div>
              <div>
                <span className="text-gray-600">Resolution Rate:</span>
                <div className="font-bold text-lg text-blue-600">{stats.resolutionRate}%</div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Export Data</h4>
            <p className="text-sm text-gray-600">
              Download your current data as a JSON file. You can use this to backup your data or share it with other
              devices/browsers.
            </p>
            <Button onClick={handleExport} className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h4 className="font-medium">Import Data</h4>
            <p className="text-sm text-gray-600">
              Paste exported JSON data here to import reports from another browser or device. This will merge with your
              existing data.
            </p>
            <Textarea
              placeholder="Paste your exported JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full sm:w-auto">
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>

            {importResult && (
              <Alert variant={importResult.success ? "default" : "destructive"}>
                {importResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertDescription>
                  {importResult.message}
                  {importResult.success && importResult.imported > 0 && (
                    <span className="block mt-1 font-medium">
                      {importResult.imported} new reports imported successfully.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Reset Section */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-red-600">Danger Zone</h4>
            <p className="text-sm text-gray-600">
              Reset all data to default values. This will permanently delete all current reports and cannot be undone.
            </p>
            <Button onClick={handleReset} variant="destructive" className="w-full sm:w-auto">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Browser Storage Info */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This application uses browser localStorage to store data. This means:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Data is stored locally in your browser only</li>
                <li>Different browsers will have different data</li>
                <li>Incognito/private mode will have separate data</li>
                <li>Clearing browser data will delete all reports</li>
                <li>Use export/import to share data between browsers or devices</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
