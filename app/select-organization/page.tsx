"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Building2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store"
import { setOrganizationId } from "@/store/slices/organization.slice"

interface Organization {
    id: string
    name: string
    slug: string
    createdAt: Date
    logo?: string | null
    metadata?: any
}

export default function SelectOrganizationPage() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>();

    const orgQuery = authClient.useListOrganizations()
    const organizations: Organization[] | null | undefined = orgQuery.data


    const loading = (orgQuery as any).isLoading ?? organizations === undefined

    const [selectedOrgId, setSelectedOrgId] = useState<{
        id: string,
        slug: string
    }>({
        id: "",
        slug: ""
    })

    useEffect(() => {
        if (!organizations || organizations.length === 0) return
        if (!selectedOrgId) {
            setSelectedOrgId({
                id: organizations[0].id,
                slug: organizations[0].slug
            })
        }
    }, [organizations, selectedOrgId])

    const handleSelectOrg = async (org: Organization) => {

        setSelectedOrgId({
            id: org.id,
            slug: org.slug
        })
    }

    const handleContinue = async () => {
        if (selectedOrgId.id == "") return
        await authClient.organization.setActive({
            organizationId: selectedOrgId.id,
            organizationSlug: selectedOrgId.slug
        });
        dispatch(setOrganizationId(selectedOrgId.id));
        router.push("/dashboard/table")
    }

    const handleCreateOrg = () => {
        router.push("/create-organization")
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="text-white">Loading organizations...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl">Select Organization</CardTitle>
                    <CardDescription>Choose an organization to continue</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {Array.isArray(organizations) && organizations.length > 0 ? (
                            organizations.map((org) => (
                                <div
                                    key={org.id}
                                    onClick={() => handleSelectOrg(org)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${selectedOrgId.id === org.id ? "border-primary bg-primary/5" : "border-slate-200 hover:border-slate-300"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg flex-shrink-0">
                                            {org.logo ? (
                                                typeof org.logo === "string" && org.logo.length <= 2 ? (
                                                    <span>{org.logo}</span>
                                                ) : (
                                                    <span>{org.name.charAt(0).toUpperCase()}</span>
                                                )
                                            ) : (
                                                <Building2 className="w-5 h-5 text-slate-600" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-slate-900">{org.name}</p>
                                            <p className="text-xs text-slate-500">{org.slug}</p>
                                        </div>

                                        {org.metadata?.plan && (
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded flex-shrink-0">
                                                {org.metadata.plan}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm text-slate-500">No organizations found</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <Button onClick={handleContinue} disabled={selectedOrgId.id === ""} className="w-full">
                            Continue
                        </Button>

                        <Button onClick={handleCreateOrg} variant="outline" className="w-full gap-2 bg-transparent">
                            <Plus className="w-4 h-4" />
                            Create Organization
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
