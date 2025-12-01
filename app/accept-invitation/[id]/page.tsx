"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function AcceptInvitationPage() {
    const router = useRouter()
    const { id } = useParams()
    const searchParams = useSearchParams()

    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | null>(null)
    const [invitationData, setInvitationData] = useState({
        id: id || "",
        organizationName: "",
        organizationLogo: "🏢",
        invitedBy: "",
        role: "",
        createdAt: "",
    })

    const { data } = authClient.useSession()

    console.log("Session data", data)

    useEffect(() => {
        const orgName = searchParams.get("orgName") || "Unknown Company"
        const inviterName = searchParams.get("inviterName") || "Unknown"
        const role = searchParams.get("role") || "Member"
        const date = searchParams.get("date") || new Date().toLocaleDateString()

        setInvitationData({
            id: id || "",
            organizationName: decodeURIComponent(orgName),
            organizationLogo: "🏢",
            invitedBy: decodeURIComponent(inviterName),
            role: decodeURIComponent(role),
            createdAt: decodeURIComponent(date),
        })
    }, [id, searchParams])

    const handleAccept = async () => {
        setIsLoading(true)
        if (!data) {
            router.push("/sign-in?id=" + invitationData.id)
        } else {
            const { data, error } = await authClient.organization.acceptInvitation({
                invitationId: invitationData?.id as string, // required
            });
            router.push("/")
            console.log(data, error)
        }
    }

    const handleReject = async () => {
        setIsLoading(true)
        const { data, error } = await authClient.organization.rejectInvitation({
            invitationId: invitationData?.id as string,
        });
        router.replace("/sign-in")
        console.log(data, error)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Invitation</CardTitle>
                    <CardDescription>You've been invited to join an organization</CardDescription>
                </CardHeader>
                <CardContent>
                    {status === null ? (
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                                <div className="text-4xl">{invitationData.organizationLogo}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{invitationData.organizationName}</h3>
                                    <p className="text-sm text-muted-foreground">Invited by {invitationData.invitedBy}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Role: {invitationData.role}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Invitation ID:</span>
                                    <span className="font-mono text-xs">{invitationData.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Sent on:</span>
                                    <span>{invitationData.createdAt}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Button
                                    onClick={handleAccept}
                                    disabled={isLoading}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {isLoading ? "Processing..." : "Accept Invitation"}
                                </Button>
                                <Button onClick={handleReject} disabled={isLoading} variant="outline" className="w-full bg-transparent">
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ) : status === "accepted" ? (
                        <div className="space-y-4 text-center py-8">
                            <div className="flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Invitation Accepted!</h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    You have successfully joined {invitationData.organizationName}. Redirecting to dashboard...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center py-8">
                            <div className="flex justify-center">
                                <XCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Invitation Rejected</h3>
                                <p className="text-sm text-muted-foreground mt-2">You have rejected the invitation. Redirecting...</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
