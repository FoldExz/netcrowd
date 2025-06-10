"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, LogOut, Settings, Shield } from "lucide-react"
import { AuthService, type User as UserType } from "@/lib/auth"
import { ChangePasswordDialog } from "./change-password-dialog"
import { useToast } from "@/hooks/use-toast"

interface UserMenuProps {
  user: UserType
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const { toast } = useToast()
  const authService = AuthService.getInstance()

  const handleLogout = () => {
    authService.logout()
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    })
    onLogout()
  }

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase()
  }

  return (
    <div className="flex items-center space-x-4">
      <ChangePasswordDialog />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white">{getInitials(user.username)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </p>
              {user.lastLogin && (
                <p className="text-xs leading-none text-muted-foreground">
                  Last login: {user.lastLogin.toLocaleString()}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
