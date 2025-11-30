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
import { UserPlus, Trash2, Mail } from "lucide-react"
import { authClient } from "@/lib/auth-client"

type Tab = "members" | "invitations"

export default function TeamPage() {
  const [tab, setTab] = useState<Tab>("members")
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member")

  const { data: activeOrg } = authClient.useActiveOrganization()

  const handleInvite = async () => {
    if (!inviteEmail) return
    // leave data handling to you — call your invite API here
    // example:
    // await authClient.organization.inviteMember({ ... })

    const { data, error } = await authClient.organization.inviteMember({
      email: inviteEmail,
      role: "member", // required 
      organizationId: activeOrg?.id, resend: true,
    });
    console.log("Error", error)
    console.log("data", data)
    setInviteEmail("")
    setInviteRole("member")
    setInviteOpen(false)
  }

  const handleRemoveMember = (id: string) => {
    // implement member removal
  }

  const handleCancelInvitation = (invitationId: string) => {
    // implement invitation cancel/resend/etc
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
      case "Owner":
        return "bg-purple-100 text-purple-800"
      case "admin":
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
              <Label className="text-xs font-semibold">{activeOrg?.name}</Label>
              <p className="text-lg font-medium mt-1">{activeOrg?.slug}</p>
            </div>
            <div>
              <Label className="text-xs font-semibold">Organization ID</Label>
              <p className="text-sm text-muted-foreground mt-1">{activeOrg?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={tab === "members" ? "default" : "ghost"} onClick={() => setTab("members")}>
          Members
        </Button>
        <Button variant={tab === "invitations" ? "default" : "ghost"} onClick={() => setTab("invitations")}>
          Invitations
        </Button>
      </div>

      {/* Members View */}
      {tab === "members" && (
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
                      onChange={(e) => setInviteRole(e.target.value as "admin" | "member")}
                      className="w-full px-3 py-2 border border-input rounded-md text-sm"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
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
                {activeOrg?.members?.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.user?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{member.user?.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {member.createdAt ? new Date(member.createdAt).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>
                      {member.role !== "owner" && (
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
      )}

      {/* Invitations View */}
      {tab === "invitations" && (
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Invitations</CardTitle>
              <CardDescription>Pending invites sent to your organization</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrg?.invitations?.length ? (
                  activeOrg.invitations.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.email}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.role ?? "member"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {inv.createdAt ? new Date(inv.createdAt).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">{inv.status ?? "pending"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(inv.id)}
                            title="Cancel invitation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              /* optional: open mail client to resend link (leave handling to you) */
                              // window.open(`mailto:${inv.email}?subject=Invitation&body=...`)
                            }}
                            title="Resend invitation"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                      No invitations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
