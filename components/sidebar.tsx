"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutGrid, Users, LogOut, User, ChevronDown, Plus, Building } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authClient } from "@/lib/auth-client"
import { AlertDialog } from "@radix-ui/react-alert-dialog"
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { clearOrganizationId, setOrganizationId } from "@/store/slices/organization.slice"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"



interface SidebarProps {
  orgName: string
}



export function Sidebar({ orgName }: SidebarProps) {
  const pathname = usePathname()
  const dispatch = useDispatch<AppDispatch>();

  const { data: organizations } = authClient.useListOrganizations()
  const { data: activeOrg } = authClient.useActiveOrganization()
  const { data: activeMember } = authClient.useActiveMember()
  const activeUser = activeOrg?.members.find((member) => member.userId === activeMember?.userId)
  console.log("Active member", activeMember?.userId, activeUser, activeOrg)

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const router = useRouter()

  console.log("Active org", activeOrg)

  const [currentOrg, setCurrentOrg] = useState(orgName)

  const menuItems = [
    { icon: LayoutGrid, label: "Table", href: "/dashboard/table" },
  ]


  const handleLogout = () => {
    localStorage.removeItem("session")
    dispatch(clearOrganizationId());
    authClient.signOut()
    window.location.href = "/sign-in"
  }

  const handleOrgChange = async (organizationId: string) => {
    const selected = organizations?.find((org) => org.id === organizationId)
    if (selected) {
      await authClient.organization.setActive({
        organizationId: selected.id,
        organizationSlug: selected.slug
      })
      dispatch(setOrganizationId(selected.id));
      setCurrentOrg(selected.name)
      router.refresh()
    }
  }

  useEffect(() => {
    console.log("does it have an active organization")
    console.log(activeOrg)
    if (activeOrg) {
      setCurrentOrg(activeOrg.name)
    }
  }, [activeOrg])

  const currentOrgData = organizations?.find((org) => org.name === currentOrg)

  return (
    <div className="w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col h-screen">
      <div className="p-6 border-b border-sidebar-border">
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-hover focus:outline-none"
              aria-label="Open organization selector"
            >
              <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-semibold flex-shrink-0">
                {currentOrg?.charAt(0).toUpperCase() || "O"}
              </div>

              <div className="flex flex-col text-left truncate">
                <span className="text-sm font-medium truncate">{currentOrg ?? "Select organization"}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {activeOrg?.metadata?.plan ?? "Enterprise"}
                </span>
              </div>

              <ChevronDown className="ml-auto w-4 h-4 text-sidebar-foreground/60" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />

            {organizations?.map((org, i) => (
              <DropdownMenuItem asChild key={org.id}>
                <button
                  className="w-full flex items-center gap-3 px-2 p-2 rounded-md hover:bg-accent/5"
                  onClick={() => handleOrgChange(org.id)}
                >
                  <div className="w-7 h-7 rounded-md bg-muted/10 flex items-center justify-center text-sm">
                    <Building className="w-4 h-4" />
                  </div>

                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium truncate">{org.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{org.slug}</div>
                  </div>

                  <div className="text-xs text-muted-foreground ml-2">{`⌘${i + 1}`}</div>
                </button>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/create-organization" className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent/5">
                <div className="w-7 h-7 rounded-md bg-muted/10 flex items-center justify-center text-sm">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm">Add team</div>
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>


      </div>

      {/* Navigation */}
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

        <nav className="space-y-1">

          <Link key="/dashboard/team" href="/dashboard/team">
            <Button variant={pathname === "/dashboard/team" ? "default" : "ghost"} className="w-full justify-start gap-3">
              <Users className="w-5 h-5" />
              Team Info / Setup
            </Button>
          </Link>

        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-hover">
              <div className="w-9 h-9 rounded bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-semibold">
                {activeUser?.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-left text-sm">
                <span className="font-medium">{activeUser?.user.name}</span>
                <span className="text-xs text-muted-foreground">{activeUser?.user.email}</span>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{activeUser?.user.name}</span>
                <span className="text-xs text-muted-foreground">{activeUser?.user?.email}</span>
              </div>
            </DropdownMenuLabel>



            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>




      <AlertDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90"
            >
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}


{/* <Select value={organizations?.find((org) => org.name === currentOrg)?.id || ""} onValueChange={handleOrgChange}>

          <SelectTrigger className="w-full bg-sidebar text-sidebar-foreground border-sidebar-border">
            <div className="flex items-center gap-3 w-full">
              <div className="w-8 h-8 rounded bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-semibold flex-shrink-0">
                {currentOrg.charAt(0).toUpperCase()}
              </div>

              <div className="flex flex-col text-left">
                <SelectValue placeholder="Select organization" />
              </div>
            </div>
          </SelectTrigger>

          <SelectContent>
            {organizations?.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                <div className="flex items-center gap-3">

                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.slug}</p>
                  </div>
                </div>
              </SelectItem>

            ))}
          </SelectContent>
        </Select> */}