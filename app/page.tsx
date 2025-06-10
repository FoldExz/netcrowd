import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Users, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { EnhancedReportForm } from "@/components/enhanced-report-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img src="/images/logo-netcrowd.png" alt="NetCrowd Logo" className="w-8 h-8" />
              <h1 className="text-xl font-bold text-gray-900">NetCrowd</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/reports" className="text-gray-600 hover:text-gray-900">
                View Reports
              </Link>
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Campus Network Issue Reporting</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help improve campus internet connectivity by reporting network issues. Our crowdsourced platform prioritizes
            fixes based on community feedback and QoE data.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Location-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Report issues with precise location data for targeted fixes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Crowdsourced</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Community-driven reporting via web and WhatsApp integration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Data-Driven</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                QoE 2D mapping and analytics for optimal resource allocation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Real-time status updates and transparent issue resolution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Report Form Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Report an Issue</h3>
            <p className="text-gray-600 mb-6">
              Experiencing network problems? Help us identify and prioritize issues by submitting a detailed report.
            </p>
            <EnhancedReportForm />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Alternative Reporting</h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📱</span>
                  <span>WhatsApp Integration</span>
                </CardTitle>
                <CardDescription>Report issues directly via WhatsApp using our automated system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-sm mb-2">Send a message to:</p>
                  <p className="text-lg font-mono text-blue-600">+62 812-3456-7890</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium text-sm mb-2">Message format:</p>
                  <p className="font-mono text-sm text-gray-700">#lapor [location] [description]</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Example: #lapor Cafeteria Slow internet connection, cannot load websites
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
