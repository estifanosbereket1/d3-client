"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2 } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  joinedDate: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "you@example.com",
    role: "Owner",
    joinedDate: "Nov 1, 2024",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@example.com",
    role: "Admin",
    joinedDate: "Nov 3, 2024",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Member",
    joinedDate: "Nov 5, 2024",
  },
]

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member")

  const handleInvite = () => {
    if (inviteEmail) {
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole,
        joinedDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      }
      setMembers([...members, newMember])
      setInviteEmail("")
      setInviteRole("Member")
      setInviteOpen(false)
    }
  }

  const handleRemoveMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter((m) => m.id !== id))
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-purple-100 text-purple-800"
      case "Admin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Team Management</h1>
        <p className="text-muted-foreground mt-2">Manage team members and permissions</p>
      </div>

      {/* Organization Info */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold">Organization Name</Label>
              <p className="text-lg font-medium mt-1">Acme Inc</p>
            </div>
            <div>
              <Label className="text-xs font-semibold">Organization ID</Label>
              <p className="text-sm text-muted-foreground mt-1">org_1234567890</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage who has access to your workspace</CardDescription>
          </div>
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>Send an invitation to a new team member</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    title="role"
                    id="role"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as "Admin" | "Member")}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  >
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <Button onClick={handleInvite} className="w-full">
                  Send Invite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{member.joinedDate}</TableCell>
                  <TableCell>
                    {member.role !== "Owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
