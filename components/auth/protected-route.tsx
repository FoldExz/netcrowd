"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AuthService } from "@/lib/auth"
import { LoginForm } from "./login-form"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const authService = AuthService.getInstance()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const currentUser = authService.getCurrentUser()
    const authenticated = authService.isAuthenticated()
    const isAdmin = authService.isAdmin()

    if (authenticated && (!requireAdmin || isAdmin)) {
      setIsAuthenticated(true)
      setUser(currentUser)
    } else {
      setIsAuthenticated(false)
      setUser(null)
    }

    setIsLoading(false)
  }

  const handleLoginSuccess = () => {
    checkAuth()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  return <>{children}</>
}
