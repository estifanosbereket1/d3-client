"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function JoinOrganizationPage() {
  const router = useRouter()
  const [inviteCode, setInviteCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      const session = localStorage.getItem("session")
      const parsedSession = session ? JSON.parse(session) : {}
      localStorage.setItem(
        "session",
        JSON.stringify({
          ...parsedSession,
          organization: "Joined Organization",
          organizationId: inviteCode,
          role: "member",
        }),
      )
      router.push("/dashboard")
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Join Organization</CardTitle>
          <CardDescription>Enter the invite code to join a workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoinOrg} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                placeholder="XXXX-XXXX-XXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Joining..." : "Join Organization"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/create-organization" className="text-primary hover:underline font-medium">
              Create a new organization instead
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
