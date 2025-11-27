"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, Users, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

interface SidebarProps {
  orgName: string
}

export function Sidebar({ orgName }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { icon: LayoutGrid, label: "Table", href: "/dashboard/table" },
    { icon: Users, label: "Team Info / Setup", href: "/dashboard/team" },
  ]

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = "/sign-in"
  }

  return (
    <div className="w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold">
            {orgName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-sm">{orgName}</h2>
            <p className="text-xs text-sidebar-foreground/70">Enterprise</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <p className="text-xs font-semibold text-sidebar-foreground/60 mb-3 px-3">Platform</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={pathname === item.href ? "default" : "ghost"} className="w-full justify-start gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
