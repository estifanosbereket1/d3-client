"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function AcceptInvitationPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"pending" | "accepted" | "rejected" | null>(null)


    const { id } = useParams();
    console.log("Idddddddddddddd", id)

    const getCompany = async () => {
        const { data, error } = await authClient.organization.getInvitation({
            query: {
                id: typeof id === "string" ? id : "", // ensure id is a string
            },
        });
        console.log(data, "llllllllllllllllllllll")
    }

    useEffect(() => {
        getCompany()
    }, [])



    // Mock invitation data - replace with actual data fetching
    const invitationData = {
        id: "",
        organizationName: "Acme Inc",
        organizationLogo: "🏢",
        invitedBy: "John Doe",
        role: "Editor",
        createdAt: new Date().toLocaleDateString(),
    }

    const handleAccept = async () => {
        setIsLoading(true)
        setTimeout(() => {
            setStatus("accepted")
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                router.push("/dashboard/table")
            }, 1500)
        }, 500)
    }

    const handleReject = async () => {
        setIsLoading(true)
        setTimeout(() => {
            setStatus("rejected")
            // Redirect to home after a short delay
            setTimeout(() => {
                router.push("/")
            }, 1500)
        }, 500)
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
                            {/* Organization Info */}
                            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg">
                                <div className="text-4xl">{invitationData.organizationLogo}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{invitationData.organizationName}</h3>
                                    <p className="text-sm text-muted-foreground">Invited by {invitationData.invitedBy}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Role: {invitationData.role}</p>
                                </div>
                            </div>

                            {/* Details */}
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

                            {/* Actions */}
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
