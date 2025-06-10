export interface User {
  id: string
  username: string
  role: "admin" | "user"
  lastLogin?: Date
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
}

// Mock user data - in production, this would be in a database
const mockUsers = [
  {
    id: "admin-1",
    username: "admin",
    password: "admin", // In production, this would be hashed
    role: "admin" as const,
  },
]

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.find((u) => u.username === username && u.password === password)

    if (user) {
      this.currentUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        lastLogin: new Date(),
      }

      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("netcrowd_auth", JSON.stringify(this.currentUser))
      }

      return { success: true, user: this.currentUser }
    }

    return { success: false, error: "Invalid username or password" }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!this.currentUser) {
      return { success: false, error: "Not authenticated" }
    }

    const user = mockUsers.find((u) => u.username === this.currentUser!.username)

    if (user && user.password === currentPassword) {
      user.password = newPassword
      return { success: true }
    }

    return { success: false, error: "Current password is incorrect" }
  }

  async resetPassword(username: string): Promise<{ success: boolean; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.find((u) => u.username === username)

    if (user) {
      // In production, this would send an email with reset link
      user.password = "admin123" // Temporary password
      return { success: true }
    }

    return { success: false, error: "Username not found" }
  }

  logout(): void {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("netcrowd_auth")
    }
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser
    }

    // Try to restore from localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("netcrowd_auth")
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored)
          return this.currentUser
        } catch {
          localStorage.removeItem("netcrowd_auth")
        }
      }
    }

    return null
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === "admin"
  }
}
